import JSZip from 'jszip';
import { APPS_SCRIPT_CODE_GS, APPS_SCRIPT_INDEX_HTML } from './appsScriptTemplate';

export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();

  // 1. Google Apps Script Web App files
  const gasFolder = zip.folder('google-apps-script');
  if (gasFolder) {
    gasFolder.file('Code.gs', APPS_SCRIPT_CODE_GS);
    gasFolder.file('Index.html', APPS_SCRIPT_INDEX_HTML);
    gasFolder.file('README-AppsScript.md', `# คู่มือการใช้งาน Google Apps Script Web App

1. ไปที่ Google Sheets สร้างแผ่นงานใหม่ (หรือเปิด https://sheets.new)
2. ไปที่เมนู "ส่วนขยาย" (Extensions) > "Apps Script"
3. คัดลอกโค้ดจาก Code.gs ไปวางแทนที่ในไฟล์ Code.gs
4. กดเครื่องหมาย + ข้างเมนูไฟล์ เลือก "HTML" ตั้งชื่อว่า "Index"
5. คัดลอกโค้ดจาก Index.html ไปวางในไฟล์ Index
6. กดปุ่มบันทึก (รูปแผ่นดิสก์)
7. กดปุ่ม "ทำให้ใช้งานได้" (Deploy) > "การทำให้ใช้งานได้ใหม่" (New deployment)
8. เลือกประเภทเป็น "เว็บแอป" (Web app)
9. ในช่อง "ผู้มีสิทธิ์เข้าถึง" (Who has access) ให้เลือก "ทุกคน" (Anyone)
10. กด "ทำให้ใช้งานได้" แล้วคัดลอก Web App URL เพื่อส่งให้นักเรียนและคุณครูเข้าใช้งาน
`);
  }

  // 2. Readme instructions
  zip.file('README.md', `# ระบบกิจกรรมพัฒนาผู้เรียน โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์
Princess Chulabhorn Science High School Kalasin - Learner Development Activity System

ระบบบันทึก ตรวจสอบ และประเมินผลกิจกรรมพัฒนาผู้เรียน 5 หมวด พร้อมฐานข้อมูลและระบบเชื่อมต่อ Google Sheets / Google Apps Script

## โครงสร้างโปรเจกต์
- \`google-apps-script/\`: ไฟล์ Code.gs และ Index.html สำหรับนำไปติดตั้งบน Google Sheets Web App ทันที
- ใช้งานได้ทั้งแบบ Standalone Web App และเชื่อมต่อ Google Sheets
`);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pcshs-activity-system.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
