import React, { useState } from 'react';
import { calculateQuizAverage, formatNumber } from '../utils/calculations';
import { PieChart, HelpCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export const MarkDistribution: React.FC = () => {
  const [q1, setQ1] = useState<number | ''>(12);
  const [q2, setQ2] = useState<number | ''>(10);
  const [q3, setQ3] = useState<number | ''>(14);

  const sampleAvg = calculateQuizAverage(Number(q1), Number(q2), Number(q3));

  const items = [
    { label: 'Attendance', marks: 7, percentage: '7%', color: 'bg-blue-500' },
    { label: 'Quiz / Class Test (Average of 3)', marks: 15, percentage: '15%', color: 'bg-indigo-600', highlighted: true },
    { label: 'Assignment', marks: 5, percentage: '5%', color: 'bg-teal-500' },
    { label: 'Presentation', marks: 8, percentage: '8%', color: 'bg-amber-500' },
    { label: 'Mid-Term Exam', marks: 25, percentage: '25%', color: 'bg-purple-600' },
    { label: 'Final Exam', marks: 40, percentage: '40%', color: 'bg-rose-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
              <PieChart className="w-3.5 h-3.5" />
              <span>Assessment Architecture</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Course Mark Distribution Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Breakdown of total 100 course marks across attendance, quizzes, assignments, presentation, midterm, and final examination.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SUMMARY TABLE & VISUAL BAR (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            100-Mark Component Breakdown
          </h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.label}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.highlighted
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {item.marks} Marks
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.percentage }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <span className="font-bold text-sm">Total Assessment Score</span>
            <span className="text-xl font-black text-emerald-400">100 Marks</span>
          </div>
        </div>

        {/* QUIZ RULE EXPLANATION & DEMO (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Quiz Rule Explanation
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100 space-y-3">
            <p className="text-xs leading-relaxed font-medium">
              There are 3 quizzes. Each quiz is entered out of 15 marks, and the average of the three quizzes is used as the final 15-mark Quiz/Class Test component.
            </p>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-center font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300 shadow-sm">
              Quiz Average = (Quiz 1 + Quiz 2 + Quiz 3) / 3
            </div>
          </div>

          {/* Interactive Quiz Average Calculator */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Interactive Quiz Average Test
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Quiz 1 (/15)</label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={q1}
                  onChange={(e) => setQ1(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Quiz 2 (/15)</label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={q2}
                  onChange={(e) => setQ2(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">Quiz 3 (/15)</label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={q3}
                  onChange={(e) => setQ3(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white text-center">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                Calculated Quiz Contribution
              </span>
              <div className="text-2xl font-black text-amber-300 my-0.5">
                {formatNumber(sampleAvg)} <span className="text-xs text-indigo-200 font-normal">/ 15</span>
              </div>
              <p className="text-[10px] text-indigo-200 font-mono">
                ({q1 || 0} + {q2 || 0} + {q3 || 0}) / 3 = {formatNumber(sampleAvg)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
