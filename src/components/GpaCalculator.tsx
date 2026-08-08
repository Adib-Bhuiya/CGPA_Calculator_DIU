import React, { useState } from 'react';
import { GpaCourseItem, LetterGrade, SemesterRecord } from '../types';
import {
  calculateSemesterGPA,
  formatNumber,
  getGradeFromMark,
  getGradePointFromLetter,
} from '../utils/calculations';
import { DIU_GRADING_SCALE } from '../utils/gradingScale';
import {
  BookOpen,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  Layers,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface GpaCalculatorProps {
  onSaveSemester: (semester: SemesterRecord) => void;
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  savedCourseQueue?: GpaCourseItem[];
}

export const GpaCalculator: React.FC<GpaCalculatorProps> = ({
  onSaveSemester,
  addToast,
}) => {
  const [semesterName, setSemesterName] = useState('');
  const [courses, setCourses] = useState<GpaCourseItem[]>([]);

  // Calculations
  const { gpa, totalCredits, totalQualityPoints } = calculateSemesterGPA(courses);

  // New course temp input state
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCredits, setNewCredits] = useState<number>(3);
  const [newResultType, setNewResultType] = useState<'grade' | 'marks'>('grade');
  const [newGrade, setNewGrade] = useState<LetterGrade>('A+');
  const [newMark, setNewMark] = useState<string>('');
  const [markError, setMarkError] = useState<string>('');

  // Handle Mark input change for new course form
  const handleMarkInputChange = (val: string) => {
    setNewMark(val);
    if (val.trim() === '') {
      setMarkError('');
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num)) {
      setMarkError('Please enter a valid numerical mark.');
    } else if (num < 0 || num > 100) {
      setMarkError('Exam marks must be between 0 and 100.');
    } else {
      setMarkError('');
    }
  };

  // Derived current grade info for new course form when in 'marks' mode
  const currentMarkNum = parseFloat(newMark);
  const derivedGradeFromMark = !isNaN(currentMarkNum) && currentMarkNum >= 0 && currentMarkNum <= 100
    ? getGradeFromMark(currentMarkNum)
    : null;

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();

    if (newResultType === 'marks') {
      const num = parseFloat(newMark);
      if (newMark.trim() === '' || isNaN(num)) {
        addToast('Invalid Mark', 'Please enter a valid mark for the course', 'error');
        return;
      }
      if (num < 0 || num > 100) {
        addToast('Validation Error', 'Exam marks must be between 0 and 100', 'error');
        return;
      }
    }

    const name = newCourseName.trim() || `Course ${courses.length + 1}`;
    const code = newCourseCode.trim().toUpperCase() || `CSE${100 + (courses.length + 1) * 10}`;
    const cred = Math.max(1, newCredits || 3);

    let letter: LetterGrade = 'A+';
    let gp = 4.00;
    let customM: number | undefined = undefined;

    if (newResultType === 'grade') {
      letter = newGrade;
      gp = getGradePointFromLetter(newGrade);
    } else {
      const num = parseFloat(newMark);
      const gradeInfo = getGradeFromMark(num);
      letter = gradeInfo.letterGrade;
      gp = gradeInfo.gradePoint;
      customM = num;
    }

    const item: GpaCourseItem = {
      id: Date.now().toString(),
      courseName: name,
      courseCode: code,
      credits: cred,
      letterGrade: letter,
      gradePoint: gp,
      inputType: newResultType,
      customMark: customM,
    };

    setCourses((prev) => [...prev, item]);
    setNewCourseName('');
    setNewCourseCode('');
    setNewMark('');
    setMarkError('');
    addToast('Course Added', `${code} (${name}) added to list`, 'success');
  };

  const handleRemoveCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    addToast('Course Removed', 'Course removed from calculation', 'info');
  };

  const handleUpdateCourse = (id: string, field: keyof GpaCourseItem, value: any) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        if (field === 'inputType') {
          const newType = value as 'grade' | 'marks';
          if (newType === 'grade') {
            const letter = c.letterGrade || 'A+';
            return {
              ...c,
              inputType: 'grade',
              letterGrade: letter,
              gradePoint: getGradePointFromLetter(letter),
            };
          } else {
            const mark = typeof c.customMark === 'number' ? c.customMark : 80;
            const gradeInfo = getGradeFromMark(mark);
            return {
              ...c,
              inputType: 'marks',
              customMark: mark,
              letterGrade: gradeInfo.letterGrade,
              gradePoint: gradeInfo.gradePoint,
            };
          }
        }

        if (field === 'letterGrade') {
          const letter = value as LetterGrade;
          return {
            ...c,
            letterGrade: letter,
            gradePoint: getGradePointFromLetter(letter),
          };
        }

        if (field === 'customMark') {
          const rawVal = value;
          const num = parseFloat(rawVal);
          if (rawVal === '' || isNaN(num)) {
            return {
              ...c,
              customMark: '',
              gradePoint: 0,
            };
          }
          if (num < 0 || num > 100) {
            return {
              ...c,
              customMark: num,
              // keep previous grade point or invalid
            };
          }
          const gradeInfo = getGradeFromMark(num);
          return {
            ...c,
            customMark: num,
            letterGrade: gradeInfo.letterGrade,
            gradePoint: gradeInfo.gradePoint,
          };
        }

        return { ...c, [field]: value };
      })
    );
  };

  const handleReset = () => {
    setCourses([]);
    setSemesterName('');
    addToast('Reset', 'GPA calculator cleared', 'info');
  };

  const handleSaveSemesterToCGPA = () => {
    if (courses.length === 0) {
      addToast('No Courses', 'Please add at least one course before saving semester', 'warning');
      return;
    }

    // Check for any invalid marks in courses
    const hasInvalidMarks = courses.some(
      (c) =>
        c.inputType === 'marks' &&
        (c.customMark === '' ||
          typeof c.customMark !== 'number' ||
          c.customMark < 0 ||
          c.customMark > 100)
    );

    if (hasInvalidMarks) {
      addToast('Validation Error', 'Please fix course mark values between 0 and 100', 'error');
      return;
    }

    if (totalCredits <= 0) {
      addToast('Invalid Credits', 'Total credits must be greater than 0', 'error');
      return;
    }

    const semRecord: SemesterRecord = {
      id: Date.now().toString(),
      semesterName: semesterName.trim() || 'Semester',
      gpa,
      credits: totalCredits,
      courses: [...courses],
    };

    onSaveSemester(semRecord);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Semester GPA Calculator</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Semester GPA Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Add courses, choose credit hours, and enter your result using either <strong>Letter Grade</strong> or <strong>Exam Marks</strong> (0–100).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Reset List</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT FORM & TABLE (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Semester Name input */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <Layers className="w-5 h-5 text-indigo-600 shrink-0" />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                Semester Title / Name
              </label>
              <input
                type="text"
                value={semesterName}
                onChange={(e) => setSemesterName(e.target.value)}
                placeholder="e.g. Spring 2024 (Semester 4)"
                className="w-full text-sm font-bold text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 focus:border-indigo-500 outline-none py-1"
              />
            </div>
          </div>

          {/* Quick Add Form */}
          <form
            onSubmit={handleAddCourse}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Add New Course
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Result Type:</span>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setNewResultType('grade');
                      setMarkError('');
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                      newResultType === 'grade'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Grade
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewResultType('marks')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                      newResultType === 'marks'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Marks
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
              {/* Code */}
              <div className="sm:col-span-3">
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSE211"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Name */}
              <div className="sm:col-span-3">
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  placeholder="Data Structures"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Credits */}
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Credits
                </label>
                <select
                  value={newCredits}
                  onChange={(e) => setNewCredits(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((cr) => (
                    <option key={cr} value={cr} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                      {cr} {cr > 1 ? 'Credits' : 'Credit'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Result Input: Option A (Grade) vs Option B (Marks) */}
              <div className="sm:col-span-3">
                {newResultType === 'grade' ? (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Letter Grade
                    </label>
                    <select
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value as LetterGrade)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {DIU_GRADING_SCALE.map((g) => (
                        <option key={g.letterGrade} value={g.letterGrade} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                          {g.letterGrade} ({formatNumber(g.gradePoint)})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Exam Mark (0–100)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      placeholder="e.g. 82"
                      value={newMark}
                      onChange={(e) => handleMarkInputChange(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none ${
                        markError ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-1 pt-5">
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center font-bold shadow-sm transition-colors"
                  title="Add Course"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* In Marks mode: show validation error or converted grade preview */}
            {newResultType === 'marks' && (
              <div className="pt-1">
                {markError ? (
                  <p className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{markError}</span>
                  </p>
                ) : derivedGradeFromMark ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      Mark {currentMarkNum} → Grade: <strong className="text-amber-600 dark:text-amber-400">{derivedGradeFromMark.letterGrade}</strong> → Grade Point: <strong className="text-indigo-600 dark:text-indigo-400">{formatNumber(derivedGradeFromMark.gradePoint)}</strong>
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </form>

          {/* Courses Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Courses in {semesterName || 'Semester'} ({courses.length})
              </h3>
              <span className="text-xs text-slate-400">Editable Inline</span>
            </div>

            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Course Name</th>
                      <th className="py-3 px-4">Credits</th>
                      <th className="py-3 px-4">Result Type</th>
                      <th className="py-3 px-4">Grade / Marks</th>
                      <th className="py-3 px-4">Grade Point</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {courses.map((course) => {
                      const isMarkInput = course.inputType === 'marks';
                      const isInvalidMark =
                        isMarkInput &&
                        (course.customMark === '' ||
                          typeof course.customMark !== 'number' ||
                          course.customMark < 0 ||
                          course.customMark > 100);

                      return (
                        <tr key={course.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white uppercase">
                            <input
                              type="text"
                              value={course.courseCode}
                              onChange={(e) => handleUpdateCourse(course.id, 'courseCode', e.target.value)}
                              className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 outline-none w-20 font-bold"
                            />
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                            <input
                              type="text"
                              value={course.courseName}
                              onChange={(e) => handleUpdateCourse(course.id, 'courseName', e.target.value)}
                              className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 outline-none w-full"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={course.credits}
                              onChange={(e) => handleUpdateCourse(course.id, 'credits', Number(e.target.value))}
                              className="bg-transparent font-semibold border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-900 dark:text-white"
                            >
                              {[1, 2, 3, 4, 5, 6].map((c) => (
                                <option key={c} value={c} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                  {c} cr
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={course.inputType || 'grade'}
                              onChange={(e) => handleUpdateCourse(course.id, 'inputType', e.target.value)}
                              className="bg-transparent font-bold border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 text-xs"
                            >
                              <option value="grade" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Grade</option>
                              <option value="marks" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Marks</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            {isMarkInput ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  step={0.5}
                                  value={course.customMark ?? ''}
                                  onChange={(e) => handleUpdateCourse(course.id, 'customMark', e.target.value)}
                                  className={`w-16 px-2 py-1 rounded-lg border bg-transparent font-bold text-slate-900 dark:text-white text-xs ${
                                    isInvalidMark ? 'border-rose-500 text-rose-500' : 'border-slate-200 dark:border-slate-700'
                                  }`}
                                />
                                {!isInvalidMark && (
                                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-[11px] border border-indigo-200 dark:border-indigo-800">
                                    {course.letterGrade}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <select
                                value={course.letterGrade}
                                onChange={(e) => handleUpdateCourse(course.id, 'letterGrade', e.target.value)}
                                className="bg-transparent font-extrabold text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1"
                              >
                                {DIU_GRADING_SCALE.map((g) => (
                                  <option key={g.letterGrade} value={g.letterGrade} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                    {g.letterGrade}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            {isInvalidMark ? (
                              <span className="text-rose-500 text-[10px] font-semibold">Invalid Mark</span>
                            ) : (
                              formatNumber(course.gradePoint)
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRemoveCourse(course.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                No courses added to this semester yet. Use the form above to add courses.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SUMMARY CARD (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              GPA Summary
            </h3>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white text-center shadow-lg">
                <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block mb-1">
                  {semesterName || 'Semester'} GPA
                </span>
                <div className="text-4xl font-extrabold tracking-tight text-white my-1">
                  {formatNumber(gpa)}
                </div>
                <span className="text-xs text-indigo-200 font-medium">Out of 4.00 Scale</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Total Semester Courses</span>
                  <span className="font-bold text-slate-900 dark:text-white">{courses.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Total Credits</span>
                  <span className="font-bold text-slate-900 dark:text-white">{totalCredits} Credit Hours</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Total Quality Points</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatNumber(totalQualityPoints)}</span>
                </div>
              </div>

              <button
                onClick={handleSaveSemesterToCGPA}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Semester to CGPA History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
