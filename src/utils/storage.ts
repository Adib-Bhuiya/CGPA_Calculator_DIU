import { AcademicData } from '../types';
import { INITIAL_SAMPLE_DATA } from './sampleData';

const STORAGE_KEY = 'cgpa_calculator_diu_data_v1';

/**
 * Load academic data from LocalStorage or return empty structure on first visit
 */
export function loadAcademicData(): AcademicData {
  const emptyData: AcademicData = {
    semesters: [],
    savedCourseCalculations: [],
    profileName: '',
    studentId: '',
    department: '',
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveAcademicData(emptyData);
      return emptyData;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.semesters)) {
      return emptyData;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading academic data from localStorage:', error);
    return emptyData;
  }
}

/**
 * Save academic data to LocalStorage
 */
export function saveAcademicData(data: AcademicData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving academic data to localStorage:', error);
  }
}

/**
 * Clear all academic data in LocalStorage
 */
export function clearAcademicData(): AcademicData {
  const emptyData: AcademicData = {
    semesters: [],
    savedCourseCalculations: [],
    profileName: '',
    studentId: '',
    department: '',
  };
  saveAcademicData(emptyData);
  return emptyData;
}

/**
 * Reset to initial sample DIU data
 */
export function resetToSampleData(): AcademicData {
  saveAcademicData(INITIAL_SAMPLE_DATA);
  return INITIAL_SAMPLE_DATA;
}

