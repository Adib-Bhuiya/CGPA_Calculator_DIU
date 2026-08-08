import React, { useState } from 'react';
import { SemesterRecord } from '../types';
import { calculateOverallCGPA, formatNumber } from '../utils/calculations';
import {
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';

interface CgpaCalculatorProps {
  semesters: SemesterRecord[];
  onAddSemester: (semester: SemesterRecord) => void;
  onUpdateSemester: (id: string, updated: Partial<SemesterRecord>) => void;
  onDeleteSemester: (id: string) => void;
  onResetSemesters: () => void;
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const CgpaCalculator: React.FC<CgpaCalculatorProps> = ({
  semesters,
  onAddSemester,
  onUpdateSemester,
  onDeleteSemester,
  onResetSemesters,
  addToast,
}) => {
  const { cgpa, totalCredits, totalQualityPoints, semesterCount } = calculateOverallCGPA(semesters);

  // New semester input state
  const [newSemName, setNewSemName] = useState('');
  const [newSemGPA, setNewSemGPA] = useState<number | ''>(3.75);
  const [newSemCredits, setNewSemCredits] = useState<number | ''>(15);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSemGPA === '' || newSemGPA < 0 || newSemGPA > 4) {
      addToast('Invalid GPA', 'GPA must be between 0.00 and 4.00', 'error');
      return;
    }
    if (newSemCredits === '' || newSemCredits <= 0) {
      addToast('Invalid Credits', 'Credits must be greater than 0', 'error');
      return;
    }

    const name = newSemName.trim() || `Semester ${semesters.length + 1}`;
    const newSem: SemesterRecord = {
      id: Date.now().toString(),
      semesterName: name,
      gpa: Number(newSemGPA),
      credits: Number(newSemCredits),
    };

    onAddSemester(newSem);
    setNewSemName('');
    setNewSemGPA(3.75);
    setNewSemCredits(15);
    addToast('Semester Added', `${name} recorded with GPA ${formatNumber(Number(newSemGPA))}`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Multi-Semester CGPA Calculator</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Cumulative CGPA Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Calculates your cumulative GPA using weighted total quality points formula: <code className="text-indigo-600 font-mono">CGPA = Sum(Semester GPA × Semester Credits) / Sum(Semester Credits)</code>.
            </p>
          </div>

          <button
            onClick={onResetSemesters}
            className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Semesters</span>
          </button>
        </div>
      </div>

      {/* METRIC SUMMARY (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg text-center">
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-1">
            Current CGPA
          </span>
          <div className="text-4xl font-black text-white my-1">
            {formatNumber(cgpa)}
          </div>
          <span className="text-xs text-indigo-200">Weighted Average (4.00 Max)</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Completed Credits
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalCredits} <span className="text-xs font-normal text-slate-400">Credit Hours</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total Semesters
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {semesterCount} <span className="text-xs font-normal text-slate-400">Recorded</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ADD SEMESTER FORM (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Add New Semester Record
          </h2>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester Name / Term
              </label>
              <input
                type="text"
                placeholder="e.g. Spring 2024 (Semester 4)"
                value={newSemName}
                onChange={(e) => setNewSemName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester GPA (0.00 - 4.00)
              </label>
              <input
                type="number"
                min={0}
                max={4}
                step={0.01}
                value={newSemGPA}
                onChange={(e) => setNewSemGPA(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Semester Credits
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={newSemCredits}
                onChange={(e) => setNewSemCredits(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Semester Record</span>
            </button>
          </form>
        </div>

        {/* SEMESTER LIST TABLE (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Semester Academic Records ({semesters.length})
            </h2>
            <span className="text-xs text-slate-400">Editable Inline</span>
          </div>

          {semesters.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Semester</th>
                    <th className="py-3.5 px-4">Credits</th>
                    <th className="py-3.5 px-4">GPA</th>
                    <th className="py-3.5 px-4">Quality Points</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {semesters.map((sem, idx) => {
                    const qp = sem.credits * sem.gpa;
                    return (
                      <tr key={sem.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <input
                            type="text"
                            value={sem.semesterName}
                            onChange={(e) => onUpdateSemester(sem.id, { semesterName: e.target.value })}
                            className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 outline-none w-full font-bold"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            min={1}
                            value={sem.credits}
                            onChange={(e) => onUpdateSemester(sem.id, { credits: Number(e.target.value) || 1 })}
                            className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 outline-none w-16 font-semibold"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <input
                            type="number"
                            min={0}
                            max={4}
                            step={0.01}
                            value={sem.gpa}
                            onChange={(e) => onUpdateSemester(sem.id, { gpa: Number(e.target.value) || 0 })}
                            className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 outline-none w-20 font-bold text-indigo-600 dark:text-indigo-400"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                          {formatNumber(qp)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onDeleteSemester(sem.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                            title="Delete Semester"
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
            <div className="py-12 text-center text-slate-400 text-xs">
              No semesters added yet. Add semesters using the form on the left.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
