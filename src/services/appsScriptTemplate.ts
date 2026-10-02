/**
 * โค้ด Google Apps Script สำเร็จรูป สำหรับนำไปรันเป็น Web App บน Google Sheets
 * 1. Code.gs (ไฟล์สคริปต์เซิร์ฟเวอร์)
 * 2. Index.html (ไฟล์หน้าเว็บหน้าบ้าน)
 */

export const APPS_SCRIPT_CODE_GS = `/**
 * =======================================================================
 * ระบบกิจกรรมพัฒนาผู้เรียน - PCSHS Kalasin
 * ไฟล์: Code.gs (สำหรับวางใน Google Apps Script)
 * โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์
 * =======================================================================
 */

// 1. ฟังก์ชันแสดงหน้าเว็บเมื่อผู้ใช้เปิดลิงก์ Web App
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('ระบบกิจกรรมพัฒนาผู้เรียน | โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 2. ฟังก์ชันสร้างตารางฐานข้อมูลและหัวคอลัมน์อัตโนมัติ 4 ชีต
function setupDatabaseSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const sheetDefinitions = [
    {
      name: "Submissions",
      headers: ["ID", "StudentID", "StudentName", "Grade", "CategoryID", "ActivityTitle", "Date", "Hours", "Location", "Description", "EvidenceURL", "Status", "ReviewComment", "ReviewedBy", "ReviewedAt", "CreatedAt"],
      initialRows: [
        ["sub-001", "std67101", "นายกิตติธัช วงศ์วิทยา", "ม.4/1", 1, "บันทึกการอ่านหนังสือ: Brief Answers to the Big Questions", "2026-09-12", 6, "หอพักนักเรียน 1", "อ่านและสรุปประเด็นฟิสิกส์ดาราศาสตร์", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", "APPROVED", "สรุปประเด็นได้น่าสนใจมาก มีความเชื่อมโยงกับวิชาฟิสิกส์ดีเยี่ยม", "อ.วรวุฒิ สิทธิโชค", "2026-09-14 10:30", "2026-09-12 19:40"],
        ["sub-002", "std67101", "นายกิตติธัช วงศ์วิทยา", "ม.4/1", 2, "บันทึกการออกกำลังกายสม่ำเสมอ: วิ่งรอบสนามกีฬา", "2026-09-18", 8, "สนามกีฬา PCSHS Kalasin", "วิ่งออกกำลังกายเพื่อสุขภาพร่วมกับเพื่อนหอพัก", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b", "APPROVED", "ยอดเยี่ยม รักษาสุขภาพให้แข็งแรง", "อ.วรวุฒิ สิทธิโชค", "2026-09-20 14:15", "2026-09-18 18:20"],
        ["sub-003", "std67101", "นายกิตติธัช วงศ์วิทยา", "ม.4/1", 3, "จิตอาสาจัดหมวดหมู่หนังสือศูนย์วิทยบริการ", "2026-09-22", 10, "ศูนย์วิทยบริการและไอที", "ช่วยงานบรรณารักษ์และแนะนำน้อง ม.1", "https://images.unsplash.com/photo-1521587760476-6c12a4b040da", "APPROVED", "จิตสาธารณะดีมาก", "อ.วรวุฒิ สิทธิโชค", "2026-09-24 09:00", "2026-09-22 16:45"],
        ["sub-004", "std67101", "นายกิตติธัช วงศ์วิทยา", "ม.4/1", 5, "โครงงานเครื่องตรวจคุณภาพน้ำ IoT", "2026-09-28", 25, "ห้องปฏิบัติการวิทย์", "พัฒนาระบบวัดค่า pH และ DO แบบ IoT", "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b", "APPROVED", "โครงงานมีความคิดสร้างสรรค์ยอดเยี่ยม", "อ.วรวุฒิ สิทธิโชค", "2026-09-29 16:00", "2026-09-28 20:10"],
        ["sub-005", "std67101", "นายกิตติธัช วงศ์วิทยา", "ม.4/1", 4, "กิจกรรมเลือกตั้งสภานักเรียน ปีการศึกษา 2567", "2026-10-01", 5, "หอประชุมราชพฤกษ์", "ร่วมกิจกรรมประชาธิปไตยในโรงเรียน", "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c", "PENDING", "", "", "", "2026-10-01 08:30"]
      ]
    },
    {
      name: "Students",
      headers: ["StudentID", "Username", "FullName", "Grade", "RoomNumber", "Email", "AdvisorName", "Phone", "Role"],
      initialRows: [
        ["u-std-1", "std67101", "นายกิตติธัช วงศ์วิทยา", "ม.4/1", "01", "kittithat.w@pcshsksn.ac.th", "ครูวรวุฒิ สิทธิโชค", "081-234-5678", "STUDENT"],
        ["u-std-2", "std67102", "นางสาวพิมพ์ชนก รัตนโกสินทร์", "ม.4/1", "02", "pimchanok.r@pcshsksn.ac.th", "ครูวรวุฒิ สิทธิโชค", "089-876-5432", "STUDENT"],
        ["u-std-3", "std67103", "นายธนกฤต ปัญญานิวัฒน์", "ม.5/2", "05", "thanakrit.p@pcshsksn.ac.th", "ครูชิดชนก ศรีสงคราม", "086-555-1234", "STUDENT"],
        ["u-tch-1", "tch.worawoot", "อ.วรวุฒิ สิทธิโชค", "ม.4/1", "-", "worawoot.s@pcshsksn.ac.th", "-", "081-999-4433", "TEACHER"],
        ["u-adm-1", "admin.activity", "ฝ่ายงานกิจกรรมพัฒนาผู้เรียน", "ส่วนกลาง", "-", "activity.admin@pcshsksn.ac.th", "-", "043-811-000", "ADMIN"]
      ]
    },
    {
      name: "Categories",
      headers: ["CategoryID", "CategoryName", "RequiredHours", "Description"],
      initialRows: [
        [1, "กิจกรรมแนะแนว & พัฒนาตนเอง", 20, "กิจกรรมวางแผนการเรียน การค้นพบตนเอง และบันทึกการอ่านหนังสือพัฒนาตนเอง"],
        [2, "คุณลักษณะอันพึงประสงค์ & วินัย", 20, "วินัยหอพักประจำโรงเรียนวิทยาศาสตร์ คุณธรรม จริยธรรม และการออกกำลังกาย"],
        [3, "กิจกรรมเพื่อสังคม & สาธารณประโยชน์", 20, "จิตอาสา บำเพ็ญประโยชน์ต่อชุมชน และการดูแลสิ่งแวดล้อม"],
        [4, "ความเป็นไทย & ประชาธิปไตย", 15, "กิจกรรมสภานักเรียน วัฒนธรรมไทย และวันสำคัญของชาติ"],
        [5, "โครงงานวิทยาศาสตร์ นวัตกรรม และกิจกรรมส่งเสริมความเป็นเลิศ", 25, "โครงงานวิจัย สิ่งประดิษฐ์ ค่ายโอลิมปิกวิชาการ สอวน."]
      ]
    },
    {
      name: "Homeroom",
      headers: ["RecordID", "Date", "Grade", "Topic", "AdvisorName", "TotalStudents", "PresentCount", "Notes"],
      initialRows: [
        ["hr-1", "2026-09-25", "ม.4/1", "การวางแผนการศึกษาและการเตรียมโครงงานวิทย์", "อ.วรวุฒิ สิทธิโชค", 24, 24, "นักเรียนส่งหัวข้อโครงงานครบถ้วน"],
        ["hr-2", "2026-09-18", "ม.4/1", "ระเบียบหอพัก และสุขภาพจิตในการเรียน", "อ.วรวุฒิ สิทธิโชค", 24, 23, "นักเรียนลาป่วย 1 คน"]
      ]
    }
  ];

  sheetDefinitions.forEach(def => {
    let sheet = ss.getSheetByName(def.name);
    if (!sheet) {
      sheet = ss.insertSheet(def.name);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(def.headers);
      const headerRange = sheet.getRange(1, 1, 1, def.headers.length);
      headerRange.setBackground("#0B2559")
                 .setFontColor("#FFFFFF")
                 .setFontWeight("bold")
                 .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);

      if (def.initialRows && def.initialRows.length > 0) {
        def.initialRows.forEach(row => sheet.appendRow(row));
      }
    }
  });

  return "สร้างตารางฐานข้อมูล 4 ชีตพร้อมข้อมูลเริ่มต้นเรียบร้อยแล้ว!";
}

// 3. ฟังก์ชันดึงข้อมูลทั้งหมดส่งให้หน้าเว็บ (เรียกจาก google.script.run)
function getAppData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupDatabaseSheets(); // ตรวจสอบและสร้างชีตอัตโนมัติหากยังไม่มี

  return {
    submissions: getSheetDataAsJson(ss.getSheetByName("Submissions")),
    students: getSheetDataAsJson(ss.getSheetByName("Students")),
    categories: getSheetDataAsJson(ss.getSheetByName("Categories")),
    homeroom: getSheetDataAsJson(ss.getSheetByName("Homeroom"))
  };
}

// 4. ฟังก์ชันบันทึกกิจกรรมใหม่ลง Google Sheet
function apiSaveSubmission(sub) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Submissions");
  if (!sheet) {
    setupDatabaseSheets();
    sheet = ss.getSheetByName("Submissions");
  }

  const id = "sub-" + new Date().getTime();
  sheet.appendRow([
    id,
    sub.studentId,
    sub.studentName,
    sub.studentGrade,
    Number(sub.categoryId),
    sub.title,
    sub.date,
    Number(sub.hours),
    sub.location || "",
    sub.description || "",
    sub.evidenceUrl || "",
    "PENDING",
    "",
    "",
    "",
    new Date().toLocaleString("th-TH")
  ]);

  return { status: "success", id: id, message: "บันทึกกิจกรรมลง Google Sheet สำเร็จ!" };
}

// 5. ฟังก์ชันอัปเดตสถานะการอนุมัติกิจกรรม
function apiUpdateStatus(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Submissions");
  if (!sheet) return { status: "error", message: "ไม่พบชีต Submissions" };

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(payload.id)) {
      sheet.getRange(i + 1, 12).setValue(payload.status);
      sheet.getRange(i + 1, 13).setValue(payload.reviewComment || "");
      sheet.getRange(i + 1, 14).setValue(payload.reviewedBy || "ครูที่ปรึกษา");
      sheet.getRange(i + 1, 15).setValue(new Date().toLocaleString("th-TH"));
      return { status: "success", message: "อัปเดตสถานะในชีตเรียบร้อย" };
    }
  }
  return { status: "not_found", message: "ไม่พบรหัสกิจกรรม" };
}

// ฟังก์ชันแปลงแถวในชีตเป็น JSON Array
function getSheetDataAsJson(sheet) {
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const results = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    results.push(obj);
  }
  return results;
}
`;

