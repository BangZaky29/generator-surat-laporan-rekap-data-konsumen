import { AppState, Consumer, CompanyConfig, ReportMeta } from '../types';

const STORAGE_KEY = 'consumer_recap_v1';

const defaultState: AppState = {
  consumers: [],
  company: {
    useLetterhead: true,
    name: 'PT. MAJU MUNDUR SUKSES',
    address: 'Jl. Jendral Sudirman No. 123, Jakarta Pusat, Indonesia',
    phone: '(021) 555-0123',
    logo: null,
  },
  meta: {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    location: 'Jakarta',
    date: new Date().toISOString().split('T')[0],
    letterNumber: '001/MMS/REP/X/2024',
    authorName: 'Budi Santoso',
    authorRole: 'Manager Pemasaran',
    signature: null,
    stamp: null,
  },
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return defaultState;
    return JSON.parse(serialized);
  } catch (err) {
    console.error('Failed to load state', err);
    return defaultState;
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state', err);
  }
};

// Helpers for image handling
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};