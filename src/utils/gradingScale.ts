import { GradeScaleItem, LetterGrade } from '../types';

export const DIU_GRADING_SCALE: GradeScaleItem[] = [
  { minMark: 80, maxMark: 100, letterGrade: 'A+', gradePoint: 4.00, description: 'Outstanding / Excellent' },
  { minMark: 75, maxMark: 79,  letterGrade: 'A',  gradePoint: 3.75, description: 'Very Good' },
  { minMark: 70, maxMark: 74,  letterGrade: 'A-', gradePoint: 3.50, description: 'Good' },
  { minMark: 65, maxMark: 69,  letterGrade: 'B+', gradePoint: 3.25, description: 'Satisfactory' },
  { minMark: 60, maxMark: 64,  letterGrade: 'B',  gradePoint: 3.00, description: 'Above Average' },
  { minMark: 55, maxMark: 59,  letterGrade: 'B-', gradePoint: 2.75, description: 'Average' },
  { minMark: 50, maxMark: 54,  letterGrade: 'C+', gradePoint: 2.50, description: 'Below Average' },
  { minMark: 45, maxMark: 49,  letterGrade: 'C',  gradePoint: 2.25, description: 'Passing' },
  { minMark: 40, maxMark: 44,  letterGrade: 'D',  gradePoint: 2.00, description: 'Conditional Pass' },
  { minMark: 0,  maxMark: 39,  letterGrade: 'F',  gradePoint: 0.00, description: 'Fail' },
];

export const GRADE_POINT_MAP: Record<LetterGrade, number> = {
  'A+': 4.00,
  'A':  3.75,
  'A-': 3.50,
  'B+': 3.25,
  'B':  3.00,
  'B-': 2.75,
  'C+': 2.50,
  'C':  2.25,
  'D':  2.00,
  'F':  0.00,
};

export const MARK_LIMITS = {
  attendance: { max: 7, label: 'Attendance', description: 'Class attendance and participation' },
  quiz: { max: 15, label: 'Quiz / Class Test (Average of 3)', description: 'Best 3 Quiz marks average (each entered out of 15)' },
  assignment: { max: 5, label: 'Assignment', description: 'Individual or group homework assignment' },
  presentation: { max: 8, label: 'Presentation', description: 'Oral or project presentation' },
  midTerm: { max: 25, label: 'Mid-Term Exam', description: 'Mid-semester written evaluation' },
  finalExam: { max: 40, label: 'Final Exam', description: 'End-semester comprehensive examination' },
};

export const TOTAL_MAX_MARKS = 100;