export const APPS_SCRIPT_INDEX_HTML = `<!DOCTYPE html>
<html lang="th" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ระบบกิจกรรมพัฒนาผู้เรียน | โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์</title>
  <!-- Google Fonts: Plus Jakarta Sans & Sarabun -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', 'Sarabun', sans-serif; }
    .font-thai { font-family: 'Sarabun', sans-serif; }
    .bg-grid { background-size: 32px 32px; background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px); }
  </style>
</head>
<body class="h-full bg-slate-50 text-slate-800 antialiased font-thai">

  <div id="app" class="min-h-full flex flex-col justify-between">
    <!-- ส่วนแสดงผลจะถูกสร้างด้วย JavaScript ด้านล่าง -->
  </div>

  <script>
    // ข้อมูลเริ่มต้นสำหรับแสดงผลทันทีระหว่างรอเชื่อมต่อชีต
    const DEFAULT_DATA = {
      categories: [
        { id: 1, name: "กิจกรรมแนะแนว & พัฒนาตนเอง", requiredHours: 20, color: "#2563eb" },
        { id: 2, name: "คุณลักษณะอันพึงประสงค์ & วินัย", requiredHours: 20, color: "#059669" },
        { id: 3, name: "กิจกรรมเพื่อสังคม & สาธารณประโยชน์", requiredHours: 20, color: "#d97706" },
        { id: 4, name: "ความเป็นไทย & ประชาธิปไตย", requiredHours: 15, color: "#7c3aed" },
        { id: 5, name: "โครงงานวิทยาศาสตร์ นวัตกรรม และกิจกรรมส่งเสริมความเป็นเลิศ", requiredHours: 25, color: "#e11d48" }
      ],
      students: [
        { id: "u-std-1", username: "std67101", name: "นายกิตติธัช วงศ์วิทยา", grade: "ม.4/1", role: "STUDENT", advisorName: "ครูวรวุฒิ สิทธิโชค" },
        { id: "u-tch-1", username: "tch.worawoot", name: "อ.วรวุฒิ สิทธิโชค", grade: "ม.4/1", role: "TEACHER" },
        { id: "u-adm-1", username: "admin.activity", name: "ผู้ดูแลระบบกิจกรรม", grade: "ส่วนกลาง", role: "ADMIN" }
      ],
      submissions: [
        { id: "sub-001", studentId: "u-std-1", studentName: "นายกิตติธัช วงศ์วิทยา", studentGrade: "ม.4/1", categoryId: 1, title: "บันทึกการอ่านหนังสือ: Stephen Hawking", date: "2026-09-12", hours: 6, status: "APPROVED", reviewedBy: "อ.วรวุฒิ สิทธิโชค", reviewComment: "สรุปได้ดีเยี่ยม" },
        { id: "sub-002", studentId: "u-std-1", studentName: "นายกิตติธัช วงศ์วิทยา", studentGrade: "ม.4/1", categoryId: 2, title: "ออกกำลังกายและวิ่งรอบสนามกีฬา", date: "2026-09-18", hours: 8, status: "APPROVED", reviewedBy: "อ.วรวุฒิ สิทธิโชค" },
        { id: "sub-003", studentId: "u-std-1", studentName: "นายกิตติธัช วงศ์วิทยา", studentGrade: "ม.4/1", categoryId: 3, title: "จิตอาสาจัดห้องสมุดศูนย์วิทยบริการ", date: "2026-09-22", hours: 10, status: "APPROVED", reviewedBy: "อ.วรวุฒิ สิทธิโชค" },
        { id: "sub-004", studentId: "u-std-1", studentName: "นายกิตติธัช วงศ์วิทยา", studentGrade: "ม.4/1", categoryId: 5, title: "โครงงานเครื่องตรวจคุณภาพน้ำ IoT", date: "2026-09-28", hours: 25, status: "APPROVED", reviewedBy: "อ.วรวุฒิ สิทธิโชค" },
        { id: "sub-005", studentId: "u-std-1", studentName: "นายกิตติธัช วงศ์วิทยา", studentGrade: "ม.4/1", categoryId: 4, title: "การเลือกตั้งสภานักเรียน ปี 2567", date: "2026-10-01", hours: 5, status: "PENDING" }
      ]
    };

    let state = {
      currentUser: null,
      data: DEFAULT_DATA,
      activeTab: 'overview'
    };

    // โหลดข้อมูลจริงจาก Google Sheets ผ่าน google.script.run
    function loadDataFromSheets() {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler((res) => {
            if (res && res.submissions && res.submissions.length > 0) {
              state.data.submissions = res.submissions;
              if (res.students && res.students.length > 0) state.data.students = res.students;
              render();
            }
          })
          .getAppData();
      }
    }

    // แสดงหน้าจอหลัก
    function render() {
      const app = document.getElementById('app');
      if (!state.currentUser) {
        renderLogin(app);
      } else {
        renderDashboard(app);
      }
      if (window.lucide) lucide.createIcons();
    }

    // หน้าล็อกอิน (ตรงตามรูปภาพ)
    function renderLogin(container) {
      container.innerHTML = \`
        <div class="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
          <!-- ฝั่งซ้าย สีน้ำเงินจุฬาภรณ์ -->
          <div class="lg:w-1/2 bg-[#0B2559] p-8 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>
            <div class="relative z-10 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-blue-200">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ระบบออนไลน์ประจำปีการศึกษา 2567 (ภาคเรียนที่ 2)</span>
              </div>
              <div class="flex items-center gap-4">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV1e06w-4_epnFiZEkwMnAdpIPfxtJScJ5h-MHx0645rC9K4iron9At5wZtFOSDhqfTHzHiT5QdAbkINM5O-uejyQWUqgw_Lxdm7kJm76aZCIzsB811f_Ka_3xTrtLuOxWnkTfDPogdEycCRbVA1vqmGfslYtaYTlC0HZosBdbJwqtAFv3DcOoZDsh4ydrfypdXtzxFr9u0UWkG6gr4DR9ZnnBYIu6VUWbwXUfkZcHrpQ5O_v5u3pU3Dw92Gza0mt3h5o" class="h-20 w-auto object-contain">
                <div>
                  <h1 class="text-xl sm:text-2xl font-bold">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์</h1>
                  <p class="text-xs text-slate-300 tracking-wider uppercase">Princess Chulabhorn Science High School Kalasin</p>
                </div>
              </div>
              <div class="pt-2 border-t border-white/10">
                <h2 class="text-2xl sm:text-3xl font-black">ระบบกิจกรรมพัฒนาผู้เรียน</h2>
                <p class="text-amber-400 font-semibold text-lg">Learner Development Activity System</p>
                <p class="text-slate-300 text-xs sm:text-sm mt-1">แพลตฟอร์มบันทึก ตรวจสอบ และประเมินผลกิจกรรมตามเกณฑ์มาตรฐานโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย</p>
              </div>
            </div>

            <!-- 5 หมวด -->
            <div class="relative z-10 my-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-lg bg-white/5 border border-white/10">1. กิจกรรมแนะแนว & พัฒนาตนเอง (20 ชม.)</div>
              <div class="p-2.5 rounded-lg bg-white/5 border border-white/10">2. คุณลักษณะอันพึงประสงค์ & วินัย (20 ชม.)</div>
              <div class="p-2.5 rounded-lg bg-white/5 border border-white/10">3. กิจกรรมเพื่อสังคม & สาธารณประโยชน์ (20 ชม.)</div>
              <div class="p-2.5 rounded-lg bg-white/5 border border-white/10">4. ความเป็นไทย & ประชาธิปไตย (15 ชม.)</div>
              <div class="sm:col-span-2 p-2.5 rounded-lg bg-white/5 border border-white/10">5. โครงงานวิทยาศาสตร์ นวัตกรรม และกิจกรรมส่งเสริมความเป็นเลิศ (25 ชม.)</div>
            </div>

            <div class="relative z-10 text-xs text-slate-400 flex justify-between border-t border-white/10 pt-4">
              <span>🛡️ เชื่อมต่อ Google Sheets โดยตรง</span>
              <span>ศูนย์วิทยบริการและไอที PCSHS-KL</span>
            </div>
          </div>

          <!-- ฝั่งขวา ฟอร์มล็อกอิน -->
          <div class="lg:w-1/2 p-6 sm:p-12 flex flex-col justify-between">
            <div class="max-w-md w-full mx-auto my-auto space-y-6">
              <div>
                <span class="px-2.5 py-1 rounded bg-blue-50 text-blue-900 text-xs font-bold border border-blue-100">Unified Role Gateway</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">เข้าสู่ระบบงานกิจกรรม</h2>
                <p class="text-xs text-slate-500 mt-1">กรุณาเลือกรหัสผ่าน หรือกดปุ่มทดลองตามบทบาทด้านล่าง</p>
              </div>

              <form onsubmit="handleLoginSubmit(event)" class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">รหัสผู้ใช้งาน (Student / Staff ID)</label>
                  <input id="loginId" type="text" required placeholder="เช่น std67101 หรือ tch.worawoot" class="w-full px-4 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-[#0B2559]">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">รหัสผ่าน (Password)</label>
                  <input type="password" value="••••••••••••" class="w-full px-4 py-2.5 text-sm border rounded-xl outline-none">
                </div>
                <button type="submit" class="w-full py-3 bg-[#0B2559] hover:bg-blue-950 text-white font-bold rounded-xl shadow-lg cursor-pointer">
                  เข้าสู่ระบบ (Sign In) ➔
                </button>
              </form>

              <!-- Quick Access Demo -->
              <div class="pt-4 border-t border-slate-200">
                <p class="text-xs font-bold text-slate-600 mb-2">ทดลองเข้าใช้งานด่วน (คลิกเลือกได้ทันที):</p>
                <div class="grid grid-cols-3 gap-2">
                  <button onclick="loginAs('std67101')" class="p-2 text-left bg-white border border-slate-200 hover:border-blue-400 rounded-xl shadow-sm cursor-pointer">
                    <span class="text-base">🎓</span>
                    <p class="font-bold text-xs">นักเรียน</p>
                    <p class="text-[10px] text-slate-400">เช็คชั่วโมง/ส่งงาน</p>
                  </button>
                  <button onclick="loginAs('tch.worawoot')" class="p-2 text-left bg-white border border-slate-200 hover:border-emerald-400 rounded-xl shadow-sm cursor-pointer">
                    <span class="text-base">👨‍🏫</span>
                    <p class="font-bold text-xs">ครูที่ปรึกษา</p>
                    <p class="text-[10px] text-slate-400">ตรวจ/อนุมัติกิจกรรม</p>
                  </button>
                  <button onclick="loginAs('admin.activity')" class="p-2 text-left bg-white border border-slate-200 hover:border-purple-400 rounded-xl shadow-sm cursor-pointer">
                    <span class="text-base">🛡️</span>
                    <p class="font-bold text-xs">ผู้ดูแลระบบ</p>
                    <p class="text-[10px] text-slate-400">ดูชีต/ออก ปพ.5</p>
                  </button>
                </div>
              </div>
            </div>
            
            <footer class="text-center text-xs text-slate-400 pt-6">
              © 2567 โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์
            </footer>
          </div>
        </div>
      \`;
    }

    // หน้าแดชบอร์ดหลักตามสิทธิ์
    function renderDashboard(container) {
      const u = state.currentUser;
      const subs = state.data.submissions;
      const mySubs = u.role === 'STUDENT' ? subs.filter(s => s.studentId === u.id || s.studentName === u.name) : subs;
      const approvedHours = mySubs.filter(s => s.status === 'APPROVED').reduce((sum, s) => sum + Number(s.hours || 0), 0);

      container.innerHTML = \`
        <!-- แถบเมนูด้านบน -->
        <header class="bg-[#0B2559] text-white p-4 shadow-md sticky top-0 z-30">
          <div class="max-w-6xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-xl">🏛️</span>
              <div>
                <h3 class="font-bold text-sm sm:text-base">โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์</h3>
                <p class="text-xs text-blue-200">ระบบกิจกรรมพัฒนาผู้เรียน (Google Apps Script Web App)</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right text-xs hidden sm:block">
                <p class="font-bold">\${u.name}</p>
                <p class="text-blue-200">\${u.role === 'STUDENT' ? 'นักเรียน ' + (u.grade || '') : u.role === 'TEACHER' ? 'ครูที่ปรึกษา' : 'ผู้ดูแลระบบ'}</p>
              </div>
              <button onclick="logout()" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer">
                ออกจากระบบ
              </button>
            </div>
          </div>
        </header>

        <!-- เนื้อหาแดชบอร์ด -->
        <main class="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
          <!-- แบนเนอร์ยินดีต้อนรับ -->
          <div class="bg-gradient-to-r from-[#0B2559] to-blue-800 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span class="text-xs px-2.5 py-1 rounded-full bg-white/20">สถานะ: \${u.role}</span>
              <h2 class="text-2xl font-bold mt-1">ยินดีต้อนรับ, \${u.name}</h2>
              <p class="text-xs text-blue-200">ข้อมูลเชื่อมต่อกับ Google Sheet แผ่นปัจจุบันแบบเรียลไทม์</p>
            </div>
            \${u.role === 'STUDENT' ? \`
              <button onclick="openNewSubmissionModal()" class="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl shadow cursor-pointer text-sm">
                + บันทึกกิจกรรมใหม่
              </button>
            \` : ''}
          </div>

          <!-- นักเรียน: แสดงเกณฑ์ 5 หมวด -->
          \${u.role === 'STUDENT' ? \`
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div class="p-4 bg-white rounded-xl border shadow-sm">
                <p class="text-xs text-slate-500">ชั่วโมงสะสมที่อนุมัติแล้ว</p>
                <p class="text-2xl font-black text-amber-600 mt-1">\${approvedHours} <span class="text-xs text-slate-400">/ 100 ชม.</span></p>
              </div>
              <div class="p-4 bg-white rounded-xl border shadow-sm">
                <p class="text-xs text-slate-500">กิจกรรมที่ส่งทั้งหมด</p>
                <p class="text-2xl font-black text-slate-800 mt-1">\${mySubs.length} <span class="text-xs text-slate-400">รายการ</span></p>
              </div>
              <div class="p-4 bg-white rounded-xl border shadow-sm col-span-2 sm:col-span-1">
                <p class="text-xs text-slate-500">รอครูตรวจสอบ</p>
                <p class="text-2xl font-black text-blue-600 mt-1">\${mySubs.filter(s => s.status === 'PENDING').length} <span class="text-xs text-slate-400">รายการ</span></p>
              </div>
            </div>
          \` : ''}

          <!-- ตารางรายการกิจกรรม -->
          <div class="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div class="p-4 bg-slate-50 border-b flex justify-between items-center">
              <h4 class="font-bold text-sm">\${u.role === 'STUDENT' ? 'ประวัติกิจกรรมของฉัน' : 'รายการกิจกรรมใน Google Sheet'}</h4>
              <button onclick="loadDataFromSheets()" class="text-xs text-blue-700 hover:underline">🔄 รีเฟรชข้อมูลจากชีต</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead class="bg-slate-100 text-slate-700">
                  <tr>
                    <th class="p-3">ชื่อนักเรียน</th>
                    <th class="p-3">หมวด</th>
                    <th class="p-3">ชื่อกิจกรรม</th>
                    <th class="p-3 text-center">ชั่วโมง</th>
                    <th class="p-3 text-center">สถานะ</th>
                    \${u.role !== 'STUDENT' ? '<th class="p-3 text-center">จัดการ</th>' : ''}
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${mySubs.map(item => \`
                    <tr class="hover:bg-slate-50">
                      <td class="p-3 font-semibold">\${item.studentName || u.name} (\${item.studentGrade || ''})</td>
                      <td class="p-3 text-blue-700 font-bold">หมวด \${item.categoryId}</td>
                      <td class="p-3">\${item.title}</td>
                      <td class="p-3 text-center font-bold text-amber-700">\${item.hours}</td>
                      <td class="p-3 text-center">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                          \${item.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'รอตรวจสอบ'}
                        </span>
                      </td>
                      \${u.role !== 'STUDENT' ? \`
                        <td class="p-3 text-center">
                          \${item.status === 'PENDING' ? \`
                            <button onclick="approveSubmission('\${item.id}')" class="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[11px] cursor-pointer">
                              อนุมัติ
                            </button>
                          \` : '<span class="text-slate-400">ตรวจแล้ว</span>'}
                        </td>
                      \` : ''}
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      \`;
    }

    // ฟังก์ชันล็อกอิน
    function loginAs(username) {
      const matched = state.data.students.find(s => s.username === username);
      if (matched) {
        state.currentUser = matched;
        render();
      }
    }

    function handleLoginSubmit(e) {
      e.preventDefault();
      const val = document.getElementById('loginId').value.trim();
      loginAs(val || 'std67101');
    }

    function logout() {
      state.currentUser = null;
      render();
    }

    // ฟังก์ชันบันทึกกิจกรรมใหม่
    function openNewSubmissionModal() {
      const title = prompt("กรอกชื่อกิจกรรม (เช่น บันทึกการอ่านหนังสือ หรือ วิ่งออกกำลังกาย):");
      if (!title) return;
      const hours = prompt("จำนวนชั่วโมง:", "4");

      const newSub = {
        studentId: state.currentUser.id,
        studentName: state.currentUser.name,
        studentGrade: state.currentUser.grade || "ม.4/1",
        categoryId: 1,
        title: title,
        date: new Date().toISOString().substring(0, 10),
        hours: Number(hours) || 2,
        status: "PENDING"
      };

      state.data.submissions.unshift(newSub);
      render();

      // บันทึกไปยัง Google Sheets ถ้าเปิดอยู่ใน Apps Script
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run.apiSaveSubmission(newSub);
      }
      alert("บันทึกกิจกรรมเรียบร้อยแล้ว!");
    }

    // ฟังก์ชันอนุมัติกิจกรรม
    function approveSubmission(subId) {
      const sub = state.data.submissions.find(s => s.id === subId);
      if (sub) {
        sub.status = 'APPROVED';
        render();

        if (typeof google !== 'undefined' && google.script && google.script.run) {
          google.script.run.apiUpdateStatus({
            id: subId,
            status: 'APPROVED',
            reviewedBy: state.currentUser.name,
            reviewComment: 'อนุมัติเรียบร้อย'
          });
        }
      }
    }

    // เริ่มต้นแอป
    render();
    loadDataFromSheets();
  </script>
</body>
</html>
`;
