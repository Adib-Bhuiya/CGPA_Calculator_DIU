import React from 'react';
import { GraduationCap, Heart, ShieldCheck, ExternalLink } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                CGPA Calculator DIU
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Designed specifically for Daffodil International University students to compute course assessment marks, semester GPAs, cumulative CGPA, and required future predictions according to the official DIU 4.00 grading scale.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Official 100-Mark DIU Assessment & 4.00 Grading Rules Applied</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Tools & Calculators
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('course-calc')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Course Mark Calculator (Quiz Average)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('gpa-calc')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Semester GPA Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('cgpa-calc')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Cumulative CGPA Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('cgpa-predictor')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Target CGPA Predictor
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Official Reference
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('grading-system')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Grading Scale (4.00 System)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('mark-distribution')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Mark Distribution (Attendance, Quizzes, Mid, Final)
                </button>
              </li>
              <li>
                <a
                  href="https://daffodilvarsity.edu.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>Daffodil International University</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} CGPA Calculator DIU. Client-side LocalStorage Saved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Built by <span className="text-indigo-600 dark:text-indigo-400 font-bold">Adib Bhuiyan</span>
            </p>
            <span className="hidden sm:inline">•</span>
            <p className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for DIU Students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
