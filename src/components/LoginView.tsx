import React, { useState } from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Eye, 
  EyeOff, 
  HelpCircle, 
  Lock, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Loader2,
  Download
} from 'lucide-react';
import { SCHOOL_INFO, INITIAL_CATEGORIES } from '../data/initialData';
import { User } from '../types';
import { downloadProjectZip } from '../services/zipExporter';

interface LoginViewProps {
  onLogin: (user: User) => void;
  availableUsers: User[];
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, availableUsers }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQuickFill = (userLogin: string, roleName: string) => {
    setUsername(userLogin);
    setPassword('••••••••••••');
    setErrorMsg(null);
    setFeedback(`เลือกบัญชีทดสอบ: ${roleName} (${userLogin}) - กดเข้าสู่ระบบเพื่อใช้งาน`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setFeedback(`กำลังตรวจสอบสิทธิ์และดึงข้อมูลจากระบบ...`);

    setTimeout(() => {
      // Find matching user from available users
      const cleanUsername = username.trim().toLowerCase();
      let matched = availableUsers.find(u => u.username.toLowerCase() === cleanUsername);

      if (!matched) {
        // Smart fallback by role pattern
        if (cleanUsername.startsWith('tch') || cleanUsername.includes('teacher')) {
          matched = availableUsers.find(u => u.role === 'TEACHER');
        } else if (cleanUsername.startsWith('admin') || cleanUsername.includes('audit')) {
          matched = availableUsers.find(u => u.role === 'ADMIN');
        } else {
          matched = availableUsers.find(u => u.role === 'STUDENT');
        }
      }

      if (matched) {
        setFeedback(`เข้าสู่ระบบสำเร็จ! ตรวจพบสิทธิ์: ${matched.role === 'STUDENT' ? 'นักเรียน' : matched.role === 'TEACHER' ? 'ครูที่ปรึกษา' : 'ผู้ดูแลระบบ'}`);
        setTimeout(() => {
          setIsLoading(false);
          onLogin(matched!);
        }, 600);
      } else {
        setIsLoading(false);
        setErrorMsg('ไม่พบบัญชีผู้ใช้งานนี้ในระบบ กรุณาตรวจสอบรหัสประจำตัว หรือคลิกเลือกบัญชีสาธิตด้านล่าง');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden bg-slate-50">
      {/* Left Branding Hero Section */}
      <section className="lg:w-5/12 xl:w-1/2 bg-[#0B2559] relative p-6 sm:p-10 lg:p-12 xl:p-16 text-white flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Ambient Backdrops */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#07173b] via-[#0B2559] to-[#04122d] opacity-95 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Institutional Header */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={SCHOOL_INFO.crestUrl}
              alt="ตราสัญลักษณ์โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์"
              className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 duration-300"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-thai leading-snug">
                {SCHOOL_INFO.nameTh}
              </h1>
              <p className="text-xs sm:text-sm font-light text-slate-300 tracking-wider uppercase mt-0.5">
                {SCHOOL_INFO.nameEn}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug font-thai">
              ระบบกิจกรรมพัฒนาผู้เรียน
              <span className="block text-amber-400 font-semibold text-lg sm:text-xl mt-1 font-sans">
                Learner Development Activity System
              </span>
            </h2>
            <p className="text-slate-300 text-sm font-thai leading-relaxed mt-2 max-w-lg">
              แพลตฟอร์มบันทึก ตรวจสอบ และประเมินผลกิจกรรมพัฒนาผู้เรียนตามเกณฑ์มาตรฐานหลักสูตรโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย
            </p>
          </div>
        </div>

        {/* 5 Activity Categories Badges */}
        <div className="relative z-10 my-8 hidden md:block">
          <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" />
            5 หมวดกิจกรรมพัฒนาผู้เรียน
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
            {INITIAL_CATEGORIES.map(cat => (
              <div 
                key={cat.id} 
                className={`flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition ${cat.id === 5 ? 'sm:col-span-2' : ''}`}
              >
                <span 
                  className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0"
                  style={{ backgroundColor: `${cat.color}30`, color: '#ffffff' }}
                >
                  {cat.id}
                </span>
                <span className="font-thai truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust & Support Indicator */}
        <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 border-t border-white/10 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Single Unified Sign-on • เข้าใช้งานได้ทุกสถานะ</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{SCHOOL_INFO.supportCenter}</span>
          </div>
        </div>
      </section>

      {/* Right Login Section */}
      <section className="lg:w-7/12 xl:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 bg-gradient-to-b from-slate-50 via-white to-blue-50/30 relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 pb-6 border-b border-slate-200 mb-6">
          <img
            src={SCHOOL_INFO.crestUrl}
            alt="ตราสัญลักษณ์โรงเรียน"
            className="h-12 w-auto object-contain"
          />
          <div>
            <p className="font-bold text-sm text-[#0B2559] leading-snug font-thai">{SCHOOL_INFO.nameTh}</p>
            <p className="text-xs text-slate-500 font-thai">ระบบกิจกรรมพัฒนาผู้เรียนออนไลน์</p>
          </div>
        </div>

        {/* Main Login Form Container */}
        <div className="w-full max-w-lg mx-auto my-auto py-2">
          {/* Form Heading */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-[#0B2559] text-xs font-semibold mb-3 border border-blue-100">
              <Users className="w-3.5 h-3.5 text-blue-700" />
              <span>Unified Role Gateway (เข้าใช้งานหน้าเดียวทุกสถานะ)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-thai">
              เข้าสู่ระบบงานกิจกรรม
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 font-thai">
              กรุณากรอกรหัสประจำตัว ระบบจะตรวจสอบสิทธิ์และนำเข้าสู่แดชบอร์ดตามบทบาทของท่านโดยอัตโนมัติ
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-thai flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {feedback && !errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-thai flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-700 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              )}
              <span>{feedback}</span>
            </div>
          )}

          {/* Unified Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label 
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between" 
                htmlFor="usernameInput"
              >
                <span>รหัสผู้ใช้งาน (Student / Staff ID)</span>
                <span className="text-slate-400 font-normal lowercase font-thai">นักเรียน 5 หลัก หรือ รหัสครู</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <input
                  id="usernameInput"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="เช่น 12345 หรือ tch.somchai หรือ std67101"
                  className="block w-full pl-11 pr-4 py-3 text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B2559] focus:border-[#0B2559] text-sm transition placeholder:text-slate-400 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider" htmlFor="passwordInput">
                  รหัสผ่าน (Password)
                </label>
                <button
                  type="button"
                  onClick={() => alert(`กรณีลืมรหัสผ่าน กรุณาติดต่อคุณครูที่ปรึกษา หรือ งานศูนย์วิทยบริการและไอที PCSHS Kalasin โทร. ${SCHOOL_INFO.phone}`)}
                  className="text-xs font-medium text-blue-700 hover:text-[#0B2559] hover:underline font-thai"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="passwordInput"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-11 pr-11 py-3 text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B2559] focus:border-[#0B2559] text-sm transition placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                  aria-label="สลับการมองเห็นรหัสผ่าน"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B2559] border-slate-300 focus:ring-[#0B2559]"
                />
                <span className="ml-2 text-xs text-slate-600 font-medium font-thai">จดจำการเข้าสู่ระบบในอุปกรณ์นี้</span>
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-thai">
                <Lock className="w-3 h-3 text-slate-400" />
                SSL เข้ารหัส 256-bit
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-[#0B2559] hover:bg-[#07173b] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span className="absolute right-0 top-0 h-full w-1.5 bg-amber-400" />
              <span className="font-thai font-bold text-base tracking-wide">
                {isLoading ? 'กำลังนำเข้าสู่ระบบ...' : 'เข้าสู่ระบบ (Sign In)'}
              </span>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>

          {/* Quick Access Demo Roles */}
          <div className="mt-7 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-thai">
                หรือทดลองเข้าใช้งานตามบทบาท (Quick Access Demo)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold font-thai">
                สำหรับสาธิต
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Student Card */}
              <button
                type="button"
                onClick={() => handleQuickFill('std67101', 'นักเรียน')}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/60 transition group shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm group-hover:scale-110 transition">
                    🎓
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-thai">นักเรียน</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 font-thai">
                  บันทึกอ่านหนังสือ ออกกำลังกาย บำเพ็ญประโยชน์ เช็คชั่วโมง
                </p>
              </button>

              {/* Teacher Card */}
              <button
                type="button"
                onClick={() => handleQuickFill('tch.worawoot', 'ครูที่ปรึกษา')}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/60 transition group shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm group-hover:scale-110 transition">
                    👨‍🏫
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-thai">ครูและที่ปรึกษา</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 font-thai">
                  ตรวจหลักฐาน อนุมัติกิจกรรม บันทึก Homeroom ประเมินผล
                </p>
              </button>

              {/* Admin Card */}
              <button
                type="button"
                onClick={() => handleQuickFill('admin.activity', 'ผู้ดูแลระบบ')}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-purple-400 bg-white hover:bg-purple-50/60 transition group shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-sm group-hover:scale-110 transition">
                    🛡️
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-thai">ผู้ดูแลระบบ</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 font-thai">
                  เกณฑ์ 5 หมวด จัดการฐานข้อมูล นำเข้าข้อมูล ออกรายงาน ปพ.5
                </p>
              </button>
            </div>

            {/* Direct Project ZIP Download for GitHub */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between bg-slate-50 p-3 rounded-xl border">
              <div>
                <p className="text-xs font-bold text-slate-800 font-thai">ต้องการนำโค้ดไปใส่ GitHub ด้วยตัวเอง?</p>
                <p className="text-[11px] text-slate-500 font-thai">ดาวน์โหลดไฟล์ทั้งหมดของเว็บนี้เป็น .ZIP ไปแตกไฟล์แล้วลากขึ้น GitHub ได้เลย</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await downloadProjectZip();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B2559] hover:bg-[#07173b] text-white text-xs font-bold transition shadow-sm shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดไฟล์ .ZIP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-slate-200/80 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <p className="font-thai">
            © 2567 {SCHOOL_INFO.nameTh} • พัฒนาโดยกลุ่มงานพัฒนาระบบสารสนเทศ
          </p>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => alert('สามารถดูคู่มือการใช้งานระบบกิจกรรมพัฒนาผู้เรียนและคู่มือ Google Sheets Integration ได้ในแถบเมนูช่วยเหลือ')}
              className="hover:text-[#0B2559] hover:underline font-thai"
            >
              คู่มือการใช้งาน
            </button>
            <span>•</span>
            <button 
              type="button"
              onClick={() => alert('ระบบปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) เพื่อความปลอดภัยของข้อมูลนักเรียนและบุคลากร')}
              className="hover:text-[#0B2559] hover:underline font-thai"
            >
              นโยบายข้อมูลส่วนบุคคล (PDPA)
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};
