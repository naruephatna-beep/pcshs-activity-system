import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  BookOpen, 
  Activity, 
  HeartHandshake, 
  Award, 
  FlaskConical 
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { CategoryId, StudentSubmission, User } from '../types';

interface NewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSubmit: (data: Omit<StudentSubmission, 'id' | 'createdAt'>) => void;
}

const TEMPLATES: Record<CategoryId, { title: string; hours: number; location: string; description: string }> = {
  1: {
    title: 'บันทึกการอ่านหนังสือวิทยาศาสตร์และการพัฒนาตนเอง',
    hours: 4,
    location: 'หอพักนักเรียน / ศูนย์วิทยบริการ PCSHS Kalasin',
    description: 'อ่านหนังสือเพื่อพัฒนาองค์ความรู้ทางวิทยาศาสตร์ สรุปแนวคิดหลัก และนำมาประยุกต์ใช้ในการวางแผนการเรียน'
  },
  2: {
    title: 'บันทึกการออกกำลังกายและเสริมสร้างสุขภาวะหอพักประจำ',
    hours: 3,
    location: 'สนามกีฬา / ลู่วิ่ง PCSHS Kalasin',
    description: 'วิ่งออกกำลังกายและเล่นกีฬาเพื่อเสริมสร้างความพร้อมของร่างกายตามเกณฑ์คุณลักษณะอันพึงประสงค์'
  },
  3: {
    title: 'กิจกรรมจิตอาสาบำเพ็ญประโยชน์เพื่อโรงเรียนและชุมชน',
    hours: 5,
    location: 'บริเวณโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์',
    description: 'ร่วมกิจกรรมบำเพ็ญประโยชน์ ทำความสะอาด จัดระเบียบห้องปฏิบัติการ และช่วยเหลือสาธารณกุศล'
  },
  4: {
    title: 'การมีส่วนร่วมในกิจกรรมส่งเสริมประชาธิปไตยและประเพณีไทย',
    hours: 3,
    location: 'หอประชุมราชพฤกษ์ PCSHS Kalasin',
    description: 'เข้าร่วมกิจกรรมประชาธิปไตยในโรงเรียน และร่วมสืบสานประเพณีวัฒนธรรมอันดีงาม'
  },
  5: {
    title: 'การพัฒนาโครงงานวิทยาศาสตร์และนวัตกรรมเพื่อความยั่งยืน',
    hours: 10,
    location: 'ห้องปฏิบัติการวิทยาศาสตร์ PCSHS Kalasin',
    description: 'ทำการทดลองทางวิทยาศาสตร์ เก็บข้อมูลเชิงประจักษ์ และจัดทำรายงานโครงงานวิทยาศาสตร์ฉบับสมบูรณ์'
  }
};

export const NewSubmissionModal: React.FC<NewSubmissionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmit
}) => {
  const [categoryId, setCategoryId] = useState<CategoryId>(1);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [hours, setHours] = useState(3);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceFileName, setEvidenceFileName] = useState('evidence_photo.jpg');
  const [evidenceUrl, setEvidenceUrl] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyTemplate = (catId: CategoryId) => {
    setCategoryId(catId);
    const tmpl = TEMPLATES[catId];
    setTitle(tmpl.title);
    setHours(tmpl.hours);
    setLocation(tmpl.location);
    setDescription(tmpl.description);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setEvidenceUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentGrade: currentUser.grade || 'ม.4/1',
      categoryId,
      title: title.trim(),
      date,
      hours: Number(hours) || 1,
      location: location.trim() || 'โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์',
      description: description.trim(),
      evidenceFileName,
      evidenceUrl: evidenceUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      status: 'PENDING'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0B2559] p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold font-thai">บันทึกกิจกรรมพัฒนาผู้เรียนใหม่</h3>
            <p className="text-xs text-blue-200 font-thai">
              ส่งหลักฐานเพื่อขอรับการประเมินชั่วโมงกิจกรรมตามเกณฑ์มาตรฐาน PCSHS
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 font-thai">
          
          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>หรือเลือกกรอกด่วนตามแม่แบบ (Quick Presets):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleApplyTemplate(1)}
                className="p-2 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-800 text-left transition"
              >
                📖 อ่านหนังสือ
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate(2)}
                className="p-2 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-left transition"
              >
                🏃‍♂️ ออกกำลังกาย
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate(3)}
                className="p-2 rounded-lg border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-800 text-left transition"
              >
                🤝 บำเพ็ญประโยชน์
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate(4)}
                className="p-2 rounded-lg border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-800 text-left transition"
              >
                🇹🇭 ประชาธิปไตย
              </button>
              <button
                type="button"
                onClick={() => handleApplyTemplate(5)}
                className="p-2 rounded-lg border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-800 text-left transition col-span-2 sm:col-span-1"
              >
                🔬 โครงงานวิทย์
              </button>
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              เลือกหมวดกิจกรรม (1 ใน 5 หมวด) *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value) as CategoryId)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2559] outline-none"
            >
              {INITIAL_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  หมวดที่ {cat.id}: {cat.name} (เกณฑ์ {cat.requiredHours} ชม.)
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              ชื่อกิจกรรม / หัวข้อที่ทำ *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น บันทึกการอ่านหนังสือประวัติศาสตร์ดาราศาสตร์ หรือ วิ่งรอบสนามกีฬา"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2559] outline-none"
            />
          </div>

          {/* Date and Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                วันที่ทำกิจกรรม *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2559] outline-none"
              >
              </input>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                จำนวนชั่วโมงที่ทำ (ชั่วโมง) *
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                max="50"
                required
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2559] outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              สถานที่ดำเนินกิจกรรม
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="เช่น หอพักนักเรียน, ศูนย์วิทยบริการและไอที, ชุมชนกาฬสินธุ์"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2559] outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              สรุปสิ่งที่ได้เรียนรู้ / ผลการดำเนินงาน
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุสิ่งที่ได้ปฏิบัติ ข้อคิด หรือผลลัพธ์ที่เกิดขึ้นจากการทำกิจกรรม..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-[#0B2559] outline-none"
            />
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              แนบรูปภาพหรือไฟล์หลักฐาน (ภาพถ่าย / เกียรติบัตร / สรุปงาน)
            </label>
            
            <div className="border-2 border-dashed border-slate-300 hover:border-[#0B2559] rounded-xl p-4 text-center bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-1.5">
                <Upload className="w-8 h-8 text-[#0B2559]/70" />
                <p className="text-xs font-semibold text-slate-700">
                  {evidenceFileName ? `เลือกไฟล์: ${evidenceFileName}` : 'คลิกเพื่อเลือกรูปภาพหลักฐาน หรือ ลากไฟล์มาวาง'}
                </p>
                <p className="text-[11px] text-slate-400">
                  รองรับ JPG, PNG หรือ PDF (ขนาดไม่เกิน 10MB)
                </p>
              </div>
            </div>

            {previewImage && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-slate-100 rounded-xl">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-slate-300"
                />
                <span className="text-xs text-slate-600 truncate">{evidenceFileName}</span>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0B2559] hover:bg-[#07173b] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>ส่งข้อมูลเพื่อรอครูอนุมัติ</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
