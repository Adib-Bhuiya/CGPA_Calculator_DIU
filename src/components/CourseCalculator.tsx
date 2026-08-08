import React, { useState, useMemo } from 'react';
import { CourseAssessmentMarks, CourseCalculationResult } from '../types';
import { calculateCourseMarks, calculateQuizAverage, formatNumber } from '../utils/calculations';
import { MARK_LIMITS } from '../utils/gradingScale';
import {
  Calculator,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  PlusCircle,
  Sparkles,
  Info,
  AlertCircle,
  BookmarkPlus,
} from 'lucide-react';

interface CourseCalculatorProps {
  onSaveToGpaCalculator: (courseResult: CourseCalculationResult) => void;
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const CourseCalculator: React.FC<CourseCalculatorProps> = ({
  onSaveToGpaCalculator,
  addToast,
}) => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [creditHours, setCreditHours] = useState<number | ''>(3);

  const [marks, setMarks] = useState<CourseAssessmentMarks>({
    attendance: '',
    quiz1: '',
    quiz2: '',
    quiz3: '',
    assignment: '',
    presentation: '',
    midTerm: '',
    finalExam: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation errors map
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (marks.attendance !== '' && (marks.attendance < 0 || marks.attendance > 7)) {
      errs.attendance = 'Attendance mark must be between 0 and 7';
    }
    if (marks.quiz1 !== '' && (marks.quiz1 < 0 || marks.quiz1 > 15)) {
      errs.quiz1 = 'Quiz 1 mark must be between 0 and 15';
    }
    if (marks.quiz2 !== '' && (marks.quiz2 < 0 || marks.quiz2 > 15)) {
      errs.quiz2 = 'Quiz 2 mark must be between 0 and 15';
    }
    if (marks.quiz3 !== '' && (marks.quiz3 < 0 || marks.quiz3 > 15)) {
      errs.quiz3 = 'Quiz 3 mark must be between 0 and 15';
    }
    if (marks.assignment !== '' && (marks.assignment < 0 || marks.assignment > 5)) {
      errs.assignment = 'Assignment mark must be between 0 and 5';
    }
    if (marks.presentation !== '' && (marks.presentation < 0 || marks.presentation > 8)) {
      errs.presentation = 'Presentation mark must be between 0 and 8';
    }
    if (marks.midTerm !== '' && (marks.midTerm < 0 || marks.midTerm > 25)) {
      errs.midTerm = 'Mid-Term mark must be between 0 and 25';
    }
    if (marks.finalExam !== '' && (marks.finalExam < 0 || marks.finalExam > 40)) {
      errs.finalExam = 'Final Exam mark must be between 0 and 40';
    }
    if (creditHours !== '' && (creditHours <= 0 || creditHours > 12)) {
      errs.creditHours = 'Credit hours must be between 1 and 12';
    }

    return errs;
  }, [marks, creditHours]);

  const isValid = Object.keys(errors).length === 0;

  // Real-time calculation result
  const result: CourseCalculationResult | null = useMemo(() => {
    if (!isValid) return null;
    return calculateCourseMarks(
      courseName,
      courseCode,
      Number(creditHours) || 3,
      marks
    );
  }, [courseName, courseCode, creditHours, marks, isValid]);

  const handleMarkChange = (field: keyof CourseAssessmentMarks, val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (val === '') {
      setMarks((prev) => ({ ...prev, [field]: '' }));
      return;
    }
    const num = parseFloat(val);
    setMarks((prev) => ({ ...prev, [field]: isNaN(num) ? '' : num }));
  };

  const handleReset = () => {
    setCourseName('');
    setCourseCode('');
    setCreditHours(3);
    setMarks({
      attendance: '',
      quiz1: '',
      quiz2: '',
      quiz3: '',
      assignment: '',
      presentation: '',
      midTerm: '',
      finalExam: '',
    });
    setTouched({});
    addToast('Fields reset', 'All course mark fields cleared', 'info');
  };

