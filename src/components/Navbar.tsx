import React from 'react';
import { 
  LogOut, 
  User as UserIcon, 
  Database, 
  FileSpreadsheet, 
  Repeat
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/initialData';
import { User, UserRole } from '../types';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchRole: (targetRole: UserRole) => void;
  onOpenSheetsGuide: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onSwitchRole,
  onOpenSheetsGuide,
  onResetData
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'STUDENT':
        return { label: 'นักเรียน', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'TEACHER':
        return { label: 'ครูที่ปรึกษา', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'ADMIN':
        return { label: 'ผู้ดูแลระบบ', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  return (
    <header className="bg-[#0B2559] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <img
              src={SCHOOL_INFO.crestUrl}
              alt="PCSHS Kalasin"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight font-thai line-clamp-1">
                  {SCHOOL_INFO.nameTh}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-blue-200 font-thai line-clamp-1">
                ระบบกิจกรรมพัฒนาผู้เรียน ({SCHOOL_INFO.academicTerm})
              </p>
            </div>
          </div>

          {/* Right Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Google Sheets / Apps Script Quick Trigger */}
            <button
              onClick={onOpenSheetsGuide}
              title="ตั้งค่าเชื่อมต่อ Google Sheets & Apps Script"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-medium border border-emerald-400/30 transition shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span className="font-thai font-semibold">Google Sheets & Apps Script</span>
            </button>

            {/* Role Quick Switcher Pills for convenience */}
            <div className="hidden lg:flex items-center bg-[#07173b] p-1 rounded-xl border border-white/10 text-xs">
              <span className="text-slate-400 px-2 flex items-center gap-1 text-[11px] font-thai">
                <Repeat className="w-3 h-3 text-amber-400" /> สลับสิทธิ์:
              </span>
              <button
                onClick={() => onSwitchRole('STUDENT')}
                className={`px-2.5 py-1 rounded-lg font-thai font-medium transition cursor-pointer ${
                  currentUser.role === 'STUDENT'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                นักเรียน
              </button>
              <button
                onClick={() => onSwitchRole('TEACHER')}
                className={`px-2.5 py-1 rounded-lg font-thai font-medium transition cursor-pointer ${
                  currentUser.role === 'TEACHER'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                ครูที่ปรึกษา
              </button>
              <button
                onClick={() => onSwitchRole('ADMIN')}
                className={`px-2.5 py-1 rounded-lg font-thai font-medium transition cursor-pointer ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                ผู้ดูแลระบบ
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/15">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-500/30 border border-blue-400/30 flex items-center justify-center text-white shrink-0">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white font-thai max-w-[130px] truncate">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-[11px] text-blue-200 font-thai">
                  {currentUser.grade ? `ห้อง ${currentUser.grade}` : currentUser.email}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="ออกจากระบบ"
                className="p-2 rounded-lg text-slate-300 hover:text-rose-300 hover:bg-rose-900/30 border border-transparent hover:border-rose-500/30 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Sub-bar for Role and Sheets button */}
      <div className="sm:hidden flex items-center justify-between px-4 py-2 bg-[#07173b] border-t border-white/10 text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${badge.bg}`}>
            {badge.label}
          </span>
          <span className="text-white text-xs font-thai truncate max-w-[150px]">
            {currentUser.name}
          </span>
        </div>
        <button
          onClick={onOpenSheetsGuide}
          className="flex items-center gap-1 text-[11px] font-thai text-emerald-300 hover:text-emerald-100"
        >
          <Database className="w-3.5 h-3.5" />
          <span>ฐานข้อมูล / Sheets</span>
        </button>
      </div>
    </header>
  );
};
