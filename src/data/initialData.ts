import { ActivityCategory, AppSettings, HomeroomRecord, StudentSubmission, User } from '../types';

export const SCHOOL_INFO = {
  nameTh: 'โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย กาฬสินธุ์',
  nameEn: 'Princess Chulabhorn Science High School Kalasin',
  abbreviation: 'PCSHS Kalasin',
  crestUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV1e06w-4_epnFiZEkwMnAdpIPfxtJScJ5h-MHx0645rC9K4iron9At5wZtFOSDhqfTHzHiT5QdAbkINM5O-uejyQWUqgw_Lxdm7kJm76aZCIzsB811f_Ka_3xTrtLuOxWnkTfDPogdEycCRbVA1vqmGfslYtaYTlC0HZosBdbJwqtAFv3DcOoZDsh4ydrfypdXtzxFr9u0UWkG6gr4DR9ZnnBYIu6VUWbwXUfkZcHrpQ5O_v5u3pU3Dw92Gza0mt3h5o',
  academicTerm: 'ปีการศึกษา 2567 (ภาคเรียนที่ 2)',
  supportCenter: 'ศูนย์วิทยบริการและไอที PCSHS-KL',
  phone: '043-811-XXX'
};

export const INITIAL_CATEGORIES: ActivityCategory[] = [
  {
    id: 1,
    name: 'กิจกรรมแนะแนว & พัฒนาตนเอง',
    nameEn: 'Guidance & Self-Development',
    requiredHours: 20,
    iconName: 'Compass',
    color: '#2563eb',
    bgLight: '#eff6ff',
    borderColor: '#bfdbfe',
    description: 'กิจกรรมวางแผนการเรียน การค้นพบตนเอง เส้นทางสู่อาชีพนักวิทยาศาสตร์/แพทย์/วิศวกร และการอ่านหนังสือพัฒนาตนเอง',
    examples: ['บันทึกการอ่านหนังสือพัฒนาทักษะชีวิต', 'เข้าร่วมสัมมนาแนะแนว TCAS รอบ Portfolio', 'Workshop วางแผนเป้าหมายชีวิตและการเรียน']
  },
  {
    id: 2,
    name: 'คุณลักษณะอันพึงประสงค์ & วินัย',
    nameEn: 'Desirable Characteristics & Discipline',
    requiredHours: 20,
    iconName: 'ShieldCheck',
    color: '#059669',
    bgLight: '#ecfdf5',
    borderColor: '#a7f3d0',
    description: 'วินัยการอยู่ร่วมกันในหอพักโรงเรียนประจำ คุณธรรม จริยธรรม การเข้าร่วมกิจกรรม Homeroom และการออกกำลังกายสม่ำเสมอ',
    examples: ['บันทึกการออกกำลังกาย/วิ่งเช้า', 'การเข้าร่วมคาบ Homeroom ประจำสัปดาห์', 'กิจกรรม 5 ส. ดูแลความเรียบร้อยของหอพัก']
  },
  {
    id: 3,
    name: 'กิจกรรมเพื่อสังคม & สาธารณประโยชน์',
    nameEn: 'Social Contribution & Public Benefits',
    requiredHours: 20,
    iconName: 'HeartHandshake',
    color: '#d97706',
    bgLight: '#fffbeb',
    borderColor: '#fde68a',
    description: 'การบำเพ็ญประโยชน์ จิตอาสา การพัฒนาสิ่งแวดล้อม และการถ่ายทอดองค์ความรู้ทางวิทยาศาสตร์สู่ชุมชนท้องถิ่น',
    examples: ['จิตอาสาจัดหมวดหมู่หนังสือในห้องสมุดโรงเรียน', 'กิจกรรมค่ายวิทยาศาสตร์พี่สอนน้องในชุมชน', 'โครงการแยกขยะและรีไซเคิลในสถานศึกษา']
  },
  {
    id: 4,
    name: 'ความเป็นไทย & ประชาธิปไตย',
    nameEn: 'Thai Identity & Democratic Citizenship',
    requiredHours: 15,
    iconName: 'Award',
    color: '#7c3aed',
    bgLight: '#f5f3ff',
    borderColor: '#ddd6fe',
    description: 'การส่งเสริมวัฒนธรรมไทย ประเพณีอีสาน ประชาธิปไตยในโรงเรียน และกิจกรรมสภานักเรียน',
    examples: ['เข้าร่วมการเลือกตั้งคณะกรรมการสภานักเรียน', 'กิจกรรมสืบสานประเพณีไทยและวัฒนธรรมท้องถิ่น', 'พิธีไหว้ครูและกิจกรรมวันสำคัญของชาติ']
  },
  {
    id: 5,
    name: 'โครงงานวิทยาศาสตร์ นวัตกรรม และกิจกรรมส่งเสริมความเป็นเลิศ',
    nameEn: 'Science Projects, Innovation & Academic Excellence',
    requiredHours: 25,
    iconName: 'FlaskConical',
    color: '#e11d48',
    bgLight: '#fff1f2',
    borderColor: '#fecdd3',
    description: 'การทำโครงงานวิทยาศาสตร์ สิ่งประดิษฐ์ การเข้าร่วมค่ายโอลิมปิกวิชาการ สอวน. หรือการนำเสนองานวิชาการระดับชาติ',
    examples: ['การพัฒนาโครงงานวิจัยวิทยาศาสตร์และสิ่งประดิษฐ์', 'การเข้าร่วมค่ายส่งเสริมโอลิมปิกวิชาการ (สอวน.)', 'การนำเสนอโครงงานในเวที Thailand-Japan Student Science Fair (TJSSF)']
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-std-1',
    username: 'std67101',
    name: 'นายกิตติธัช วงศ์วิทยา',
    role: 'STUDENT',
    grade: 'ม.4/1',
    studentNumber: '05101',
    email: 'kittithat.w@pcshsksn.ac.th',
    advisorName: 'ครูวรวุฒิ สิทธิโชค',
    phone: '081-234-5678'
  },
  {
    id: 'u-std-2',
    username: 'std67102',
    name: 'นางสาวพิมพ์ชนก รัตนโกสินทร์',
    role: 'STUDENT',
    grade: 'ม.4/1',
    studentNumber: '05102',
    email: 'pimchanok.r@pcshsksn.ac.th',
    advisorName: 'ครูวรวุฒิ สิทธิโชค',
    phone: '089-876-5432'
  },
  {
    id: 'u-std-3',
    username: 'std67103',
    name: 'นายธนกฤต ปัญญานิวัฒน์',
    role: 'STUDENT',
    grade: 'ม.5/2',
    studentNumber: '04205',
    email: 'thanakrit.p@pcshsksn.ac.th',
    advisorName: 'ครูชิดชนก ศรีสงคราม',
    phone: '086-555-1234'
  },
  {
    id: 'u-tch-1',
    username: 'tch.worawoot',
    name: 'อ.วรวุฒิ สิทธิโชค (ครูที่ปรึกษา ม.4/1)',
    role: 'TEACHER',
    grade: 'ม.4/1',
    email: 'worawoot.s@pcshsksn.ac.th',
    phone: '081-999-4433'
  },
  {
    id: 'u-tch-2',
    username: 'tch.somchai',
    name: 'อ.สมชาย พัฒนารักษ์ (กลุ่มสาระวิทยาศาสตร์)',
    role: 'TEACHER',
    grade: 'ม.5/2',
    email: 'somchai.p@pcshsksn.ac.th',
    phone: '082-111-2233'
  },
  {
    id: 'u-adm-1',
    username: 'admin.activity',
    name: 'ฝ่ายงานกิจกรรมพัฒนาผู้เรียน & ทะเบียนวัดผล',
    role: 'ADMIN',
    email: 'activity.admin@pcshsksn.ac.th',
    phone: '043-811-000'
  }
];

