var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = Number(process.env.PORT) || 3e3;
  app.set("trust proxy", 1);
  app.use(
    (0, import_helmet.default)({
      contentSecurityPolicy: false,
      // Prevents breaking Vite dev scripts & dynamic inline CSS
      crossOriginEmbedderPolicy: false,
      frameguard: false
      // Permits embedding inside the AI Studio preview iframe
    })
  );
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (process.env.NODE_ENV === "production") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    next();
  });
  app.use(
    (0, import_cors.default)({
      origin: process.env.APP_URL || true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    })
  );
  app.use(import_express.default.json({ limit: "10kb" }));
  app.use(import_express.default.urlencoded({ extended: false, limit: "10kb" }));
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1e3;
  const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 300;
  const apiRateLimiter = (0, import_express_rate_limit.default)({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests from this IP, please try again later." },
    statusCode: 429
  });
  app.use("/api/", apiRateLimiter);
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      app: "CGPA Calculator DIU",
      time: (/* @__PURE__ */ new Date()).toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });
  function validateMark(value, name, min, max) {
    if (value === void 0 || value === null || value === "") {
      return { valid: true, value: 0 };
    }
    const num = Number(value);
    if (typeof num !== "number" || isNaN(num) || !isFinite(num)) {
      return { valid: false, value: 0, error: `${name} must be a valid number` };
    }
    if (num < min || num > max) {
      return { valid: false, value: 0, error: `${name} must be between ${min} and ${max}` };
    }
    return { valid: true, value: num };
  }
  app.post("/api/calculate/course", (req, res, next) => {
    try {
      if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        res.status(400).json({ error: "Invalid request payload format. Expected JSON object." });
        return;
      }
      const {
        attendance,
        attendancePercent,
        quiz1,
        quiz2,
        quiz3,
        assignment,
        presentation,
        midTerm,
        finalExam,
        courseName = "",
        courseCode = ""
      } = req.body;
      if (typeof courseName === "string" && courseName.length > 100) {
        res.status(400).json({ error: "Course name must not exceed 100 characters" });
        return;
      }
      if (typeof courseCode === "string" && courseCode.length > 20) {
        res.status(400).json({ error: "Course code must not exceed 20 characters" });
        return;
      }
      let attendanceMark = 0;
      if (attendancePercent !== void 0 && attendancePercent !== null && attendancePercent !== "") {
        const checkAttPerc = validateMark(attendancePercent, "Attendance percentage", 0, 100);
        if (!checkAttPerc.valid) {
          res.status(400).json({ error: checkAttPerc.error });
          return;
        }
        attendanceMark = Number((checkAttPerc.value / 100 * 7).toFixed(2));
      } else {
        const checkAtt = validateMark(attendance, "Attendance mark", 0, 7);
        if (!checkAtt.valid) {
          res.status(400).json({ error: checkAtt.error });
          return;
        }
        attendanceMark = checkAtt.value;
      }
      const validations = [
        validateMark(quiz1, "Quiz 1", 0, 15),
        validateMark(quiz2, "Quiz 2", 0, 15),
        validateMark(quiz3, "Quiz 3", 0, 15),
        validateMark(assignment, "Assignment", 0, 5),
        validateMark(presentation, "Presentation", 0, 8),
        validateMark(midTerm, "Mid-Term", 0, 25),
        validateMark(finalExam, "Final Exam", 0, 40)
      ];
      for (const val of validations) {
        if (!val.valid) {
          res.status(400).json({ error: val.error });
          return;
        }
      }
      const q1 = validations[0].value;
      const q2 = validations[1].value;
      const q3 = validations[2].value;
      const ass = validations[3].value;
      const pres = validations[4].value;
      const mid = validations[5].value;
      const final = validations[6].value;
      const quizAvg = (q1 + q2 + q3) / 3;
      const rawTotal = attendanceMark + quizAvg + ass + pres + mid + final;
      const totalMark = Number(Math.min(100, Math.max(0, rawTotal)).toFixed(2));
      let letterGrade = "F";
      let gradePoint = 0;
      if (totalMark >= 80) {
        letterGrade = "A+";
        gradePoint = 4;
      } else if (totalMark >= 75) {
        letterGrade = "A";
        gradePoint = 3.75;
      } else if (totalMark >= 70) {
        letterGrade = "A-";
        gradePoint = 3.5;
      } else if (totalMark >= 65) {
        letterGrade = "B+";
        gradePoint = 3.25;
      } else if (totalMark >= 60) {
        letterGrade = "B";
        gradePoint = 3;
      } else if (totalMark >= 55) {
        letterGrade = "B-";
        gradePoint = 2.75;
      } else if (totalMark >= 50) {
        letterGrade = "C+";
        gradePoint = 2.5;
      } else if (totalMark >= 45) {
        letterGrade = "C";
        gradePoint = 2.25;
      } else if (totalMark >= 40) {
        letterGrade = "D";
        gradePoint = 2;
      }
      res.status(200).json({
        courseName: typeof courseName === "string" ? courseName.trim() : "",
        courseCode: typeof courseCode === "string" ? courseCode.trim().toUpperCase() : "",
        attendanceMark,
        quizAverage: Number(quizAvg.toFixed(2)),
        assignmentMark: ass,
        presentationMark: pres,
        midTermMark: mid,
        finalExamMark: final,
        totalMark,
        letterGrade,
        gradePoint
      });
    } catch (err) {
      next(err);
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(
      import_express.default.static(distPath, {
        maxAge: "1y",
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache, must-revalidate");
          }
        }
      })
    );
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.use((err, _req, res, _next) => {
    if (res.headersSent) return;
    if (err?.type === "entity.too.large" || err?.status === 413 || err?.statusCode === 413) {
      res.status(413).json({ error: "Payload too large. Maximum allowed request size is 10KB." });
      return;
    }
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res.status(400).json({ error: "Malformed JSON payload in request body." });
      return;
    }
    console.error("[Unhandled Server Error]:", err?.message || err);
    res.status(500).json({ error: "An internal server error occurred." });
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CGPA Calculator DIU Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
