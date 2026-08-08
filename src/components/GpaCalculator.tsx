import React, { useState } from 'react';
import { GpaCourseItem, LetterGrade, SemesterRecord } from '../types';
import { calculateSemesterGPA, formatNumber, getGradePointFromLetter } from '../utils/calculations';
import { DIU_GRADING_SCALE } from '../utils/gradingScale';
import {
  BookOpen,
  Plus,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle2,
  Edit2,
  HelpCircle,
  Layers,
} from 'lucide-react';

interface GpaCalculatorProps {
  onSaveSemester: (semester: SemesterRecord) => void;
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  savedCourseQueue?: GpaCourseItem[];
}

export const GpaCalculator: React.FC<GpaCalculatorProps> = ({
  onSaveSemester,
  addToast,
  savedCourseQueue = [],
}) => {
  const [semesterName, setSemesterName] = useState('Fall 2024');
  const [courses, setCourses] = useState<GpaCourseItem[]>([
    { id: '1', courseName: 'Data Structures', courseCode: 'CSE211', credits: 3, letterGrade: 'A+', gradePoint: 4.00 },
    { id: '2', courseName: 'Database Management', courseCode: 'CSE231', credits: 3, letterGrade: 'A', gradePoint: 3.75 },
    { id: '3', courseName: 'Mathematics III', courseCode: 'MAT201', credits: 3, letterGrade: 'B+', gradePoint: 3.25 },
    { id: '4', courseName: 'Software Engineering', courseCode: 'CSE321', credits: 3, letterGrade: 'A-', gradePoint: 3.50 },
  ]);

  // Calculations
  const { gpa, totalCredits, totalQualityPoints } = calculateSemesterGPA(courses);

  // New course temp input state
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCredits, setNewCredits] = useState<number>(3);
  const [newGrade, setNewGrade] = useState<LetterGrade>('A+');

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCourseName.trim() || `Course ${courses.length + 1}`;
    const code = newCourseCode.trim().toUpperCase() || `CSE${100 + courses.length * 10}`;
    const cred = Math.max(1, newCredits || 3);
    const gp = getGradePointFromLetter(newGrade);

    const item: GpaCourseItem = {
      id: Date.now().toString(),
      courseName: name,
      courseCode: code,
      credits: cred,
      letterGrade: newGrade,
      gradePoint: gp,
    };

    setCourses((prev) => [...prev, item]);
    setNewCourseName('');
    setNewCourseCode('');
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
        if (field === 'letterGrade') {
          const letter = value as LetterGrade;
          return {
            ...c,
            letterGrade: letter,
            gradePoint: getGradePointFromLetter(letter),
          };
        }
        return { ...c, [field]: value };
      })
    );
  };

  const handleReset = () => {
    setCourses([]);
    addToast('Reset', 'Course list cleared', 'info');
  };

  const handleSaveSemesterToCGPA = () => {
    if (courses.length === 0) {
      addToast('No Courses', 'Please add at least one course before saving semester', 'warning');
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
              Add courses for a single semester, select credit hours and letter grades. Formula: <code className="text-indigo-600 font-mono">GPA = Sum(Credit × Grade Point) / Sum(Credits)</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
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
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Add New Course
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Code (e.g. CSE211)"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <select
                  value={newCredits}
                  onChange={(e) => setNewCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((cr) => (
                    <option key={cr} value={cr}>
                      {cr} Credit{cr > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value as LetterGrade)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-600 dark:text-indigo-400"
                >
                  {DIU_GRADING_SCALE.map((g) => (
                    <option key={g.letterGrade} value={g.letterGrade}>
                      {g.letterGrade} ({formatNumber(g.gradePoint)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <button
                  type="submit"
                  className="w-full h-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center font-bold shadow-sm transition-colors"
                  title="Add Course"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Courses Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Courses in {semesterName || 'Semester'} ({courses.length})
              </h3>
              <span className="text-xs text-slate-500">Click values to edit</span>
            </div>

            {courses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Course Name</th>
                      <th className="py-3 px-4">Credits</th>
                      <th className="py-3 px-4">Grade</th>
                      <th className="py-3 px-4">Grade Point</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {courses.map((course) => (
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
                              <option key={c} value={c}>
                                {c} cr
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={course.letterGrade}
                            onChange={(e) => handleUpdateCourse(course.id, 'letterGrade', e.target.value)}
                            className="bg-transparent font-extrabold text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1"
                          >
                            {DIU_GRADING_SCALE.map((g) => (
                              <option key={g.letterGrade} value={g.letterGrade}>
                                {g.letterGrade}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {formatNumber(course.gradePoint)}
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
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
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