export const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-001',
    studentId: 'u-std-1',
    studentName: 'นายกิตติธัช วงศ์วิทยา',
    studentGrade: 'ม.4/1',
    categoryId: 1,
    title: 'บันทึกการอ่านหนังสือ: "Brief Answers to the Big Questions" โดย Stephen Hawking',
    date: '2026-09-12',
    hours: 6,
    location: 'หอพักนักเรียนชาย 1',
    description: 'อ่านจบและสรุปสาระสำคัญเกี่ยวกับกำเนิดจักรวาล หลุมดำ และเทคโนโลยีอวกาศในอนาคตเพื่อเสริมสร้างแรงบันดาลใจในการเป็นนักดาราศาสตร์ฟิสิกส์',
    evidenceFileName: 'hawking_book_summary.pdf',
    evidenceUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    status: 'APPROVED',
    reviewComment: 'สรุปประเด็นได้น่าสนใจมาก มีความเชื่อมโยงกับวิชาฟิสิกส์ดีเยี่ยม',
    reviewedBy: 'อ.วรวุฒิ สิทธิโชค',
    reviewedAt: '2026-09-14 10:30',
    createdAt: '2026-09-12 19:40'
  },
  {
    id: 'sub-002',
    studentId: 'u-std-1',
    studentName: 'นายกิตติธัช วงศ์วิทยา',
    studentGrade: 'ม.4/1',
    categoryId: 2,
    title: 'บันทึกการออกกำลังกายสม่ำเสมอ: วิ่งรอบลู่วิ่งและฟิตเนสโรงเรียน',
    date: '2026-09-18',
    hours: 8,
    location: 'สนามกีฬา PCSHS Kalasin',
    description: 'วิ่งออกกำลังกายเพื่อสุขภาพร่วมกับเพื่อนร่วมหอพัก สัปดาห์ละ 4 วัน รวมระยะทางกว่า 25 กิโลเมตร',
    evidenceFileName: 'strava_running_record.jpg',
    evidenceUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    status: 'APPROVED',
    reviewComment: 'ยอดเยี่ยม รักษาสุขภาพให้แข็งแรงพร้อมกับการเรียนวิทย์เข้มข้น',
    reviewedBy: 'อ.วรวุฒิ สิทธิโชค',
    reviewedAt: '2026-09-20 14:15',
    createdAt: '2026-09-18 18:20'
  },
  {
    id: 'sub-003',
    studentId: 'u-std-1',
    studentName: 'นายกิตติธัช วงศ์วิทยา',
    studentGrade: 'ม.4/1',
    categoryId: 3,
    title: 'จิตอาสาจัดหมวดหมู่หนังสือวิทยาศาสตร์และช่วยงานศูนย์วิทยบริการ',
    date: '2026-09-22',
    hours: 10,
    location: 'ศูนย์วิทยบริการและไอที PCSHS-KL',
    description: 'ช่วยเจ้าหน้าที่บรรณารักษ์จัดทำบาร์โค้ดหนังสือใหม่ และแนะนำการค้นคว้างานวิจัยออนไลน์แก่น้อง ม.1',
    evidenceFileName: 'library_volunteer_cert.pdf',
    evidenceUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
    status: 'APPROVED',
    reviewComment: 'จิตสาธารณะดีมาก มีทักษะการช่วยเหลือผู้อื่นได้อย่างสุภาพ',
    reviewedBy: 'อ.วรวุฒิ สิทธิโชค',
    reviewedAt: '2026-09-24 09:00',
    createdAt: '2026-09-22 16:45'
  },
  {
    id: 'sub-004',
    studentId: 'u-std-1',
    studentName: 'นายกิตติธัช วงศ์วิทยา',
    studentGrade: 'ม.4/1',
    categoryId: 5,
    title: 'การพัฒนาต้นแบบโครงงานเครื่องตรวจสอบคุณภาพน้ำบึงกุดขอนแก่นแบบ IoT',
    date: '2026-09-28',
    hours: 25,
    location: 'ห้องปฏิบัติการวิทยาศาสตร์ อาคารปฏิบัติการ',
    description: 'ออกแบบระบบเซนเซอร์วัดค่า pH, DO, และความขุ่นของน้ำ ส่งข้อมูลผ่าน ESP32 ขึ้น Cloud Dashboard เพื่อการอนุรักษ์แหล่งน้ำในจังหวัดกาฬสินธุ์',
    evidenceFileName: 'project_full_report.pdf',
    evidenceUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80',
    status: 'APPROVED',
    reviewComment: 'โครงงานมีความคิดสร้างสรรค์และบูรณาการความรู้ได้โดดเด่นมาก ได้รับคัดเลือกไปนำเสนอในงานแสดงผลงานต่อไป',
    reviewedBy: 'อ.วรวุฒิ สิทธิโชค',
    reviewedAt: '2026-09-29 16:00',
    createdAt: '2026-09-28 20:10'
  },
  {
    id: 'sub-005',
    studentId: 'u-std-1',
    studentName: 'นายกิตติธัช วงศ์วิทยา',
    studentGrade: 'ม.4/1',
    categoryId: 4,
    title: 'เข้าร่วมกิจกรรมประชาธิปไตยในโรงเรียน และการเลือกตั้งสภานักเรียน ปีการศึกษา 2567',
    date: '2026-10-01',
    hours: 5,
    location: 'หอประชุมราชพฤกษ์',
    description: 'ร่วมฟังการแถลงนโยบายของผู้สมัครพรรคต่างๆ และลงคะแนนเสียงเลือกตั้งประธานนักเรียนด้วยระบบดิจิทัล',
    evidenceFileName: 'election_attendance_badge.jpg',
    evidenceUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80',
    status: 'PENDING',
    createdAt: '2026-10-01 08:30'
  },
  {
    id: 'sub-006',
    studentId: 'u-std-2',
    studentName: 'นางสาวพิมพ์ชนก รัตนโกสินทร์',
    studentGrade: 'ม.4/1',
    categoryId: 5,
    title: 'เข้าร่วมค่ายฟิสิกส์ดาราศาสตร์และสังเกตการณ์ฝนดาวตก ณ หอดูดาวเฉลิมพระเกียรติฯ',
    date: '2026-09-15',
    hours: 15,
    location: 'หอดูดาวภูมิภาค',
    description: 'ฝึกการตั้งกล้องโทรทรรศน์สะท้อนแสง การถ่ายภาพทางดาราศาสตร์ และวิเคราะห์สเปกตรัมแสงของดาวฤกษ์',
    evidenceFileName: 'astronomy_camp_cert.pdf',
    evidenceUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    status: 'PENDING',
    createdAt: '2026-09-16 11:20'
  },
  {
    id: 'sub-007',
    studentId: 'u-std-3',
    studentName: 'นายธนกฤต ปัญญานิวัฒน์',
    studentGrade: 'ม.5/2',
    categoryId: 3,
    title: 'กิจกรรมปลูกป่าชายเลนและเก็บขยะเพื่อระบบนิเวศน์ทางทะเล',
    date: '2026-08-30',
    hours: 12,
    location: 'ศูนย์ศึกษาธรรมชาติและสิ่งแวดล้อม',
    description: 'ร่วมโครงการอาสาสมัครเยาวชน ปลูกต้นโกงกางจำนวน 50 ต้น และทำความสะอาดแนวชายหาด',
    evidenceFileName: 'mangrove_planting_photo.jpg',
    evidenceUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    status: 'APPROVED',
    reviewComment: 'ภาพหลักฐานชัดเจน ชั่วโมงครบถ้วนตามเกณฑ์',
    reviewedBy: 'อ.สมชาย พัฒนารักษ์',
    reviewedAt: '2026-09-02 11:00',
    createdAt: '2026-08-31 09:15'
  }
];

export const INITIAL_HOMEROOM: HomeroomRecord[] = [
  {
    id: 'hr-1',
    date: '2026-09-25',
    grade: 'ม.4/1',
    topic: 'การวางแผนการศึกษาและการเตรียมโครงงานวิทยาศาสตร์ภาคเรียนที่ 2',
    advisorName: 'อ.วรวุฒิ สิทธิโชค',
    totalStudents: 24,
    presentCount: 24,
    notes: 'นักเรียนทุกคนให้ความสนใจ และทยอยส่งหัวข้อโครงงานวิทยาศาสตร์ครบถ้วน'
  },
  {
    id: 'hr-2',
    date: '2026-09-18',
    grade: 'ม.4/1',
    topic: 'การปฏิบัติตามกฎระเบียบหอพัก และสุขภาพจิตในการเรียน',
    advisorName: 'อ.วรวุฒิ สิทธิโชค',
    totalStudents: 24,
    presentCount: 23,
    notes: 'มีนักเรียนลาป่วย 1 คน (พักรักษาตัวที่ห้องพยาบาล)'
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  academicYear: '2567',
  semester: '2',
  autoSyncEnabled: true,
  lastSyncTime: 'วันนี้ เวลา 09:15 น.'
};
