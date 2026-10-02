import { ActivityCategory, AppSettings, HomeroomRecord, StudentSubmission, User } from '../types';
import { INITIAL_CATEGORIES, INITIAL_HOMEROOM, INITIAL_SETTINGS, INITIAL_SUBMISSIONS, INITIAL_USERS } from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'pcshs_users_v1',
  SUBMISSIONS: 'pcshs_submissions_v1',
  HOMEROOM: 'pcshs_homeroom_v1',
  CATEGORIES: 'pcshs_categories_v1',
  SETTINGS: 'pcshs_settings_v1',
  CURRENT_USER: 'pcshs_current_user_v1',
};

export const storageService = {
  // --- USERS ---
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
    return users;
  },

  updateUser(updated: User) {
    const users = this.getUsers().map(u => u.id === updated.id ? updated : u);
    this.saveUsers(users);
    return users;
  },

  deleteUser(userId: string) {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveUsers(users);
    return users;
  },

  // --- SUBMISSIONS ---
  getSubmissions(): StudentSubmission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  },

  saveSubmissions(subs: StudentSubmission[]) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
  },

  addSubmission(sub: Omit<StudentSubmission, 'id' | 'createdAt'>): StudentSubmission {
    const subs = this.getSubmissions();
    const newSubmission: StudentSubmission = {
      ...sub,
      id: 'sub-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    subs.unshift(newSubmission);
    this.saveSubmissions(subs);

    // Optional background sync with Apps Script if configured
    this.syncToAppsScript('saveSubmission', newSubmission).catch(console.error);

    return newSubmission;
  },

  updateSubmissionStatus(id: string, status: 'APPROVED' | 'REJECTED', reviewComment?: string, reviewedBy?: string) {
    const subs = this.getSubmissions().map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          status,
          reviewComment: reviewComment || sub.reviewComment,
          reviewedBy: reviewedBy || sub.reviewedBy,
          reviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return sub;
    });
    this.saveSubmissions(subs);

    this.syncToAppsScript('updateStatus', { id, status, reviewComment, reviewedBy }).catch(console.error);
    return subs;
  },

  deleteSubmission(id: string) {
    const subs = this.getSubmissions().filter(s => s.id !== id);
    this.saveSubmissions(subs);
    return subs;
  },

  // --- CATEGORIES ---
  getCategories(): ActivityCategory[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  // --- HOMEROOM ---
  getHomeroomRecords(): HomeroomRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HOMEROOM);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HOMEROOM, JSON.stringify(INITIAL_HOMEROOM));
      return INITIAL_HOMEROOM;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_HOMEROOM;
    }
  },

  addHomeroomRecord(rec: Omit<HomeroomRecord, 'id'>) {
    const records = this.getHomeroomRecords();
    const newRecord: HomeroomRecord = {
      ...rec,
      id: 'hr-' + Date.now().toString(36)
    };
    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.HOMEROOM, JSON.stringify(records));
    return records;
  },

  // --- SETTINGS ---
  getSettings(): AppSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // --- CURRENT USER SESSION ---
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // --- RESET ALL DATA TO DEMO DEFAULT ---
  resetAllData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    localStorage.setItem(STORAGE_KEYS.HOMEROOM, JSON.stringify(INITIAL_HOMEROOM));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  },

  // --- APPS SCRIPT SYNC ---
  async syncToAppsScript(action: string, payload: unknown): Promise<{ success: boolean; message?: string }> {
    const settings = this.getSettings();
    if (!settings.appsScriptDeploymentUrl || !settings.appsScriptDeploymentUrl.startsWith('http')) {
      return { success: false, message: 'ยังไม่ได้ระบุ Apps Script Web App URL' };
    }

    try {
      const response = await fetch(settings.appsScriptDeploymentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', // Apps Script web apps often require no-cors or redirect handling
        body: JSON.stringify({ action, payload })
      });

      // Update sync timestamp
      settings.lastSyncTime = new Date().toLocaleTimeString('th-TH');
      this.saveSettings(settings);

      return { success: true, message: 'ส่งข้อมูลไปยัง Google Apps Script สำเร็จ' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: 'ไม่สามารถติดต่อ Apps Script ได้: ' + msg };
    }
  },

  // --- CSV EXPORTER ---
  exportToCsv(filename: string, rows: Record<string, unknown>[]) {
    if (!rows || !rows.length) return;
    const headers = Object.keys(rows[0]);
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(field => {
          let val = row[field];
          if (val === null || val === undefined) val = '';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        }).join(',')
      )
    ].join('\r\n');

    // Add UTF-8 BOM for Excel in Thai language
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
