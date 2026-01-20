export interface Consumer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  purpose: string;
  status: 'Aktif' | 'Non-Aktif' | 'Prospek';
  invoiceRef: string;
  dateAdded: string; // ISO String
}

export interface CompanyConfig {
  useLetterhead: boolean;
  name: string;
  address: string;
  phone: string;
  logo: string | null; // Base64
}

export interface ReportMeta {
  year: number;
  month: number;
  location: string;
  date: string;
  letterNumber: string;
  authorName: string;
  authorRole: string;
  signature: string | null; // Base64
  stamp: string | null; // Base64
}

export interface AppState {
  consumers: Consumer[];
  company: CompanyConfig;
  meta: ReportMeta;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}