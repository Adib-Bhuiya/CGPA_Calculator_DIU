import { CourseAssessmentMarks, CourseCalculationResult, GpaCourseItem, GradeScaleItem, LetterGrade, SemesterRecord, TargetPredictionResult } from '../types';
import { DIU_GRADING_SCALE, GRADE_POINT_MAP } from './gradingScale';

/**
 * Format any number to exact decimal places (default 2)
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return (0).toFixed(decimals);
  return Number(value).toFixed(decimals);
}

/**
 * Calculate quiz average from 3 quizzes
 * Quiz Average = (Q1 + Q2 + Q3) / 3
 */
export function calculateQuizAverage(quiz1: number, quiz2: number, quiz3: number): number {
  const q1 = Math.max(0, Math.min(15, quiz1 || 0));
  const q2 = Math.max(0, Math.min(15, quiz2 || 0));
  const q3 = Math.max(0, Math.min(15, quiz3 || 0));
  const avg = (q1 + q2 + q3) / 3;
  return Number(avg.toFixed(2));
}

/**
 * Determine letter grade and grade point from numerical final mark (0 - 100)
 */
export function getGradeFromMark(finalMark: number): GradeScaleItem {
  const roundedMark = Math.round(finalMark * 100) / 100;
  
  for (const scale of DIU_GRADING_SCALE) {
    if (roundedMark >= scale.minMark && roundedMark <= scale.maxMark) {
      return scale;
    }
  }
  
  // Default fallback for anything outside
  if (roundedMark > 100) return DIU_GRADING_SCALE[0];
  return DIU_GRADING_SCALE[DIU_GRADING_SCALE.length - 1]; // F
}

/**
 * Get grade point from letter grade string
 */
export function getGradePointFromLetter(letterGrade: LetterGrade): number {
  return GRADE_POINT_MAP[letterGrade] ?? 0.00;
}

/**
 * Calculate full course marks & grade result
 */
export function calculateCourseMarks(
  courseName: string,
  courseCode: string,
  creditHours: number,
  marks: CourseAssessmentMarks
): CourseCalculationResult {
  const attendance = Number(marks.attendance) || 0;
  const q1 = Number(marks.quiz1) || 0;
  const q2 = Number(marks.quiz2) || 0;
  const q3 = Number(marks.quiz3) || 0;
  const assignment = Number(marks.assignment) || 0;
  const presentation = Number(marks.presentation) || 0;
  const midTerm = Number(marks.midTerm) || 0;
  const finalExam = Number(marks.finalExam) || 0;

  const quizAverage = calculateQuizAverage(q1, q2, q3);

  const rawTotal = attendance + quizAverage + assignment + presentation + midTerm + finalExam;
  const totalMark = Number(Math.min(100, Math.max(0, rawTotal)).toFixed(2));

  const gradeInfo = getGradeFromMark(totalMark);

  return {
    courseName: courseName.trim() || 'Untitled Course',
    courseCode: courseCode.trim().toUpperCase() || 'CSE101',
    creditHours: Math.max(1, creditHours || 3),
    attendanceMark: attendance,
    quiz1Mark: q1,
    quiz2Mark: q2,
    quiz3Mark: q3,
    quizAverage,
    assignmentMark: assignment,
    presentationMark: presentation,
    midTermMark: midTerm,
    finalExamMark: finalExam,
    totalMark,
    letterGrade: gradeInfo.letterGrade,
    gradePoint: gradeInfo.gradePoint,
  };
}

/**
 * Calculate GPA for a list of courses in a semester
 * GPA = Sum(Credit * Grade Point) / Sum(Credits)
 */
export function calculateSemesterGPA(courses: GpaCourseItem[]): {
  gpa: number;
  totalCredits: number;
  totalQualityPoints: number;
} {
  if (!courses || courses.length === 0) {
    return { gpa: 0, totalCredits: 0, totalQualityPoints: 0 };
  }

  let totalQualityPoints = 0;
  let totalCredits = 0;

  courses.forEach((c) => {
    const cred = Number(c.credits) || 0;
    const gp = Number(c.gradePoint) || 0;
    totalCredits += cred;
    totalQualityPoints += cred * gp;
  });

  const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    gpa: Number(gpa.toFixed(2)),
    totalCredits,
    totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
  };
}

/**
 * Calculate overall CGPA across semesters using weighted formula:
 * CGPA = Sum(Semester GPA * Semester Credits) / Sum(Semester Credits)
 */
