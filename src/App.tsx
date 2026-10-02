import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { ActivityCategory, AppSettings, HomeroomRecord, StudentSubmission, User, UserRole } from './types';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { AdminPortal } from './components/AdminPortal';
import { NewSubmissionModal } from './components/NewSubmissionModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storageService.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => storageService.getUsers());
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => storageService.getSubmissions());
  const [categories] = useState<ActivityCategory[]>(() => storageService.getCategories());
  const [homeroomRecords, setHomeroomRecords] = useState<HomeroomRecord[]>(() => storageService.getHomeroomRecords());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());

  // Modal triggers
  const [isNewSubmissionOpen, setIsNewSubmissionOpen] = useState(false);
  const [isSheetsGuideOpen, setIsSheetsGuideOpen] = useState(false);

  // Sync state to storage
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    storageService.setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storageService.setCurrentUser(null);
  };

  const handleSwitchRole = (targetRole: UserRole) => {
    // Find representative user of target role
    const matched = users.find(u => u.role === targetRole);
    if (matched) {
      setCurrentUser(matched);
      storageService.setCurrentUser(matched);
    }
  };

  const handleAddSubmission = (data: Omit<StudentSubmission, 'id' | 'createdAt'>) => {
    const newSub = storageService.addSubmission(data);
    setSubmissions(prev => [newSub, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: 'APPROVED' | 'REJECTED', comment?: string, reviewedBy?: string) => {
    const updated = storageService.updateSubmissionStatus(id, status, comment, reviewedBy);
    setSubmissions([...updated]);
  };

  const handleAddHomeroom = (rec: Omit<HomeroomRecord, 'id'>) => {
    const updated = storageService.addHomeroomRecord(rec);
    setHomeroomRecords([...updated]);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleResetAllData = () => {
    storageService.resetAllData();
    setUsers(storageService.getUsers());
    setSubmissions(storageService.getSubmissions());
    setHomeroomRecords(storageService.getHomeroomRecords());
    setSettings(storageService.getSettings());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-thai selection:bg-amber-500 selection:text-white">
      {!currentUser ? (
        <LoginView
          onLogin={handleLogin}
          availableUsers={users}
        />
      ) : (
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Main School Navigation */}
          <Navbar
            currentUser={currentUser}
            onLogout={handleLogout}
            onSwitchRole={handleSwitchRole}
            onOpenSheetsGuide={() => setIsSheetsGuideOpen(true)}
            onResetData={handleResetAllData}
          />

          {/* Portal Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {currentUser.role === 'STUDENT' && (
              <StudentPortal
                currentUser={currentUser}
                submissions={submissions}
                categories={categories}
                onOpenNewSubmission={() => setIsNewSubmissionOpen(true)}
              />
            )}

            {currentUser.role === 'TEACHER' && (
              <TeacherPortal
                currentUser={currentUser}
                submissions={submissions}
                users={users}
                categories={categories}
                homeroomRecords={homeroomRecords}
                onUpdateStatus={handleUpdateStatus}
                onAddHomeroomRecord={handleAddHomeroom}
              />
            )}

            {currentUser.role === 'ADMIN' && (
              <AdminPortal
                currentUser={currentUser}
                submissions={submissions}
                users={users}
                categories={categories}
                homeroomRecords={homeroomRecords}
                settings={settings}
                onOpenSheetsGuide={() => setIsSheetsGuideOpen(true)}
                onUpdateSubmissions={(updated) => setSubmissions(updated)}
                onUpdateUsers={(updated) => setUsers(updated)}
                onResetAllData={handleResetAllData}
              />
            )}
          </main>
        </div>
      )}

      {/* Global Modals */}
      {currentUser && (
        <>
          <NewSubmissionModal
            isOpen={isNewSubmissionOpen}
            onClose={() => setIsNewSubmissionOpen(false)}
            currentUser={currentUser}
            onSubmit={handleAddSubmission}
          />

          <GoogleSheetsModal
            isOpen={isSheetsGuideOpen}
            onClose={() => setIsSheetsGuideOpen(false)}
            submissions={submissions}
            users={users}
            homeroom={homeroomRecords}
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        </>
      )}
    </div>
  );
}
