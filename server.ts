import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // 1. TRUST PROXY
  // Cloud Run and GCP Load Balancers operate behind reverse proxies.
  // Setting 'trust proxy' enables req.ip to accurately reflect the real end-user IP for rate limiting.
  app.set('trust proxy', 1);

  // 2. SECURITY HEADERS
  // Use Helmet to set secure default HTTP response headers.
  app.use(
    helmet({
      contentSecurityPolicy: false, // Prevents breaking Vite dev scripts & dynamic inline CSS
      crossOriginEmbedderPolicy: false,
      frameguard: false, // Permits embedding inside the AI Studio preview iframe
    })
  );

  // Additional production security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // 3. CORS
  app.use(
    cors({
      origin: process.env.APP_URL || true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 4. PAYLOAD & RESOURCE EXHAUSTION PROTECTION
  // Limit incoming JSON body size to 10kb to prevent payload flooding attacks.
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));

  // 5. RATE LIMITING (Per-IP DoS Protection)
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // Default 15 minutes
  const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 300; // Default 300 requests per 15 min per IP

  const apiRateLimiter = rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again later.' },
    statusCode: 429,
  });

  // Apply rate limiter specifically to API endpoints
  app.use('/api/', apiRateLimiter);

  // 6. HEALTH CHECK ENDPOINT
  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      app: 'CGPA Calculator DIU',
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Helper for strict server-side numeric validation
  function validateMark(value: any, name: string, min: number, max: number): { valid: boolean; value: number; error?: string } {
    if (value === undefined || value === null || value === '') {
      return { valid: true, value: 0 };
    }
    const num = Number(value);
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
      return { valid: false, value: 0, error: `${name} must be a valid number` };
    }
    if (num < min || num > max) {
      return { valid: false, value: 0, error: `${name} must be between ${min} and ${max}` };
    }
    return { valid: true, value: num };
  }

  // 7. SERVER-SIDE COURSE GRADE CALCULATION ENDPOINT
  app.post('/api/calculate/course', (req, res, next) => {
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        res.status(400).json({ error: 'Invalid request payload format. Expected JSON object.' });
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
        courseName = '',
        courseCode = '',
      } = req.body;

      // Validate string fields length to prevent memory exhaustion
      if (typeof courseName === 'string' && courseName.length > 100) {
        res.status(400).json({ error: 'Course name must not exceed 100 characters' });
        return;
      }
      if (typeof courseCode === 'string' && courseCode.length > 20) {
        res.status(400).json({ error: 'Course code must not exceed 20 characters' });
        return;
      }

      // Handle attendance: either direct percentage (0-100) or direct mark (0-7)
      let attendanceMark = 0;
      if (attendancePercent !== undefined && attendancePercent !== null && attendancePercent !== '') {
        const checkAttPerc = validateMark(attendancePercent, 'Attendance percentage', 0, 100);
        if (!checkAttPerc.valid) {
          res.status(400).json({ error: checkAttPerc.error });
          return;
        }
        attendanceMark = Number(((checkAttPerc.value / 100) * 7).toFixed(2));
      } else {
        const checkAtt = validateMark(attendance, 'Attendance mark', 0, 7);
        if (!checkAtt.valid) {
          res.status(400).json({ error: checkAtt.error });
          return;
        }
        attendanceMark = checkAtt.value;
      }

      // Validate all assessment components against DIU standard mark limits
      const validations = [
        validateMark(quiz1, 'Quiz 1', 0, 15),
        validateMark(quiz2, 'Quiz 2', 0, 15),
        validateMark(quiz3, 'Quiz 3', 0, 15),
        validateMark(assignment, 'Assignment', 0, 5),
        validateMark(presentation, 'Presentation', 0, 8),
        validateMark(midTerm, 'Mid-Term', 0, 25),
        validateMark(finalExam, 'Final Exam', 0, 40),
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

      let letterGrade = 'F';
      let gradePoint = 0.0;

      if (totalMark >= 80) { letterGrade = 'A+'; gradePoint = 4.0; }
      else if (totalMark >= 75) { letterGrade = 'A'; gradePoint = 3.75; }
      else if (totalMark >= 70) { letterGrade = 'A-'; gradePoint = 3.5; }
      else if (totalMark >= 65) { letterGrade = 'B+'; gradePoint = 3.25; }
      else if (totalMark >= 60) { letterGrade = 'B'; gradePoint = 3.0; }
      else if (totalMark >= 55) { letterGrade = 'B-'; gradePoint = 2.75; }
      else if (totalMark >= 50) { letterGrade = 'C+'; gradePoint = 2.5; }
      else if (totalMark >= 45) { letterGrade = 'C'; gradePoint = 2.25; }
      else if (totalMark >= 40) { letterGrade = 'D'; gradePoint = 2.0; }

      res.status(200).json({
        courseName: typeof courseName === 'string' ? courseName.trim() : '',
        courseCode: typeof courseCode === 'string' ? courseCode.trim().toUpperCase() : '',
        attendanceMark,
        quizAverage: Number(quizAvg.toFixed(2)),
        assignmentMark: ass,
        presentationMark: pres,
        midTermMark: mid,
        finalExamMark: final,
        totalMark,
        letterGrade,
        gradePoint,
      });
    } catch (err) {
      next(err);
    }
  });

  // 8. VITE DEV / PRODUCTION STATIC SERVING WITH CACHING
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(
      express.static(distPath, {
        maxAge: '1y',
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
          }
        },
      })
    );
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 9. GLOBAL ERROR HANDLING MIDDLEWARE
  // Catches unhandled errors and returns safe, non-sensitive JSON without exposing stack traces
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (res.headersSent) return;

    if (err?.type === 'entity.too.large' || err?.status === 413 || err?.statusCode === 413) {
      res.status(413).json({ error: 'Payload too large. Maximum allowed request size is 10KB.' });
      return;
    }

    if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
      res.status(400).json({ error: 'Malformed JSON payload in request body.' });
      return;
    }

    console.error('[Unhandled Server Error]:', err?.message || err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CGPA Calculator DIU Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
