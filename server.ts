import express from 'express';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API endpoints for backend functionality
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'CGPA Calculator DIU', time: new Date().toISOString() });
  });

  // API helper route for calculating course grade on server
  app.post('/api/calculate/course', (req, res) => {
    try {
      const { attendance = 0, quiz1 = 0, quiz2 = 0, quiz3 = 0, assignment = 0, presentation = 0, midTerm = 0, finalExam = 0 } = req.body;
      const quizAvg = (Number(quiz1) + Number(quiz2) + Number(quiz3)) / 3;
      const totalMark = Number((Number(attendance) + quizAvg + Number(assignment) + Number(presentation) + Number(midTerm) + Number(finalExam)).toFixed(2));

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

      res.json({
        totalMark,
        quizAverage: Number(quizAvg.toFixed(2)),
        letterGrade,
        gradePoint,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Invalid input marks' });
    }
  });

  // Vite middleware for dev vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CGPA Calculator DIU Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
