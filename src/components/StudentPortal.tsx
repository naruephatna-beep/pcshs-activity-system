import React, { useState } from 'react';
import { 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Award, 
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { ActivityCategory, CategoryId, StudentSubmission, User } from '../types';

interface StudentPortalProps {
  currentUser: User;
  submissions: StudentSubmission[];
  categories: ActivityCategory[];
  onOpenNewSubmission: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  submissions,
  categories,
  onOpenNewSubmission
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | 'ALL'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [activeItemDetails, setActiveItemDetails] = useState<StudentSubmission | null>(null);

  // Filter submissions for current student
  const studentSubs = submissions.filter(s => s.studentId === currentUser.id);

  // Calculate hours per category
  const hoursByCategory = categories.map(cat => {
    const approvedHours = studentSubs
      .filter(s => s.categoryId === cat.id && s.status === 'APPROVED')
      .reduce((sum, s) => sum + s.hours, 0);

    const pendingHours = studentSubs
      .filter(s => s.categoryId === cat.id && s.status === 'PENDING')
      .reduce((sum, s) => sum + s.hours, 0);

    const isPassed = approvedHours >= cat.requiredHours;
    const progressPercent = Math.min(100, Math.round((approvedHours / cat.requiredHours) * 100));

    return {
      ...cat,
      approvedHours,
      pendingHours,
      isPassed,
      progressPercent
    };
  });

  const totalRequiredHours = categories.reduce((sum, c) => sum + c.requiredHours, 0);
  const totalApprovedHours = hoursByCategory.reduce((sum, c) => sum + c.approvedHours, 0);
  const totalPendingHours = hoursByCategory.reduce((sum, c) => sum + c.pendingHours, 0);
  const passedCategoriesCount = hoursByCategory.filter(c => c.isPassed).length;
  const overallProgress = Math.min(100, Math.round((totalApprovedHours / totalRequiredHours) * 100));

  // Filtered submissions list
  const filteredSubmissions = studentSubs.filter(sub => {
    const matchCat = selectedCategoryFilter === 'ALL' || sub.categoryId === selectedCategoryFilter;
    const matchStatus = selectedStatusFilter === 'ALL' || sub.status === selectedStatusFilter;
    return matchCat && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12 font-thai">
      
      {/* Student Welcome & Top Stats Banner */}
      <div className="bg-gradient-to-r from-[#0B2559] via-[#10337a] to-[#1e469a] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>รหัสนักเรียน {currentUser.username} • ชั้น {currentUser.grade || 'ม.4/1'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ยินดีต้อนรับ, {currentUser.name}
            </h2>
            <p className="text-blue-200 text-xs sm:text-sm max-w-xl">
              ครูที่ปรึกษา: <span className="text-white font-semibold">{currentUser.advisorName || 'อ.วรวุฒิ สิทธิโชค'}</span> | ติดตามและบันทึกกิจกรรมพัฒนาผู้เรียนให้ครบตามเกณฑ์ 5 หมวดเพื่อการจบหลักสูตร
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenNewSubmission}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0B2559] font-bold rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition cursor-pointer text-sm"
            >
              <PlusCircle className="w-5 h-5" />
              <span>บันทึกกิจกรรมใหม่</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-xs text-blue-200 uppercase font-semibold">ชั่วโมงสะสมที่อนุมัติแล้ว</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-sans text-amber-300">{totalApprovedHours}</span>
              <span className="text-xs text-blue-200">/ {totalRequiredHours} ชั่วโมง</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-xs text-blue-200 uppercase font-semibold">หมวดที่ผ่านเกณฑ์แล้ว</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-sans text-emerald-300">{passedCategoriesCount}</span>
              <span className="text-xs text-blue-200">/ 5 หมวดกิจกรรม</span>
            </div>
            <p className="text-[11px] text-blue-200 mt-3">
              {passedCategoriesCount === 5 ? '🎉 ครบทุกหมวดตามเกณฑ์แล้ว!' : `ยังขาดอีก ${5 - passedCategoriesCount} หมวด`}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <p className="text-xs text-blue-200 uppercase font-semibold">รายการที่รอครูตรวจสอบ</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-sans text-blue-100">{totalPendingHours}</span>
              <span className="text-xs text-blue-200">ชั่วโมง ({studentSubs.filter(s => s.status === 'PENDING').length} รายการ)</span>
            </div>
            <p className="text-[11px] text-blue-200 mt-3">
              ส่งแล้ว รอครูที่ปรึกษาตรวจหลักฐาน
            </p>
          </div>
        </div>
      </div>

      {/* 5 Categories Progress Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0B2559]" />
            <span>ความก้าวหน้าราย 5 หมวดกิจกรรมพัฒนาผู้เรียน</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            เกณฑ์รวมอย่างน้อย {totalRequiredHours} ชั่วโมง
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hoursByCategory.map(cat => (
            <div 
              key={cat.id}
              className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                cat.isPassed ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span 
                    className="text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    หมวดที่ {cat.id}
                  </span>
                  {cat.isPassed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" /> ผ่านเกณฑ์
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      ขาด {Math.max(0, cat.requiredHours - cat.approvedHours)} ชม.
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1 mb-1">
                  {cat.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {cat.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">
                    อนุมัติแล้ว: <strong className="text-slate-900">{cat.approvedHours}</strong> / {cat.requiredHours} ชม.
                  </span>
                  <span className="font-bold text-slate-700 font-sans">{cat.progressPercent}%</span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${cat.progressPercent}%`,
                      backgroundColor: cat.isPassed ? '#10b981' : cat.color 
                    }}
                  />
                </div>

                {cat.pendingHours > 0 && (
                  <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>รอตรวจสอบ +{cat.pendingHours} ชม.</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions History & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0B2559]" />
              <span>ประวัติการส่งกิจกรรมของฉัน ({filteredSubmissions.length} รายการ)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ติดตามสถานะการตรวจสอบ ข้อเสนอแนะจากคุณครู และรายละเอียดหลักฐาน
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-[#0B2559] outline-none"
            >
              <option value="ALL">ทุกหมวดกิจกรรม</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>หมวด {c.id}: {c.name.substring(0, 15)}...</option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:ring-2 focus:ring-[#0B2559] outline-none"
            >
              <option value="ALL">ทุกสถานะ</option>
              <option value="APPROVED">ผ่านการประเมิน (อนุมัติ)</option>
              <option value="PENDING">รอการตรวจสอบ</option>
              <option value="REJECTED">ส่งกลับแก้ไข</option>
            </select>
          </div>
        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 p-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-slate-600 font-bold text-sm">ยังไม่มีรายการกิจกรรมในหมวดหรือสถานะนี้</p>
            <p className="text-xs text-slate-400 mt-1">กดปุ่ม "บันทึกกิจกรรมใหม่" เพื่อเริ่มบันทึกชั่วโมงกิจกรรมของท่าน</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSubmissions.map(item => {
              const cat = categories.find(c => c.id === item.categoryId);

              return (
                <div 
                  key={item.id} 
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span 
                        className="text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${cat?.color}15`, color: cat?.color }}
                      >
                        หมวด {item.categoryId}: {cat?.name}
                      </span>

                      {item.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> อนุมัติแล้ว ({item.hours} ชม.)
                        </span>
                      )}
                      {item.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-amber-600" /> รอตรวจสอบ ({item.hours} ชม.)
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> ส่งกลับแก้ไข
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {item.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        วันที่ทำ: {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.location}
                      </span>
                    </div>

                    {item.reviewComment && (
                      <div className="mt-2 text-xs bg-emerald-50 text-emerald-900 p-2.5 rounded-lg border border-emerald-200">
                        <strong>ความเห็นครูผู้ตรวจ ({item.reviewedBy}):</strong> "{item.reviewComment}"
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => setActiveItemDetails(item)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-[#0B2559] hover:bg-blue-50 text-xs font-semibold text-[#0B2559] transition cursor-pointer flex items-center gap-1"
                    >
                      <span>ดูรายละเอียด</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      {activeItemDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">รายละเอียดกิจกรรม</h3>
              <button 
                onClick={() => setActiveItemDetails(null)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500">ชื่อกิจกรรม:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{activeItemDetails.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">หมวดกิจกรรม:</span>
                  <p className="font-semibold text-[#0B2559]">หมวดที่ {activeItemDetails.categoryId}</p>
                </div>
                <div>
                  <span className="text-slate-500">จำนวนชั่วโมง:</span>
                  <p className="font-bold text-amber-700">{activeItemDetails.hours} ชั่วโมง</p>
                </div>
                <div>
                  <span className="text-slate-500">วันที่ดำเนินกิจกรรม:</span>
                  <p className="font-semibold">{activeItemDetails.date}</p>
                </div>
                <div>
                  <span className="text-slate-500">สถานที่:</span>
                  <p className="font-semibold">{activeItemDetails.location}</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500">บันทึกสรุปผล / สิ่งที่ได้เรียนรู้:</span>
                <p className="bg-slate-50 p-3 rounded-xl mt-1 text-slate-700 leading-relaxed border border-slate-200">
                  {activeItemDetails.description || 'ไม่มีบันทึกเพิ่มเติม'}
                </p>
              </div>

              {activeItemDetails.evidenceUrl && (
                <div>
                  <span className="text-slate-500">รูปภาพหรือหลักฐานประกอบ:</span>
                  <div className="mt-1.5 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-56 flex items-center justify-center">
                    <img 
                      src={activeItemDetails.evidenceUrl} 
                      alt="หลักฐาน" 
                      className="w-full h-full object-cover max-h-56"
                    />
                  </div>
                </div>
              )}

              {activeItemDetails.reviewComment && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <span className="font-bold">ความเห็นครูผู้ตรวจ ({activeItemDetails.reviewedBy}):</span>
                  <p className="mt-0.5">{activeItemDetails.reviewComment}</p>
                  {activeItemDetails.reviewedAt && (
                    <span className="text-[10px] text-emerald-600 block mt-1">
                      ตรวจเมื่อ: {activeItemDetails.reviewedAt}
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveItemDetails(null)}
              className="w-full py-2.5 bg-slate-800 text-white rounded-xl text-xs font-bold font-thai hover:bg-slate-900 transition cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
