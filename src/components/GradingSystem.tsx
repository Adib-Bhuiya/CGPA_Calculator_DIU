import React, { useState } from 'react';
import { DIU_GRADING_SCALE } from '../utils/gradingScale';
import { getGradeFromMark, formatNumber } from '../utils/calculations';
import { Award, Search, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const GradingSystem: React.FC = () => {
  const [testMark, setTestMark] = useState<number | ''>(82);

  const matchedGrade = testMark !== '' ? getGradeFromMark(Number(testMark)) : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Official University Policy</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              DIU Grading System (4.00 Scale)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Official Daffodil International University numerical mark to letter grade and grade point conversion scale.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900">
            <ShieldCheck className="w-4 h-4" />
            <span>4.00 Max Scale</span>
          </div>
        </div>
      </div>

      {/* Quick Mark Lookup Widget */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Interactive Grade Finder</span>
          </div>
          <h2 className="text-lg font-bold">Type your course mark to test:</h2>
          <p className="text-xs text-indigo-200">
            Instant check for letter grade & grade point mapping.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <input
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 78"
              value={testMark}
              onChange={(e) => setTestMark(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-extrabold text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            <Search className="w-4 h-4 text-indigo-300 absolute right-3 top-3" />
          </div>

          {matchedGrade && (
            <div className="px-4 py-2 rounded-xl bg-white/15 border border-white/20 text-center shrink-0">
              <span className="text-[10px] text-indigo-200 block uppercase">Matched</span>
              <span className="text-lg font-black text-amber-300">{matchedGrade.letterGrade}</span>
              <span className="text-xs text-emerald-300 font-bold ml-2">({formatNumber(matchedGrade.gradePoint)})</span>
            </div>
          )}
        </div>
      </div>

      {/* GRADING SCALE TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Numerical Grade Conversion Table
          </h2>
          <span className="text-xs text-slate-400">10 Scale Rows</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Numerical Grade Marks</th>
                <th className="py-3.5 px-6">Letter Grade</th>
                <th className="py-3.5 px-6">Grade Point</th>
                <th className="py-3.5 px-6">Academic Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {DIU_GRADING_SCALE.map((row) => {
                const isSelected = matchedGrade && matchedGrade.letterGrade === row.letterGrade;
                return (
                  <tr
                    key={row.letterGrade}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 font-bold'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-4 px-6 text-slate-900 dark:text-white font-extrabold">
                      {row.minMark === 0 ? 'Below 40' : `${row.minMark} – ${row.maxMark}`}
                    </td>
                    <td className="py-4 px-6 font-black text-indigo-600 dark:text-indigo-400 text-base">
                      {row.letterGrade}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {formatNumber(row.gradePoint)}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                      {row.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
