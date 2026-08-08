import React from 'react';
import { AcademicData } from '../types';
import { calculateOverallCGPA, formatNumber } from '../utils/calculations';
import { NavTab } from './Navbar';
import {
  TrendingUp,
  Award,
  BookOpen,
  Calculator,
  PlusCircle,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface DashboardProps {
  data: AcademicData;
  setActiveTab: (tab: NavTab) => void;
  onResetSampleData: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  setActiveTab,
  onResetSampleData,
}) => {
  const { cgpa, totalCredits, semesterCount } = calculateOverallCGPA(data.semesters);
  const latestSemester = data.semesters.length > 0 ? data.semesters[data.semesters.length - 1] : null;

  // Prepare chart data
  const chartData = data.semesters.map((sem, index) => ({
    name: sem.semesterName.split('(')[0].trim() || `Sem ${index + 1}`,
    gpa: Number(sem.gpa),
    credits: sem.credits,
    cgpaUpToNow: calculateOverallCGPA(data.semesters.slice(0, index + 1)).cgpa,
  }));

  // Academic standing badge
  const getAcademicStanding = (val: number) => {
    if (val >= 3.8) return { label: 'First Class with Honors / High Distinction', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' };
    if (val >= 3.5) return { label: 'First Class / Very Good Standing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800' };
    if (val >= 3.0) return { label: 'Good Standing', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800' };
    if (val >= 2.5) return { label: 'Satisfactory', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800' };
    if (val > 0) return { label: 'Academic Warning Threshold', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800' };
    return { label: 'No Academic Records Yet', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700' };
  };

  const standing = getAcademicStanding(cgpa);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-12 -mt-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Daffodil International University Academic Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome to Your Academic Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
              Track course assessment marks, evaluate semester GPAs, calculate cumulative CGPA, and predict required future targets with DIU official 4.00 grading system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('course-calc')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow-md transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>Course Mark Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('cgpa-predictor')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/80 border border-indigo-400/40 text-white font-semibold text-xs sm:text-sm hover:bg-indigo-600 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Predict Target CGPA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Current CGPA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Current CGPA
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatNumber(cgpa)}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 4.00</span>
          </div>
          <div className="mt-2">
            <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${standing.color}`}>
              {standing.label}
            </span>
          </div>
        </div>

        {/* Metric 2: Total Completed Credits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Completed Credits
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalCredits}
            </span>
            <span className="text-xs text-slate-500 font-medium">Credit Hours</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Across {semesterCount} completed semester{semesterCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Metric 3: Total Semesters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Semesters
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {semesterCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Semesters</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recorded in academic profile
          </p>
        </div>

        {/* Metric 4: Latest Semester GPA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Latest Semester GPA
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {latestSemester ? formatNumber(latestSemester.gpa) : 'N/A'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {latestSemester ? `(${latestSemester.credits} credits)` : ''}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {latestSemester ? latestSemester.semesterName : 'No semester added yet'}
          </p>
        </div>
      </div>

      {/* QUICK ACCESS CARDS (4 Main Tools) */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          <span>Quick Access Calculators</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div
            onClick={() => setActiveTab('course-calc')}
            className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Calculate Course Grade
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Enter Attendance, 3 Quiz marks (averaged out of 15), Assignment, Presentation, Mid-term & Final exam to find letter grade.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Open Course Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setActiveTab('gpa-calc')}
            className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Calculate GPA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Add multiple courses for a semester, choose credits & grades, calculate quality points and overall semester GPA.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Open GPA Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setActiveTab('cgpa-calc')}
            className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Calculate CGPA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Manage multi-semester GPAs with weighted credits formula, view semester breakdown tables, edit or remove semesters.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Open CGPA Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => setActiveTab('cgpa-predictor')}
            className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Predict CGPA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Calculate the required GPA in remaining credits to achieve your target CGPA, or simulate future semester performance.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Open Target Predictor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* SEMESTER PERFORMANCE CHART & RECENT SEMESTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (2 Cols on Large) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Semester Performance Trend</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                GPA trajectory across completed academic terms
              </p>
            </div>

            {data.semesters.length === 0 && (
              <button
                onClick={onResetSampleData}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Load Sample Data
              </button>
            )}
          </div>

          {chartData.length > 0 ? (
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 4.0]}
                    ticks={[0, 1.0, 2.0, 3.0, 3.5, 4.0]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl border border-slate-700">
                            <p className="font-bold border-b border-slate-700 pb-1 mb-1.5">{item.name}</p>
                            <p className="flex items-center justify-between gap-4 text-slate-300">
                              <span>Semester GPA:</span>
                              <span className="font-bold text-amber-400">{formatNumber(item.gpa)}</span>
                            </p>
                            <p className="flex items-center justify-between gap-4 text-slate-300 mt-0.5">
                              <span>Cumulative CGPA:</span>
                              <span className="font-bold text-emerald-400">{formatNumber(item.cgpaUpToNow)}</span>
                            </p>
                            <p className="flex items-center justify-between gap-4 text-slate-400 text-[10px] mt-1 pt-1 border-t border-slate-800">
                              <span>Credits:</span>
                              <span>{item.credits} hrs</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={3.8} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Distinction (3.80)', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} />
                  <Area
                    type="monotone"
                    dataKey="gpa"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#gpaGrad)"
                    dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7, fill: '#3730a3' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <BarChart3 className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No Semester Chart Available
              </p>
              <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">
                Add semesters in CGPA Calculator or load sample data to visualize your academic GPA trajectory.
              </p>
              <button
                onClick={onResetSampleData}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Load DIU Sample Data
              </button>
            </div>
          )}
        </div>

        {/* Recent Semesters Summary Column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Semester Records</span>
              </h3>
              <button
                onClick={() => setActiveTab('cgpa-calc')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View All ({data.semesters.length})
              </button>
            </div>

            {data.semesters.length > 0 ? (
              <div className="space-y-2.5">
                {data.semesters.slice(-4).map((sem, idx) => (
                  <div
                    key={sem.id || idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {sem.semesterName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {sem.credits} Credit Hours
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                        {formatNumber(sem.gpa)}
                      </span>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {sem.gpa >= 3.75 ? 'A / A+' : sem.gpa >= 3.5 ? 'A-' : sem.gpa >= 3.0 ? 'B Level' : 'Passing'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">
                No semester records saved yet.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('cgpa-calc')}
              className="w-full py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add / Manage Semesters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
