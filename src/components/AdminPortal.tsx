import React, { useState } from 'react';
import { 
  Database, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  CheckCircle, 
  RotateCcw, 
  Save, 
  Users, 
  BookOpen, 
  Award, 
  Calendar,
  FileText
} from 'lucide-react';
import { ActivityCategory, AppSettings, HomeroomRecord, StudentSubmission, User } from '../types';
import { SCHOOL_INFO } from '../data/initialData';
import { storageService } from '../services/storageService';

interface AdminPortalProps {
  currentUser: User;
  submissions: StudentSubmission[];
  users: User[];
  categories: ActivityCategory[];
  homeroomRecords: HomeroomRecord[];
  settings: AppSettings;
  onOpenSheetsGuide: () => void;
  onUpdateSubmissions: (subs: StudentSubmission[]) => void;
  onUpdateUsers: (users: User[]) => void;
  onResetAllData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  submissions,
  users,
  categories,
  homeroomRecords,
  settings,
  onOpenSheetsGuide,
  onUpdateSubmissions,
  onUpdateUsers,
  onResetAllData
}) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'report_pp5' | 'settings'>('tables');
  const [selectedTable, setSelectedTable] = useState<'submissions' | 'students' | 'categories'>('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Student modal
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('ม.4/1');
  const [newStudentAdvisor, setNewStudentAdvisor] = useState('ครูวรวุฒิ สิทธิโชค');

  // Report filter
  const [reportGrade, setReportGrade] = useState('ม.4/1');

  // Filtered submissions
  const filteredSubmissions = submissions.filter(s => 
    s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentGrade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered students
  const filteredStudents = users.filter(u => u.role === 'STUDENT' && (
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.grade && u.grade.toLowerCase().includes(searchQuery.toLowerCase()))
  ));

  const handleDeleteSubmission = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการกิจกรรมนี้ออกจากฐานข้อมูล?')) {
      const updated = storageService.deleteSubmission(id);
      onUpdateSubmissions(updated);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนคนนี้ออกจากฐานข้อมูล?')) {
      const updated = storageService.deleteUser(id);
      onUpdateUsers(updated);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentUsername.trim() || !newStudentName.trim()) return;

    const newStudent: User = {
      id: 'u-std-' + Date.now(),
      username: newStudentUsername.trim(),
      name: newStudentName.trim(),
      role: 'STUDENT',
      grade: newStudentGrade,
      studentNumber: newStudentUsername.trim().replace(/\D/g, '').slice(-2) || '01',
      advisorName: newStudentAdvisor,
      email: `${newStudentUsername.trim().toLowerCase()}@pcshsksn.ac.th`
    };

    const updated = storageService.addUser(newStudent);
    onUpdateUsers(updated);
    setIsAddStudentOpen(false);
    setNewStudentName('');
    setNewStudentUsername('');
    alert(`เพิ่มนักเรียน "${newStudent.name}" ลงในฐานข้อมูลเรียบร้อยแล้ว!`);
  };

  const handleExportCurrentTable = () => {
    if (selectedTable === 'submissions') {
      storageService.exportToCsv('PCSHS_Kalasin_Submissions_Export', submissions.map(s => ({
        ID: s.id,
        รหัสนักเรียน: s.studentId,
        ชื่อนักเรียน: s.studentName,
        ชั้นห้อง: s.studentGrade,
        หมวดกิจกรรม: s.categoryId,
        ชื่อกิจกรรม: s.title,
        วันที่: s.date,
        ชั่วโมง: s.hours,
        สถานที่: s.location,
        สถานะ: s.status,
        ความเห็นครู: s.reviewComment || '',
        ผู้ตรวจ: s.reviewedBy || '',
        วันที่ตรวจ: s.reviewedAt || ''
      })));
    } else {
      storageService.exportToCsv('PCSHS_Kalasin_Students_Export', filteredStudents.map(u => ({
        รหัสประจำตัว: u.username,
        ชื่อนามสกุล: u.name,
        ชั้นห้อง: u.grade,
        เลขที่: u.studentNumber,
        ครูที่ปรึกษา: u.advisorName,
        อีเมล: u.email
      })));
    }
  };

  return (
    <div className="space-y-6 pb-16 font-thai">
      
      {/* Admin Top Header Banner */}
      <div className="bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#6d28d9] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ศูนย์บริหารจัดการฐานข้อมูล & ฝ่ายวัดผลการศึกษา</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              จัดการฐานข้อมูลและออกรายงาน ปพ.5
            </h2>
            <p className="text-purple-200 text-xs sm:text-sm max-w-xl">
              จัดการฐานข้อมูลได้ง่ายเสมือน AppSheet และ Google Sheets • สามารถดู แก้ไข เพิ่มแถว นำเข้า และพิมพ์แบบ ปพ.5 ตามระเบียบโรงเรียน
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenSheetsGuide}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>เชื่อมต่อ Google Sheets & Apps Script</span>
            </button>

            <button
              onClick={() => setActiveTab('report_pp5')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ ปพ.5 สรุปกิจกรรม</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-xs text-purple-200 uppercase font-semibold">จำนวนนักเรียนในระบบ</p>
            <p className="text-2xl font-black font-sans text-white mt-1">{filteredStudents.length} คน</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-xs text-purple-200 uppercase font-semibold">รายการส่งกิจกรรมทั้งหมด</p>
            <p className="text-2xl font-black font-sans text-white mt-1">{submissions.length} รายการ</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-xs text-purple-200 uppercase font-semibold">สถานะการอนุมัติ</p>
            <p className="text-2xl font-black font-sans text-emerald-300 mt-1">
              {Math.round((submissions.filter(s => s.status === 'APPROVED').length / (submissions.length || 1)) * 100)}%
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-xs text-purple-200 uppercase font-semibold">สถานะฐานข้อมูล</p>
            <p className="text-xs font-bold text-amber-300 mt-2">
              {settings.appsScriptDeploymentUrl ? '🟢 ซิงค์กับ Google Sheet' : '🔵 โหมดฐานข้อมูลในตัว (พร้อมใช้)'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab('tables')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'tables'
              ? 'border-purple-600 text-purple-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>ตารางฐานข้อมูลเสมือน Google Sheets / AppSheet</span>
        </button>

        <button
          onClick={() => setActiveTab('report_pp5')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'report_pp5'
              ? 'border-purple-600 text-purple-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>แบบรายงานผล ปพ.5 กิจกรรมพัฒนาผู้เรียน (ทางการ)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-purple-600 text-purple-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>การตั้งค่าเชื่อมต่อ Google Sheets</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE DATA TABLES (AppSheet / Sheets Style) */}
      {activeTab === 'tables' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          
          {/* Table Selector Pills & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Sheet Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setSelectedTable('submissions')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedTable === 'submissions'
                    ? 'bg-[#0B2559] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <span>ตารางการส่งกิจกรรม (Submissions)</span>
                <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">{submissions.length}</span>
              </button>

              <button
                onClick={() => setSelectedTable('students')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedTable === 'students'
                    ? 'bg-[#0B2559] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <span>ตารางนักเรียน (Students)</span>
                <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">{filteredStudents.length}</span>
              </button>

              <button
                onClick={() => setSelectedTable('categories')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedTable === 'categories'
                    ? 'bg-[#0B2559] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <span>ตารางเกณฑ์ 5 หมวด</span>
              </button>
            </div>

            {/* Actions: Search, Add, Export */}
            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาในตาราง..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0B2559]"
                />
              </div>

              {selectedTable === 'students' && (
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="px-3 py-1.5 bg-[#0B2559] hover:bg-[#07173b] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มนักเรียนใหม่</span>
                </button>
              )}

              <button
                onClick={handleExportCurrentTable}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                title="ส่งออกตารางเป็นไฟล์ CSV สำหรับเปิดใน Excel หรือ Google Sheets"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออก CSV</span>
              </button>
            </div>

          </div>

          {/* TABLE: SUBMISSIONS */}
          {selectedTable === 'submissions' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0B2559] text-white sticky top-0 z-10">
                    <tr>
                      <th className="p-3">รหัสรายการ</th>
                      <th className="p-3">ชื่อนักเรียน</th>
                      <th className="p-3">ชั้นห้อง</th>
                      <th className="p-3">หมวด</th>
                      <th className="p-3">ชื่อกิจกรรม</th>
                      <th className="p-3 text-center">วันที่</th>
                      <th className="p-3 text-center">ชั่วโมง</th>
                      <th className="p-3 text-center">สถานะ</th>
                      <th className="p-3">ผู้ตรวจ</th>
                      <th className="p-3 text-center">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.map((sub, idx) => (
                      <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100'}>
                        <td className="p-3 font-mono text-slate-500 font-semibold">{sub.id}</td>
                        <td className="p-3 font-bold text-slate-900">{sub.studentName}</td>
                        <td className="p-3 font-semibold text-slate-700">{sub.studentGrade}</td>
                        <td className="p-3 font-bold text-blue-700">หมวด {sub.categoryId}</td>
                        <td className="p-3 text-slate-800 max-w-xs truncate" title={sub.title}>{sub.title}</td>
                        <td className="p-3 text-center text-slate-600 whitespace-nowrap">{sub.date}</td>
                        <td className="p-3 text-center font-bold font-sans text-amber-700">{sub.hours}</td>
                        <td className="p-3 text-center whitespace-nowrap">
                          {sub.status === 'APPROVED' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              อนุมัติแล้ว
                            </span>
                          )}
                          {sub.status === 'PENDING' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              รอตรวจสอบ
                            </span>
                          )}
                          {sub.status === 'REJECTED' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              ส่งกลับแก้ไข
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-600">{sub.reviewedBy || '-'}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteSubmission(sub.id)}
                            title="ลบรายการ"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABLE: STUDENTS */}
          {selectedTable === 'students' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0B2559] text-white sticky top-0 z-10">
                    <tr>
                      <th className="p-3">รหัสผู้ใช้ / ID</th>
                      <th className="p-3">ชื่อ-นามสกุล</th>
                      <th className="p-3">ชั้นห้อง</th>
                      <th className="p-3">เลขที่</th>
                      <th className="p-3">อีเมลโรงเรียน</th>
                      <th className="p-3">ครูที่ปรึกษา</th>
                      <th className="p-3 text-center">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((st, idx) => (
                      <tr key={st.id} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100'}>
                        <td className="p-3 font-mono font-bold text-slate-700">{st.username}</td>
                        <td className="p-3 font-bold text-slate-900">{st.name}</td>
                        <td className="p-3 font-semibold text-slate-700">{st.grade}</td>
                        <td className="p-3 text-slate-600">{st.studentNumber || '-'}</td>
                        <td className="p-3 text-slate-500 font-mono">{st.email}</td>
                        <td className="p-3 text-slate-700">{st.advisorName || '-'}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteUser(st.id)}
                            title="ลบนักเรียน"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABLE: CATEGORIES */}
          {selectedTable === 'categories' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#0B2559] text-white">
                  <tr>
                    <th className="p-3">หมวดที่</th>
                    <th className="p-3">ชื่อหมวดกิจกรรม</th>
                    <th className="p-3 text-center">เกณฑ์ขั้นต่ำ (ชั่วโมง)</th>
                    <th className="p-3">รายละเอียดและเกณฑ์</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-blue-900 text-center font-sans">{cat.id}</td>
                      <td className="p-3 font-bold text-slate-900">{cat.name}</td>
                      <td className="p-3 text-center font-bold text-amber-700 font-sans text-sm">{cat.requiredHours} ชม.</td>
                      <td className="p-3 text-slate-600">{cat.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: OFFICIAL REPORT ปพ.5 (Ready to Print) */}
      {activeTab === 'report_pp5' && (
        <div className="space-y-4">
          
          {/* Print Action Header */}
          <div className="no-print bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">เลือกห้องเรียนเพื่อออกรายงาน:</span>
              <select
                value={reportGrade}
                onChange={(e) => setReportGrade(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
              >
                <option value="ม.4/1">ชั้นมัธยมศึกษาปีที่ 4/1</option>
                <option value="ม.4/2">ชั้นมัธยมศึกษาปีที่ 4/2</option>
                <option value="ม.5/2">ชั้นมัธยมศึกษาปีที่ 5/2</option>
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B2559] hover:bg-[#07173b] text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>สั่งพิมพ์รายงาน ปพ.5 (Print / Save as PDF)</span>
            </button>
          </div>

          {/* The Official ปพ.5 Document Container */}
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-md max-w-4xl mx-auto text-slate-900 font-thai leading-normal">
            
            {/* Document Header */}
            <div className="text-center space-y-2 border-b-2 border-slate-900 pb-5 mb-6">
              <img
                src={SCHOOL_INFO.crestUrl}
                alt="ตราสัญลักษณ์โรงเรียน"
                className="h-20 w-auto mx-auto object-contain"
              />
              <h1 className="text-xl font-bold tracking-tight">
                แบบบันทึกและรายงานผลกิจกรรมพัฒนาผู้เรียน (ปพ.5)
              </h1>
              <p className="text-base font-semibold">
                {SCHOOL_INFO.nameTh}
              </p>
              <p className="text-xs text-slate-600">
                {SCHOOL_INFO.nameEn}
              </p>
              <p className="text-xs font-medium pt-1">
                ประจำ{SCHOOL_INFO.academicTerm} • ระดับ{reportGrade}
              </p>
            </div>

            {/* Table of Students & 5 Categories */}
            <table className="w-full text-xs border-collapse border border-slate-400 mb-8">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 p-2 text-center w-10">ที่</th>
                  <th className="border border-slate-400 p-2 text-center w-20">เลขประจำตัว</th>
                  <th className="border border-slate-400 p-2 text-left">ชื่อ - สกุล</th>
                  <th className="border border-slate-400 p-2 text-center w-14">หมวด 1<br/>(20 ชม.)</th>
                  <th className="border border-slate-400 p-2 text-center w-14">หมวด 2<br/>(20 ชม.)</th>
                  <th className="border border-slate-400 p-2 text-center w-14">หมวด 3<br/>(20 ชม.)</th>
                  <th className="border border-slate-400 p-2 text-center w-14">หมวด 4<br/>(15 ชม.)</th>
                  <th className="border border-slate-400 p-2 text-center w-14">หมวด 5<br/>(25 ชม.)</th>
                  <th className="border border-slate-400 p-2 text-center w-16">รวม<br/>(ชม.)</th>
                  <th className="border border-slate-400 p-2 text-center w-20">ผลประเมิน</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === 'STUDENT' && u.grade === reportGrade).map((st, index) => {
                  const stSubs = submissions.filter(s => s.studentId === st.id && s.status === 'APPROVED');
                  const h1 = stSubs.filter(s => s.categoryId === 1).reduce((sum, s) => sum + s.hours, 0);
                  const h2 = stSubs.filter(s => s.categoryId === 2).reduce((sum, s) => sum + s.hours, 0);
                  const h3 = stSubs.filter(s => s.categoryId === 3).reduce((sum, s) => sum + s.hours, 0);
                  const h4 = stSubs.filter(s => s.categoryId === 4).reduce((sum, s) => sum + s.hours, 0);
                  const h5 = stSubs.filter(s => s.categoryId === 5).reduce((sum, s) => sum + s.hours, 0);
                  const total = h1 + h2 + h3 + h4 + h5;
                  const isPass = h1 >= 20 && h2 >= 20 && h3 >= 20 && h4 >= 15 && h5 >= 25;

                  return (
                    <tr key={st.id}>
                      <td className="border border-slate-400 p-2 text-center">{index + 1}</td>
                      <td className="border border-slate-400 p-2 text-center font-mono">{st.username}</td>
                      <td className="border border-slate-400 p-2 font-medium">{st.name}</td>
                      <td className="border border-slate-400 p-2 text-center">{h1}</td>
                      <td className="border border-slate-400 p-2 text-center">{h2}</td>
                      <td className="border border-slate-400 p-2 text-center">{h3}</td>
                      <td className="border border-slate-400 p-2 text-center">{h4}</td>
                      <td className="border border-slate-400 p-2 text-center">{h5}</td>
                      <td className="border border-slate-400 p-2 text-center font-bold">{total}</td>
                      <td className="border border-slate-400 p-2 text-center font-bold">
                        {isPass ? 'ผ่าน (ผ)' : 'ไม่ผ่าน (มผ)'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Signature Block */}
            <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs">
              <div className="space-y-8">
                <p>ลงชื่อ...................................................... ครูที่ปรึกษา</p>
                <p>( อ.วรวุฒิ สิทธิโชค )</p>
                <p>วันที่ .......... เดือน .................... พ.ศ. 2567</p>
              </div>

              <div className="space-y-8">
                <p>ลงชื่อ...................................................... หัวหน้าฝ่ายวัดผลและวิชาการ</p>
                <p>( ................................................................ )</p>
                <p>ผู้อำนวยการโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & RESET */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              การจัดการระบบและรีเซ็ตฐานข้อมูล
            </h3>
            <p className="text-xs text-slate-500">
              จัดการข้อมูลความปลอดภัย หรือรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นสำหรับการสาธิต
            </p>
          </div>

          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-rose-900 text-sm">รีเซ็ตข้อมูลตัวอย่างทั้งหมด (Reset to Demo Data)</h4>
              <p className="text-xs text-rose-700 mt-0.5">
                หากท่านต้องการล้างข้อมูลที่ทดสอบทั้งหมด และคืนค่าข้อมูลนักเรียนและกิจกรรมเริ่มต้นของ PCSHS Kalasin
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นของโรงเรียนใช่หรือไม่?')) {
                  onResetAllData();
                  alert('รีเซ็ตข้อมูลเรียบร้อยแล้ว');
                }
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
            >
              รีเซ็ตข้อมูลทั้งหมด
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add New Student */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">เพิ่มข้อมูลนักเรียนใหม่</h3>
            
            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">รหัสประจำตัวนักเรียน (Username):</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น std67104"
                  value={newStudentUsername}
                  onChange={(e) => setNewStudentUsername(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ชื่อ - สกุล นักเรียน:</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น เด็กชายพงศกร วิทยาศาสตร์"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ระดับชั้น/ห้อง:</label>
                  <select
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="ม.4/1">ม.4/1</option>
                    <option value="ม.4/2">ม.4/2</option>
                    <option value="ม.5/2">ม.5/2</option>
                    <option value="ม.6/1">ม.6/1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ครูที่ปรึกษา:</label>
                  <input
                    type="text"
                    value={newStudentAdvisor}
                    onChange={(e) => setNewStudentAdvisor(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2559] hover:bg-[#07173b] text-white font-bold rounded-lg cursor-pointer"
                >
                  บันทึกนักเรียน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
