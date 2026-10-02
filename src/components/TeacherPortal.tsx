import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  BookOpen, 
  FileText, 
  Filter, 
  MessageSquare, 
  Calendar, 
  CheckCheck,
  PlusCircle,
  ExternalLink,
  Search
} from 'lucide-react';
import { ActivityCategory, HomeroomRecord, StudentSubmission, User } from '../types';

interface TeacherPortalProps {
  currentUser: User;
  submissions: StudentSubmission[];
  users: User[];
  categories: ActivityCategory[];
  homeroomRecords: HomeroomRecord[];
  onUpdateStatus: (id: string, status: 'APPROVED' | 'REJECTED', comment?: string, reviewedBy?: string) => void;
  onAddHomeroomRecord: (rec: Omit<HomeroomRecord, 'id'>) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  currentUser,
  submissions,
  users,
  categories,
  homeroomRecords,
  onUpdateStatus,
  onAddHomeroomRecord
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'roster' | 'homeroom'>('pending');
  const [classFilter, setClassFilter] = useState<string>(currentUser.grade || 'ม.4/1');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Review modal state
  const [reviewingItem, setReviewingItem] = useState<StudentSubmission | null>(null);
  const [reviewComment, setReviewComment] = useState('หลักฐานครบถ้วน มีความรับผิดชอบดีเยี่ยม');
  const [reviewDecision, setReviewDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');

  // Homeroom form state
  const [showHomeroomForm, setShowHomeroomForm] = useState(false);
  const [hrTopic, setHrTopic] = useState('');
  const [hrDate, setHrDate] = useState(new Date().toISOString().substring(0, 10));
  const [hrPresent, setHrPresent] = useState(24);
  const [hrTotal, setHrTotal] = useState(24);
  const [hrNotes, setHrNotes] = useState('');

  // Pending queue
  const pendingSubmissions = submissions.filter(s => s.status === 'PENDING');
  const approvedCount = submissions.filter(s => s.status === 'APPROVED').length;

  // Filtered pending items
  const filteredPending = pendingSubmissions.filter(s => {
    const matchClass = classFilter === 'ALL' || s.studentGrade === classFilter;
    const matchSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  // Students in class roster
  const studentUsers = users.filter(u => u.role === 'STUDENT' && (classFilter === 'ALL' || u.grade === classFilter));

  const handleOpenReview = (sub: StudentSubmission, decision: 'APPROVED' | 'REJECTED') => {
    setReviewingItem(sub);
    setReviewDecision(decision);
    setReviewComment(decision === 'APPROVED' ? 'หลักฐานถูกต้อง ครบถ้วนตามเกณฑ์' : 'กรุณาแนบภาพหลักฐานที่ชัดเจนเพิ่มเติม');
  };

  const handleConfirmReview = () => {
    if (!reviewingItem) return;
    onUpdateStatus(reviewingItem.id, reviewDecision, reviewComment, currentUser.name);
    setReviewingItem(null);
  };

  const handleBatchApprove = () => {
    if (!filteredPending.length) return;
    if (confirm(`ต้องการอนุมัติกิจกรรมทั้งหมด ${filteredPending.length} รายการที่กำลังแสดงผลใช่หรือไม่?`)) {
      filteredPending.forEach(item => {
        onUpdateStatus(item.id, 'APPROVED', 'อนุมัติเรียบร้อยโดยครูที่ปรึกษา', currentUser.name);
      });
    }
  };

  const handleCreateHomeroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hrTopic.trim()) return;

    onAddHomeroomRecord({
      date: hrDate,
      grade: classFilter === 'ALL' ? 'ม.4/1' : classFilter,
      topic: hrTopic.trim(),
      advisorName: currentUser.name,
      totalStudents: hrTotal,
      presentCount: hrPresent,
      notes: hrNotes.trim()
    });

    setHrTopic('');
    setHrNotes('');
    setShowHomeroomForm(false);
  };

  return (
    <div className="space-y-6 pb-12 font-thai">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0d9488] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>แดชบอร์ดครูและผู้ตรวจกิจกรรม • {currentUser.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ศูนย์ตรวจสอบและอนุมัติกิจกรรม
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              ห้องเรียนในความดูแล: <strong className="text-white underline">{currentUser.grade || 'ม.4/1'}</strong> | ตรวจสอบหลักฐาน บันทึกผล และส่งเสริมคุณลักษณะอันพึงประสงค์ของนักเรียน
            </p>
          </div>

          <div className="flex items-center gap-3">
            {pendingSubmissions.length > 0 && (
              <button
                onClick={handleBatchApprove}
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl shadow-lg transition cursor-pointer text-xs sm:text-sm"
              >
                <CheckCheck className="w-4 h-4" />
                <span>อนุมัติทั้งหมด ({filteredPending.length} รายการ)</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-xs text-emerald-200 uppercase font-semibold">รอการตรวจสอบ</p>
            <p className="text-2xl font-black font-sans text-amber-300 mt-1">{pendingSubmissions.length} รายการ</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-xs text-emerald-200 uppercase font-semibold">อนุมัติแล้วทั้งหมด</p>
            <p className="text-2xl font-black font-sans text-white mt-1">{approvedCount} รายการ</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-xs text-emerald-200 uppercase font-semibold">นักเรียนในที่ปรึกษา</p>
            <p className="text-2xl font-black font-sans text-white mt-1">{studentUsers.length} คน</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <p className="text-xs text-emerald-200 uppercase font-semibold">บันทึก Homeroom</p>
            <p className="text-2xl font-black font-sans text-white mt-1">{homeroomRecords.length} สัปดาห์</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 gap-2 shadow-sm">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>รายการรอตรวจสอบ ({pendingSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>สถานะนักเรียนรายบุคคล ({studentUsers.length} คน)</span>
        </button>

        <button
          onClick={() => setActiveTab('homeroom')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'homeroom'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>บันทึกกิจกรรม Homeroom ({homeroomRecords.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVAL QUEUE */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อนักเรียน หรือ กิจกรรม..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs text-slate-500 whitespace-nowrap">กรองห้อง:</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none text-slate-700"
              >
                <option value="ALL">ทุกห้องเรียน</option>
                <option value="ม.4/1">ม.4/1</option>
                <option value="ม.4/2">ม.4/2</option>
                <option value="ม.5/2">ม.5/2</option>
              </select>
            </div>
          </div>

          {/* List */}
          {filteredPending.length === 0 ? (
            <div className="text-center py-16 p-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-sm">ไม่มีรายการที่รอการตรวจสอบในขณะนี้</p>
              <p className="text-xs text-slate-400 mt-1">นักเรียนในห้องเรียนได้รับการตรวจสอบครบถ้วนแล้ว</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredPending.map(item => {
                const cat = categories.find(c => c.id === item.categoryId);

                return (
                  <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.studentName} ({item.studentGrade})
                        </span>
                        <span 
                          className="text-[10px] font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}
                        >
                          หมวดที่ {item.categoryId}: {cat?.name}
                        </span>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          ขอรับรอง {item.hours} ชั่วโมง
                        </span>
                      </div>

                      <h4 className="font-semibold text-slate-800 text-sm">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span>วันที่ทำกิจกรรม: {item.date}</span>
                        <span>•</span>
                        <span>สถานที่: {item.location}</span>
                        {item.evidenceFileName && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 underline flex items-center gap-1">
                              ไฟล์แนบ: {item.evidenceFileName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenReview(item, 'APPROVED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>อนุมัติ (Approve)</span>
                      </button>

                      <button
                        onClick={() => handleOpenReview(item, 'REJECTED')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>ส่งกลับแก้ไข</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLASS ROSTER MATRIX */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              ตารางสรุปผลการผ่านกิจกรรมนักเรียน ห้อง {classFilter}
            </h3>
            <span className="text-xs text-slate-500">
              เกณฑ์จบหลักสูตร: ต้องผ่านครบทั้ง 5 หมวด
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0B2559] text-white">
                <tr>
                  <th className="p-3">รหัสนักเรียน</th>
                  <th className="p-3">ชื่อ-นามสกุล</th>
                  <th className="p-3 text-center">หมวด 1 (20 ชม.)</th>
                  <th className="p-3 text-center">หมวด 2 (20 ชม.)</th>
                  <th className="p-3 text-center">หมวด 3 (20 ชม.)</th>
                  <th className="p-3 text-center">หมวด 4 (15 ชม.)</th>
                  <th className="p-3 text-center">หมวด 5 (25 ชม.)</th>
                  <th className="p-3 text-center">รวมชั่วโมง</th>
                  <th className="p-3 text-center">ผลการประเมิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentUsers.map(st => {
                  const stSubs = submissions.filter(s => s.studentId === st.id && s.status === 'APPROVED');
                  const h1 = stSubs.filter(s => s.categoryId === 1).reduce((sum, s) => sum + s.hours, 0);
                  const h2 = stSubs.filter(s => s.categoryId === 2).reduce((sum, s) => sum + s.hours, 0);
                  const h3 = stSubs.filter(s => s.categoryId === 3).reduce((sum, s) => sum + s.hours, 0);
                  const h4 = stSubs.filter(s => s.categoryId === 4).reduce((sum, s) => sum + s.hours, 0);
                  const h5 = stSubs.filter(s => s.categoryId === 5).reduce((sum, s) => sum + s.hours, 0);
                  const total = h1 + h2 + h3 + h4 + h5;
                  const isAllPassed = h1 >= 20 && h2 >= 20 && h3 >= 20 && h4 >= 15 && h5 >= 25;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-700">{st.username}</td>
                      <td className="p-3 font-semibold text-slate-900">{st.name}</td>
                      <td className={`p-3 text-center ${h1 >= 20 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>{h1}</td>
                      <td className={`p-3 text-center ${h2 >= 20 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>{h2}</td>
                      <td className={`p-3 text-center ${h3 >= 20 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>{h3}</td>
                      <td className={`p-3 text-center ${h4 >= 15 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>{h4}</td>
                      <td className={`p-3 text-center ${h5 >= 25 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>{h5}</td>
                      <td className="p-3 text-center font-bold font-sans text-blue-900 text-sm">{total}</td>
                      <td className="p-3 text-center">
                        {isAllPassed ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ผ่านเกณฑ์ (ผ)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            อยู่ระหว่างเก็บ ชม. (มผ)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HOMEROOM */}
      {activeTab === 'homeroom' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              บันทึกการจัดกิจกรรมโฮมรูม (Homeroom & Care)
            </h3>
            <button
              onClick={() => setShowHomeroomForm(!showHomeroomForm)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>บันทึก Homeroom สัปดาห์นี้</span>
            </button>
          </div>

          {showHomeroomForm && (
            <form onSubmit={handleCreateHomeroom} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-emerald-900 text-sm">กรอกบันทึก Homeroom ประจำสัปดาห์</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">วันที่จัดกิจกรรม:</label>
                  <input
                    type="date"
                    required
                    value={hrDate}
                    onChange={(e) => setHrDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">นักเรียนที่มา (คน):</label>
                  <input
                    type="number"
                    required
                    value={hrPresent}
                    onChange={(e) => setHrPresent(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">จำนวนนักเรียนทั้งหมด (คน):</label>
                  <input
                    type="number"
                    required
                    value={hrTotal}
                    onChange={(e) => setHrTotal(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">หัวข้อกิจกรรม Homeroom:</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น การเตรียมตัวโครงงานวิทยาศาสตร์ และการรักษาสุขอนามัยในหอพัก"
                  value={hrTopic}
                  onChange={(e) => setHrTopic(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">บันทึกผลการจัดกิจกรรมและข้อสังเกต:</label>
                <textarea
                  rows={2}
                  value={hrNotes}
                  onChange={(e) => setHrNotes(e.target.value)}
                  placeholder="นักเรียนทุกคนให้ความสนใจเป็นอย่างดี..."
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowHomeroomForm(false)}
                  className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800"
                >
                  บันทึกลงระบบ
                </button>
              </div>
            </form>
          )}

          {/* List of Homeroom Records */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeroomRecords.map(hr => (
              <div key={hr.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ชั้น {hr.grade}
                  </span>
                  <span className="text-slate-400">{hr.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{hr.topic}</h4>
                <p className="text-slate-600 leading-relaxed">{hr.notes}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
                  <span>ผู้บันทึก: {hr.advisorName}</span>
                  <span className="font-semibold text-emerald-700">
                    เข้าร่วม {hr.presentCount}/{hr.totalStudents} คน ({Math.round((hr.presentCount/hr.totalStudents)*100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {reviewDecision === 'APPROVED' ? 'ยืนยันการอนุมัติกิจกรรม' : 'ส่งกลับให้แก้ไขหลักฐาน'}
            </h3>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>นักเรียน:</strong> {reviewingItem.studentName} ({reviewingItem.studentGrade})</p>
              <p><strong>กิจกรรม:</strong> {reviewingItem.title}</p>
              <p><strong>ชั่วโมง:</strong> {reviewingItem.hours} ชั่วโมง</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ข้อเสนอแนะ / ความเห็นของครูผู้ตรวจ:
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setReviewingItem(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className={`px-5 py-2 text-white text-xs font-bold rounded-lg cursor-pointer ${
                  reviewDecision === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {reviewDecision === 'APPROVED' ? 'บันทึกการอนุมัติ' : 'ส่งข้อความแก้ไข'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