  const handleSaveToGPA = () => {
    if (!result) {
      addToast('Validation Error', 'Please fix all errors before saving course', 'error');
      return;
    }
    onSaveToGpaCalculator(result);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Official 100-Mark DIU Grading Logic</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Course Mark Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Enter marks for each component. Quiz marks automatically compute the 3-Quiz average (out of 15).
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Fields</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT FORM (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Course & Assessment Entry
          </h2>

          {/* Basic Course Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Code
              </label>
              <input
                type="text"
                placeholder="e.g. CSE333"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-semibold"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Name
              </label>
              <input
                type="text"
                placeholder="e.g. Web Engineering"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Credit Hours
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={creditHours}
                onChange={(e) => setCreditHours(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
              />
              {errors.creditHours && (
                <p className="text-[10px] text-rose-500 mt-1">{errors.creditHours}</p>
              )}
            </div>
          </div>

          {/* QUIZ SECTION BOX */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                  Quiz / Class Test (Max 15 Marks Total)
                </h3>
              </div>
              <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/80 px-2.5 py-0.5 rounded-full">
                Avg: {formatNumber(calculateQuizAverage(Number(marks.quiz1), Number(marks.quiz2), Number(marks.quiz3)))} / 15
              </span>
            </div>

            <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
              Enter 3 quiz marks (each out of 15). The arithmetic average <code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded text-indigo-900 dark:text-indigo-200 font-mono">(Q1 + Q2 + Q3) / 3</code> serves as the final 15-mark Quiz component.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-1">
              {/* Quiz 1 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quiz 1 (Max 15)
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.5}
                  value={marks.quiz1}
                  onChange={(e) => handleMarkChange('quiz1', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none ${
                    errors.quiz1 ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.quiz1 && <p className="text-[10px] text-rose-500 mt-1">{errors.quiz1}</p>}
              </div>

              {/* Quiz 2 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quiz 2 (Max 15)
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.5}
                  value={marks.quiz2}
                  onChange={(e) => handleMarkChange('quiz2', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none ${
                    errors.quiz2 ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.quiz2 && <p className="text-[10px] text-rose-500 mt-1">{errors.quiz2}</p>}
              </div>

              {/* Quiz 3 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quiz 3 (Max 15)
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.5}
                  value={marks.quiz3}
                  onChange={(e) => handleMarkChange('quiz3', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none ${
                    errors.quiz3 ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.quiz3 && <p className="text-[10px] text-rose-500 mt-1">{errors.quiz3}</p>}
              </div>
            </div>
          </div>

          {/* OTHER 5 COMPONENTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Attendance (Max 7) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Attendance (Max 7)
                </label>
                <span className="text-[10px] text-slate-400">Class presence</span>
              </div>
              <input
                type="number"
                min={0}
                max={7}
                step={0.5}
                value={marks.attendance}
                onChange={(e) => handleMarkChange('attendance', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.attendance ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.attendance && <p className="text-[10px] text-rose-500 mt-1">{errors.attendance}</p>}
            </div>

            {/* Assignment (Max 5) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Assignment (Max 5)
                </label>
                <span className="text-[10px] text-slate-400">Lab/theory homework</span>
              </div>
              <input
                type="number"
                min={0}
                max={5}
                step={0.5}
                value={marks.assignment}
                onChange={(e) => handleMarkChange('assignment', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.assignment ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.assignment && <p className="text-[10px] text-rose-500 mt-1">{errors.assignment}</p>}
            </div>

            {/* Presentation (Max 8) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Presentation (Max 8)
                </label>
                <span className="text-[10px] text-slate-400">Project / Oral</span>
              </div>
              <input
                type="number"
                min={0}
                max={8}
                step={0.5}
                value={marks.presentation}
                onChange={(e) => handleMarkChange('presentation', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.presentation ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.presentation && <p className="text-[10px] text-rose-500 mt-1">{errors.presentation}</p>}
            </div>

            {/* Mid-Term Exam (Max 25) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mid-Term Exam (Max 25)
                </label>
                <span className="text-[10px] text-slate-400">Midterm test</span>
              </div>
              <input
                type="number"
                min={0}
                max={25}
                step={0.5}
                value={marks.midTerm}
                onChange={(e) => handleMarkChange('midTerm', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.midTerm ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.midTerm && <p className="text-[10px] text-rose-500 mt-1">{errors.midTerm}</p>}
            </div>

            {/* Final Exam (Max 40) */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Final Exam (Max 40)
                </label>
                <span className="text-[10px] text-slate-400">Semester end exam</span>
              </div>
              <input
                type="number"
                min={0}
                max={40}
                step={0.5}
                value={marks.finalExam}
                onChange={(e) => handleMarkChange('finalExam', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none ${
                  errors.finalExam ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.finalExam && <p className="text-[10px] text-rose-500 mt-1">{errors.finalExam}</p>}
            </div>
          </div>
        </div>

        {/* CALCULATION RESULT CARD (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Final Assessment Result</span>
              <span className="text-xs font-normal text-slate-400">DIU 100-Mark Scale</span>
            </h2>

            {isValid && result ? (
              <div className="space-y-6">
                {/* Big Result Badge */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white text-center shadow-lg relative">
                  <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block mb-1">
                    {result.courseCode} • {result.courseName}
                  </span>
                  <div className="text-4xl font-extrabold tracking-tight my-1 text-white">
                    {formatNumber(result.totalMark)}{' '}
                    <span className="text-base font-normal text-indigo-300">/ 100</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 mt-4">
                    <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/15">
                      <p className="text-[10px] text-indigo-200">Letter Grade</p>
                      <p className="text-lg font-black text-amber-300">{result.letterGrade}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/15">
                      <p className="text-[10px] text-indigo-200">Grade Point</p>
                      <p className="text-lg font-black text-emerald-300">{formatNumber(result.gradePoint)}</p>
                    </div>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Component Breakdown
                  </h3>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-600 dark:text-slate-400">Attendance</span>
                      <span className="font-bold text-slate-900 dark:text-white">{result.attendanceMark} / 7</span>
                    </div>

                    <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40">
                      <div className="flex items-center justify-between font-bold text-indigo-950 dark:text-indigo-200">
                        <span>Quiz / Class Test Avg</span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {formatNumber(result.quizAverage)} / 15
                        </span>
                      </div>
                      <p className="text-[10px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
                        Q1: {result.quiz1Mark}, Q2: {result.quiz2Mark}, Q3: {result.quiz3Mark} (Avg = ({result.quiz1Mark}+{result.quiz2Mark}+{result.quiz3Mark})/3)
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-600 dark:text-slate-400">Assignment</span>
                      <span className="font-bold text-slate-900 dark:text-white">{result.assignmentMark} / 5</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-600 dark:text-slate-400">Presentation</span>
                      <span className="font-bold text-slate-900 dark:text-white">{result.presentationMark} / 8</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-600 dark:text-slate-400">Mid-Term Exam</span>
                      <span className="font-bold text-slate-900 dark:text-white">{result.midTermMark} / 25</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-600 dark:text-slate-400">Final Exam</span>
                      <span className="font-bold text-slate-900 dark:text-white">{result.finalExamMark} / 40</span>
                    </div>
                  </div>
                </div>

                {/* Save to GPA Calculator Button */}
                <button
                  onClick={handleSaveToGPA}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Save Course to GPA Calculator</span>
                </button>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-10 h-10 text-rose-400 mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Fix Validation Errors
                </p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Ensure all marks are non-negative and do not exceed their component maximum limits.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
