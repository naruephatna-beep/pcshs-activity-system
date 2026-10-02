import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileSpreadsheet, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Database,
  ArrowRight,
  Info,
  Code2,
  FileCode
} from 'lucide-react';
import { APPS_SCRIPT_CODE_GS, APPS_SCRIPT_INDEX_HTML } from '../services/appsScriptTemplate';
import { storageService } from '../services/storageService';
import { downloadProjectZip } from '../services/zipExporter';
import { AppSettings, StudentSubmission, User, HomeroomRecord } from '../types';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: StudentSubmission[];
  users: User[];
  homeroom: HomeroomRecord[];
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  submissions,
  users,
  homeroom,
  settings,
  onSaveSettings
}) => {
  const [copiedCodeGs, setCopiedCodeGs] = useState(false);
  const [copiedIndexHtml, setCopiedIndexHtml] = useState(false);
  const [appsScriptUrl, setAppsScriptUrl] = useState(settings.appsScriptDeploymentUrl || '');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'guide' | 'code_gs' | 'index_html' | 'export'>('guide');

  if (!isOpen) return null;

  const handleCopyCodeGs = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE_GS);
    setCopiedCodeGs(true);
    setTimeout(() => setCopiedCodeGs(false), 2500);
  };

  const handleCopyIndexHtml = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_INDEX_HTML);
    setCopiedIndexHtml(true);
    setTimeout(() => setCopiedIndexHtml(false), 2500);
  };

  const handleSaveUrl = () => {
    const updated: AppSettings = {
      ...settings,
      appsScriptDeploymentUrl: appsScriptUrl.trim(),
      lastSyncTime: new Date().toLocaleTimeString('th-TH')
    };
    onSaveSettings(updated);
    setTestResult('บันทึกการตั้งค่าเรียบร้อย! ระบบจะส่งข้อมูลไปยัง Google Apps Script อัตโนมัติเมื่อมีการบันทึกหรืออนุมัติกิจกรรม');
  };

  const handleExportAllCsv = () => {
    storageService.exportToCsv('PCSHS_Kalasin_Submissions_2567', submissions.map(s => ({
      รหัสบันทึก: s.id,
      รหัสนักเรียน: s.studentId,
      ชื่อนักเรียน: s.studentName,
      ชั้นห้อง: s.studentGrade,
      หมวดกิจกรรม: `หมวดที่ ${s.categoryId}`,
      ชื่อกิจกรรม: s.title,
      วันที่ทำกิจกรรม: s.date,
      จำนวนชั่วโมง: s.hours,
      สถานที่: s.location,
      รายละเอียด: s.description,
      สถานะ: s.status,
      ความเห็นครู: s.reviewComment || '',
      ผู้ตรวจ: s.reviewedBy || '',
      วันที่ตรวจ: s.reviewedAt || '',
      วันที่ส่ง: s.createdAt
    })));

    setTimeout(() => {
      storageService.exportToCsv('PCSHS_Kalasin_Students_List', users.map(u => ({
        รหัสประจำตัว: u.username,
        ชื่อนามสกุล: u.name,
        บทบาท: u.role,
        ชั้นห้อง: u.grade || '',
        เลขที่: u.studentNumber || '',
        อีเมล: u.email || '',
        ครูที่ปรึกษา: u.advisorName || '',
        เบอร์โทร: u.phone || ''
      })));
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-thai">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0B2559] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">โค้ดสำหรับใส่ Google Apps Script Web App</h3>
                <span className="bg-amber-400 text-[#0B2559] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  มี 2 ไฟล์: Code.gs และ Index.html
                </span>
              </div>
              <p className="text-xs text-blue-200">
                นำโค้ด 2 ไฟล์นี้ไปวางใน Apps Script เพื่อเปิดใช้งานเว็บแอปบน Google Sheets ของคุณครูได้ 100%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 font-semibold text-xs sm:text-sm border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-[#0B2559] text-[#0B2559]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            1. ขั้นตอนติดตั้งง่ายๆ
          </button>
          <button
            onClick={() => setActiveTab('code_gs')}
            className={`pb-3 px-3 font-semibold text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'code_gs'
                ? 'border-[#0B2559] text-[#0B2559]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>2. โค้ดไฟล์ที่ 1: Code.gs</span>
          </button>
          <button
            onClick={() => setActiveTab('index_html')}
            className={`pb-3 px-3 font-semibold text-xs sm:text-sm border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'index_html'
                ? 'border-[#0B2559] text-[#0B2559]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCode className="w-4 h-4 text-emerald-600" />
            <span>3. โค้ดไฟล์ที่ 2: Index.html (หน้าเว็บ)</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-3 font-semibold text-xs sm:text-sm border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'export'
                ? 'border-[#0B2559] text-[#0B2559]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            4. ดาวน์โหลด CSV / Excel
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {activeTab === 'guide' && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#0B2559] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-[#0B2559] text-sm">
                    วิธีติดตั้งใน Google Apps Script มีเพียง 2 ไฟล์เท่านั้น:
                  </p>
                  <p>
                    1. ไฟล์ <strong>Code.gs</strong> (สคริปต์เชื่อมต่อฐานข้อมูลในชีต)<br/>
                    2. ไฟล์ <strong>Index.html</strong> (หน้าเว็บที่มีระบบล็อกอิน นักเรียน ครู และแอดมิน)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0B2559] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">เปิด Google Sheets แผ่นใหม่</p>
                    <p className="text-slate-500">พิมพ์ <code className="bg-slate-200 px-1 py-0.5 rounded">sheets.new</code> ในเบราว์เซอร์ แล้วไปที่เมนู <strong>ส่วนขยาย (Extensions)</strong> &gt; <strong>Apps Script</strong></p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0B2559] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">วางโค้ดใน Code.gs</p>
                    <p className="text-slate-500">คลิกแท็บ <strong>"2. โค้ดไฟล์ที่ 1: Code.gs"</strong> ด้านบน กดปุ่มคัดลอก แล้วนำไปวางทับในไฟล์ Code.gs</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0B2559] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">สร้างไฟล์ Index.html</p>
                    <p className="text-slate-500">ในหน้า Apps Script มองทางซ้ายตรงคำว่า "ไฟล์" จะมีเครื่องหมาย <strong>+</strong> ให้กด <strong>+</strong> &gt; เลือก <strong>HTML</strong> &gt; ตั้งชื่อว่า <strong className="text-blue-800">Index</strong></p>
                    <p className="text-slate-500 mt-1">จากนั้นคลิกแท็บ <strong>"3. โค้ดไฟล์ที่ 2: Index.html"</strong> ในหน้าต่างนี้ กดปุ่มคัดลอก แล้วนำไปวางในไฟล์ Index.html</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0B2559] text-white flex items-center justify-center text-xs font-bold shrink-0">4</span>
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">กดบันทึก และ เผยแพร่ (Deploy)</p>
                    <p className="text-slate-500">กดบันทึก ➔ คลิกปุ่มสีน้ำเงิน <strong>ทำให้ใช้งานได้ (Deploy)</strong> มุมบนขวา ➔ <strong>การทำให้ใช้งานได้ใหม่ (New deployment)</strong> ➔ เลือกประเภทเป็น <strong>เว็บแอป (Web app)</strong> ➔ ผู้มีสิทธิ์เข้าถึงเลือก <strong>"ทุกคน" (Anyone)</strong> ➔ กดทำให้ใช้งานได้ แล้วรับลิงก์ไปส่งให้นักเรียนและคุณครูใช้ได้เลยครับ!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code_gs' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    ไฟล์ที่ 1: Code.gs (Server Script)
                  </h4>
                  <p className="text-xs text-slate-500">
                    นำไปวางในไฟล์ Code.gs เดิมใน Apps Script
                  </p>
                </div>
                <button
                  onClick={handleCopyCodeGs}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B2559] hover:bg-[#07173b] text-white text-xs font-bold transition cursor-pointer shadow-sm shrink-0"
                >
                  {copiedCodeGs ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCodeGs ? 'คัดลอก Code.gs เรียบร้อย!' : 'คัดลอก Code.gs (1 คลิก)'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono max-h-[380px] overflow-y-auto leading-relaxed border border-slate-700 selection:bg-amber-400 selection:text-slate-900">
                {APPS_SCRIPT_CODE_GS}
              </pre>
            </div>
          )}

          {activeTab === 'index_html' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    ไฟล์ที่ 2: Index.html (User Interface Web Page)
                  </h4>
                  <p className="text-xs text-slate-500">
                    กดเครื่องหมาย + ใน Apps Script ➔ เลือก HTML ➔ ตั้งชื่อว่า <code className="bg-slate-200 px-1 rounded font-bold">Index</code> ➔ วางโค้ดนี้
                  </p>
                </div>
                <button
                  onClick={handleCopyIndexHtml}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer shadow-sm shrink-0"
                >
                  {copiedIndexHtml ? <Check className="w-4 h-4 text-amber-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedIndexHtml ? 'คัดลอก Index.html เรียบร้อย!' : 'คัดลอก Index.html (1 คลิก)'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono max-h-[380px] overflow-y-auto leading-relaxed border border-slate-700 selection:bg-amber-400 selection:text-slate-900">
                {APPS_SCRIPT_INDEX_HTML}
              </pre>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              {/* Full Project ZIP Download for GitHub */}
              <div className="border border-blue-200 rounded-xl p-5 bg-blue-50/60 space-y-3">
                <h4 className="font-bold text-[#0B2559] text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#0B2559]" />
                  ดาวน์โหลดโค้ดโปรเจกต์ทั้งหมด (.ZIP สำหรับนำขึ้น GitHub)
                </h4>
                <p className="text-xs text-slate-600">
                  ดาวน์โหลดไฟล์ระบบทั้งหมดของเว็บนี้ (ไฟล์ React, Component, การตั้งค่า, README) ในรูปแบบไฟล์บีบอัด .ZIP เพื่อนำไปแตกไฟล์และอัปโหลดขึ้น GitHub Repository ของคุณครูได้ทันที
                </p>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await downloadProjectZip();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2559] hover:bg-[#07173b] text-white text-xs font-bold transition cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดไฟล์โปรเจกต์ .ZIP ทันที</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#0B2559]" />
                  ดาวน์โหลดฐานข้อมูลเป็นไฟล์ CSV (เปิดด้วย Excel ได้ทันที)
                </h4>
                <p className="text-xs text-slate-600">
                  ดาวน์โหลดข้อมูลนักเรียนและกิจกรรมที่มีอยู่ในระบบตอนนี้เป็นไฟล์ตารางสำหรับนำเข้า Google Sheets ด้วยตนเอง
                </p>

                <button
                  onClick={handleExportAllCsv}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดทั้ง 2 ตาราง (Submissions + Students)</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์ • Google Apps Script Web App
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
