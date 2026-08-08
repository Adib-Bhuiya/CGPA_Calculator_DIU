import React, { useState, useMemo } from 'react';
import { calculateRequiredGPA, formatNumber, predictFutureCGPA } from '../utils/calculations';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Calculator,
  Compass,
} from 'lucide-react';

interface CgpaPredictorProps {
  initialCurrentCGPA?: number;
  initialCompletedCredits?: number;
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const CgpaPredictor: React.FC<CgpaPredictorProps> = ({
  initialCurrentCGPA = 3.60,
  initialCompletedCredits = 62,
  addToast,
}) => {
  // Mode 1: Target Predictor State
  const [currentCGPA, setCurrentCGPA] = useState<number | ''>(initialCurrentCGPA);
  const [completedCredits, setCompletedCredits] = useState<number | ''>(initialCompletedCredits);
  const [remainingCredits, setRemainingCredits] = useState<number | ''>(30);
  const [targetCGPA, setTargetCGPA] = useState<number | ''>(3.75);

  // Mode 2: Future GPA Simulator State
  const [futureGPA, setFutureGPA] = useState<number | ''>(3.80);
  const [futureCredits, setFutureCredits] = useState<number | ''>(15);

  // Compute Target Prediction Result
  const predictionResult = useMemo(() => {
    return calculateRequiredGPA(
      Number(currentCGPA) || 0,
      Number(completedCredits) || 0,
      Number(remainingCredits) || 0,
      Number(targetCGPA) || 0
    );
  }, [currentCGPA, completedCredits, remainingCredits, targetCGPA]);

  // Compute Future Simulation Result
  const simulationResult = useMemo(() => {
    return predictFutureCGPA(
      Number(currentCGPA) || 0,
      Number(completedCredits) || 0,
      Number(futureGPA) || 0,
      Number(futureCredits) || 0
    );
  }, [currentCGPA, completedCredits, futureGPA, futureCredits]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Academic Planning & Target Predictor</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              CGPA Target & Prediction Tool
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Determine the average GPA required in remaining credits to hit your goal CGPA, or simulate future semester performance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* TARGET PREDICTOR INPUTS & RESULT (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Target CGPA Calculator</span>
            </h2>
            <span className="text-xs text-indigo-600 font-semibold">Formula Based</span>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current CGPA (0.00 - 4.00)
              </label>
              <input
                type="number"
                min={0}
                max={4}
                step={0.01}
                value={currentCGPA}
                onChange={(e) => setCurrentCGPA(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Completed Credits
              </label>
              <input
                type="number"
                min={0}
                value={completedCredits}
                onChange={(e) => setCompletedCredits(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Remaining Credits
              </label>
              <input
                type="number"
                min={1}
                value={remainingCredits}
                onChange={(e) => setRemainingCredits(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target CGPA (Goal)
              </label>
              <input
                type="number"
                min={0}
                max={4}
                step={0.01}
                value={targetCGPA}
                onChange={(e) => setTargetCGPA(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100 text-xs font-extrabold focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Formula Explanation Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-mono space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200 font-sans">Prediction Formula:</p>
            <p>Required GPA = (Target CGPA × Total Credits - Current CGPA × Completed Credits) / Remaining Credits</p>
            <p>Total Credits = {Number(completedCredits) || 0} + {Number(remainingCredits) || 0} = {predictionResult.totalCredits} Credit Hours</p>
          </div>

          {/* RESULT FEEDBACK CARD */}
          <div className="pt-2">
            {!predictionResult.isPossible ? (
              <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  <h3 className="font-bold text-sm">Target Not Achievable</h3>
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {predictionResult.message}
                </p>
                <div className="text-[11px] bg-rose-100/80 dark:bg-rose-900/50 p-2.5 rounded-xl font-mono text-rose-950 dark:text-rose-200">
                  Required GPA calculated: <strong>{formatNumber(predictionResult.requiredGPA)}</strong> (Exceeds maximum possible 4.00)
                </div>
              </div>
            ) : predictionResult.isAlreadyAchieved ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 className="font-bold text-sm">Target Already Met!</h3>
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {predictionResult.message}
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-3 shadow-lg">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                  Required Performance
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-300">
                    {formatNumber(predictionResult.requiredGPA)}
                  </span>
                  <span className="text-xs text-indigo-200">GPA Average Required</span>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  {predictionResult.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FUTURE GPA SIMULATOR (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Future GPA Simulator</span>
            </h2>
            <span className="text-xs text-emerald-600 font-semibold">What-If</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Predict what your new CGPA will become if you achieve a specific GPA in upcoming credit hours.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Future GPA (0.00 - 4.00)
              </label>
              <input
                type="number"
                min={0}
                max={4}
                step={0.01}
                value={futureGPA}
                onChange={(e) => setFutureGPA(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Future Semester Credits
              </label>
              <input
                type="number"
                min={1}
                value={futureCredits}
                onChange={(e) => setFutureCredits(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* SIMULATION RESULT DISPLAY */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Projected New CGPA
              </span>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {formatNumber(simulationResult.projectedCGPA)}
                </span>
                <span className={`text-xs font-bold ${simulationResult.gainLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  ({simulationResult.gainLoss >= 0 ? '+' : ''}{formatNumber(simulationResult.gainLoss)})
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                After completing <strong>{simulationResult.totalCredits}</strong> total credit hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
