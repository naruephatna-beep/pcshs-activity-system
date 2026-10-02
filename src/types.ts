export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
  grade?: string; // e.g. "ม.4/1"
  studentNumber?: string; // e.g. "05101"
  email?: string;
  advisorName?: string;
  phone?: string;
}

export type CategoryId = 1 | 2 | 3 | 4 | 5;

export interface ActivityCategory {
  id: CategoryId;
  name: string;
  nameEn: string;
  requiredHours: number;
  iconName: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
  examples: string[];
}

export type SubmissionStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  categoryId: CategoryId;
  title: string;
  date: string;
  hours: number;
  location: string;
  description: string;
  evidenceUrl?: string;
  evidenceFileName?: string;
  status: SubmissionStatus;
  reviewComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface HomeroomRecord {
  id: string;
  date: string;
  grade: string;
  topic: string;
  advisorName: string;
  totalStudents: number;
  presentCount: number;
  notes: string;
}

export interface AppSettings {
  academicYear: string; // "2567"
  semester: string; // "2"
  googleSheetsUrl?: string;
  appsScriptDeploymentUrl?: string;
  lastSyncTime?: string;
  autoSyncEnabled: boolean;
}
