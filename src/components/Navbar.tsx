import React, { useState } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Calculator,
  BookOpen,
  TrendingUp,
  Award,
  PieChart,
  Menu,
  X,
  RotateCcw,
  Trash2,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'course-calc'
  | 'gpa-calc'
  | 'cgpa-calc'
  | 'cgpa-predictor'
  | 'grading-system'
  | 'mark-distribution';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onResetData: () => void;
  onClearData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetData,
  onClearData,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'course-calc', label: 'Course Calculator', icon: <Calculator className="w-4 h-4" /> },
    { id: 'gpa-calc', label: 'GPA Calculator', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'cgpa-calc', label: 'CGPA Calculator', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'cgpa-predictor', label: 'CGPA Predictor', icon: <Award className="w-4 h-4" /> },
    { id: 'grading-system', label: 'Grading System', icon: <Award className="w-4 h-4" /> },
    { id: 'mark-distribution', label: 'Mark Distribution', icon: <PieChart className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Mobile / Tablet Header (Single Row) */}
        <div className="lg:hidden flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                  CGPA Calculator
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                  DIU
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5 truncate leading-tight">
                Daffodil International University Standard
              </p>
            </div>
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={onResetData}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                title="Load DIU Sample Data"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                <span>Sample Data</span>
              </button>
              <button
                onClick={onClearData}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-medium transition-colors"
                title="Clear All Saved Academic Data"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Data</span>
              </button>
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Header Row 1: Brand + Quick Actions */}
        <div className="hidden lg:flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                  CGPA Calculator
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  DIU
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Daffodil International University Standard
              </p>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetData}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors shadow-sm"
              title="Load DIU Sample Data"
            >
              <RotateCcw className="w-4 h-4 text-indigo-500" />
              <span>Sample Data</span>
            </button>
            <button
              onClick={onClearData}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold transition-colors shadow-sm"
              title="Clear All Saved Academic Data"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Data</span>
            </button>
          </div>
        </div>

        {/* Desktop Header Row 2: Navigation Links */}
        <nav className="hidden lg:flex items-center justify-start gap-1 py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 shadow-xl animate-fade-in">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onResetData();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Load Sample</span>
            </button>
            <button
              onClick={() => {
                onClearData();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-xs font-medium text-rose-600 dark:text-rose-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Data</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