export function calculateOverallCGPA(semesters: SemesterRecord[]): {
  cgpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  semesterCount: number;
} {
  if (!semesters || semesters.length === 0) {
    return { cgpa: 0, totalCredits: 0, totalQualityPoints: 0, semesterCount: 0 };
  }

  let totalQualityPoints = 0;
  let totalCredits = 0;

  semesters.forEach((s) => {
    const cred = Number(s.credits) || 0;
    const gpa = Number(s.gpa) || 0;
    totalCredits += cred;
    totalQualityPoints += cred * gpa;
  });

  const cgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    cgpa: Number(cgpa.toFixed(2)),
    totalCredits,
    totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
    semesterCount: semesters.length,
  };
}

/**
 * Calculate required GPA to reach a target CGPA
 * Formula: Required GPA = (Target CGPA * Total Credits - Current CGPA * Completed Credits) / Remaining Credits
 */
export function calculateRequiredGPA(
  currentCGPA: number,
  completedCredits: number,
  remainingCredits: number,
  targetCGPA: number
): TargetPredictionResult {
  const curr = Math.max(0, Math.min(4, currentCGPA || 0));
  const comp = Math.max(0, completedCredits || 0);
  const rem = Math.max(0, remainingCredits || 0);
  const targ = Math.max(0, Math.min(4, targetCGPA || 0));

  const totalCredits = comp + rem;

  if (totalCredits <= 0 || rem <= 0) {
    return {
      requiredGPA: 0,
      isPossible: false,
      isAlreadyAchieved: curr >= targ,
      message: rem <= 0 ? 'Remaining credits must be greater than 0.' : 'Total credits must be greater than 0.',
      totalCredits,
    };
  }

  // Current total quality points earned
  const currentQualityPoints = curr * comp;
  // Total quality points needed for target
  const targetQualityPoints = targ * totalCredits;
  // Quality points needed in remaining credits
  const neededQualityPoints = targetQualityPoints - currentQualityPoints;

  const requiredGPA = neededQualityPoints / rem;
  const formattedReqGPA = Number(requiredGPA.toFixed(2));

  // Max possible CGPA if student scores 4.00 in all remaining credits
  const maxPossibleQualityPoints = currentQualityPoints + 4.00 * rem;
  const maxPossibleCGPA = (maxPossibleQualityPoints / totalCredits).toFixed(2);

  if (curr >= targ) {
    return {
      requiredGPA: Math.max(0, formattedReqGPA),
      isPossible: true,
      isAlreadyAchieved: true,
      message: `🎉 Great job! Your current CGPA (${formatNumber(curr)}) already meets or exceeds your target CGPA (${formatNumber(targ)}).`,
      totalCredits,
    };
  }

  if (formattedReqGPA > 4.00) {
    return {
      requiredGPA: formattedReqGPA,
      isPossible: false,
      isAlreadyAchieved: false,
      message: `Your target CGPA of ${formatNumber(targ)} is not achievable with the remaining ${rem} credits under the current 4.00 grading scale. Maximum CGPA you can reach is ${maxPossibleCGPA} even if you score a perfect 4.00 in all remaining credits.`,
      totalCredits,
    };
  }

  if (formattedReqGPA < 0) {
    return {
      requiredGPA: 0.0,
      isPossible: true,
      isAlreadyAchieved: true,
      message: `You are well ahead! You need a GPA of 0.00 in remaining credits to maintain your target CGPA of ${formatNumber(targ)}.`,
      totalCredits,
    };
  }

  return {
    requiredGPA: formattedReqGPA,
    isPossible: true,
    isAlreadyAchieved: false,
    message: `To achieve your target CGPA of ${formatNumber(targ)}, you need an average GPA of ${formatNumber(formattedReqGPA)} in your remaining ${rem} credits.`,
    totalCredits,
  };
}

/**
 * Predict future CGPA based on expected future GPA
 */
export function predictFutureCGPA(
  currentCGPA: number,
  completedCredits: number,
  futureGPA: number,
  futureCredits: number
): { projectedCGPA: number; totalCredits: number; gainLoss: number } {
  const curr = Math.max(0, Math.min(4, currentCGPA || 0));
  const comp = Math.max(0, completedCredits || 0);
  const futGPA = Math.max(0, Math.min(4, futureGPA || 0));
  const futCred = Math.max(0, futureCredits || 0);

  const totalCredits = comp + futCred;
  if (totalCredits <= 0) {
    return { projectedCGPA: curr, totalCredits: 0, gainLoss: 0 };
  }

  const currentPoints = curr * comp;
  const futurePoints = futGPA * futCred;
  const projectedCGPA = Number(((currentPoints + futurePoints) / totalCredits).toFixed(2));
  const gainLoss = Number((projectedCGPA - curr).toFixed(2));

  return {
    projectedCGPA,
    totalCredits,
    gainLoss,
  };
}
