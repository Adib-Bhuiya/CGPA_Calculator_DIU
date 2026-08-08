export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';

export interface GradeScaleItem {
  minMark: number;
  maxMark: number;
  letterGrade: LetterGrade;
  gradePoint: number;
  description: string;
}

export interface QuizMarks {
  quiz1: number | '';
  quiz2: number | '';
  quiz3: number | '';
}

export interface CourseAssessmentMarks {
  attendance: number | ''; // Max 7
  quiz1: number | '';      // Max 15
  quiz2: number | '';      // Max 15
  quiz3: number | '';      // Max 15
  assignment: number | ''; // Max 5
  presentation: number | ''; // Max 8
  midTerm: number | '';    // Max 25
  finalExam: number | '';  // Max 40
}

export interface CourseCalculationResult {
  courseName: string;
  courseCode: string;
  creditHours: number;
  attendanceMark: number;
  quiz1Mark: number;
  quiz2Mark: number;
  quiz3Mark: number;
  quizAverage: number;
  assignmentMark: number;
  presentationMark: number;
  midTermMark: number;
  finalExamMark: number;
  totalMark: number;
  letterGrade: LetterGrade;
  gradePoint: number;
}

export interface GpaCourseItem {
  id: string;
  courseName: string;
  courseCode: string;
  credits: number;
  letterGrade: LetterGrade;
  gradePoint: number;
  inputType?: 'grade' | 'marks';
  customMark?: number | '';
}

export interface SemesterRecord {
  id: string;
  semesterName: string;
  gpa: number;
  credits: number;
  courses?: GpaCourseItem[];
}

export interface AcademicData {
  semesters: SemesterRecord[];
  savedCourseCalculations: CourseCalculationResult[];
  profileName?: string;
  studentId?: string;
  department?: string;
}

export interface TargetPredictionInput {
  currentCGPA: number;
  completedCredits: number;
  remainingCredits: number;
  targetCGPA: number;
}

export interface TargetPredictionResult {
  requiredGPA: number;
  isPossible: boolean;
  isAlreadyAchieved: boolean;
  message: string;
  totalCredits: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
