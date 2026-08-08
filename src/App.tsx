import React, { useState, useEffect, useCallback } from 'react';
import { AcademicData, CourseCalculationResult, GpaCourseItem, SemesterRecord, ToastMessage } from './types';
import {
  clearAcademicData,
  loadAcademicData,
  resetToSampleData,
  saveAcademicData,
} from './utils/storage';
import { NavTab, Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { Dashboard } from './components/Dashboard';
import { CourseCalculator } from './components/CourseCalculator';
import { GpaCalculator } from './components/GpaCalculator';
import { CgpaCalculator } from './components/CgpaCalculator';
import { CgpaPredictor } from './components/CgpaPredictor';
import { GradingSystem } from './components/GradingSystem';
import { MarkDistribution } from './components/MarkDistribution';
import { calculateOverallCGPA } from './utils/calculations';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [academicData, setAcademicData] = useState<AcademicData>(loadAcademicData);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
  });

  // Automatically sync with operating system / browser light/dark theme preference
  useEffect(() => {
    const applySystemTheme = (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applySystemTheme(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => applySystemTheme(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  // Toast Helper
  const addToast = useCallback(
    (title: string, description?: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
      setToasts((prev) => [...prev, { id, title, description, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update Data Handler & LocalStorage sync
  const updateData = (updater: (prev: AcademicData) => AcademicData) => {
    setAcademicData((prev) => {
      const next = updater(prev);
      saveAcademicData(next);
      return next;
    });
  };

  // Add course from Course Calculator to GPA Calculator
  const handleSaveCourseFromCalc = (courseResult: CourseCalculationResult) => {
    const newCourseItem: GpaCourseItem = {
      id: Date.now().toString(),
      courseName: courseResult.courseName,
      courseCode: courseResult.courseCode,
      credits: courseResult.creditHours,
      letterGrade: courseResult.letterGrade,
      gradePoint: courseResult.gradePoint,
      customMark: courseResult.totalMark,
    };

    updateData((prev) => ({
      ...prev,
      savedCourseCalculations: [courseResult, ...(prev.savedCourseCalculations || [])],
    }));

    addToast(
      'Course Saved!',
      `${courseResult.courseCode} (${courseResult.letterGrade} / ${courseResult.gradePoint.toFixed(2)}) transferred to GPA Calculator`,
      'success'
    );

    setActiveTab('gpa-calc');
  };

  // Save semester from GPA Calculator to CGPA Calculator
  const handleSaveSemesterFromGpaCalc = (newSemester: SemesterRecord) => {
    updateData((prev) => {
      // Check if semester with same name exists and update or append
      const existingIdx = prev.semesters.findIndex(
        (s) => s.semesterName.toLowerCase() === newSemester.semesterName.toLowerCase()
      );

      let updatedSemesters = [...prev.semesters];
      if (existingIdx >= 0) {
        updatedSemesters[existingIdx] = newSemester;
      } else {
        updatedSemesters.push(newSemester);
      }

      return {
        ...prev,
        semesters: updatedSemesters,
      };
    });

    addToast(
      'Semester Recorded!',
      `${newSemester.semesterName} saved with GPA ${newSemester.gpa.toFixed(2)} (${newSemester.credits} Credits)`,
      'success'
    );

    setActiveTab('cgpa-calc');
  };

  // Add semester directly in CGPA calculator
  const handleAddSemester = (semester: SemesterRecord) => {
    updateData((prev) => ({
      ...prev,
      semesters: [...prev.semesters, semester],
    }));
  };

  // Update semester
  const handleUpdateSemester = (id: string, updated: Partial<SemesterRecord>) => {
    updateData((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    }));
  };

  // Delete semester with confirmation
  const handleDeleteSemester = (id: string) => {
    const sem = academicData.semesters.find((s) => s.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Semester Record?',
      description: `Are you sure you want to delete ${sem?.semesterName || 'this semester'}? This will recalculate your overall CGPA.`,
      action: () => {
        updateData((prev) => ({
          ...prev,
          semesters: prev.semesters.filter((s) => s.id !== id),
        }));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('Semester Deleted', `${sem?.semesterName || 'Semester'} removed`, 'info');
      },
    });
  };

  // Reset to sample data with confirmation
  const handleResetToSample = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Load DIU Sample Academic Data?',
      description: 'This will replace your current saved data with DIU student sample courses and semesters.',
      action: () => {
        const sample = resetToSampleData();
        setAcademicData(sample);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('Sample Data Loaded', 'Sample DIU academic records populated', 'success');
      },
    });
  };

  // Clear all data with confirmation
  const handleClearAllData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Academic Data?',
      description: 'Are you sure you want to clear all semesters, course calculations, and history? This action cannot be undone.',
      action: () => {
        const empty = clearAcademicData();
        setAcademicData(empty);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('Data Cleared', 'All academic records removed from LocalStorage', 'warning');
      },
    });
  };

  const { cgpa, totalCredits } = calculateOverallCGPA(academicData.semesters);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetToSample}
        onClearData={handleClearAllData}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            data={academicData}
            setActiveTab={setActiveTab}
            onResetSampleData={handleResetToSample}
          />
        )}

        {activeTab === 'course-calc' && (
          <CourseCalculator
            onSaveToGpaCalculator={handleSaveCourseFromCalc}
            addToast={addToast}
          />
        )}

        {activeTab === 'gpa-calc' && (
          <GpaCalculator
            onSaveSemester={handleSaveSemesterFromGpaCalc}
            addToast={addToast}
          />
        )}

        {activeTab === 'cgpa-calc' && (
          <CgpaCalculator
            semesters={academicData.semesters}
            onAddSemester={handleAddSemester}
            onUpdateSemester={handleUpdateSemester}
            onDeleteSemester={handleDeleteSemester}
            onResetSemesters={handleClearAllData}
            addToast={addToast}
          />
        )}

        {activeTab === 'cgpa-predictor' && (
          <CgpaPredictor
            initialCurrentCGPA={cgpa}
            initialCompletedCredits={totalCredits}
            addToast={addToast}
          />
        )}

        {activeTab === 'grading-system' && <GradingSystem />}

        {activeTab === 'mark-distribution' && <MarkDistribution />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
