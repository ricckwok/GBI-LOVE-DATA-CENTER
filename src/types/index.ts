export type UserRole = 'SUPER_ADMIN' | 'ADMINISTRATOR' | 'OPERATOR' | 'PEMIMPIN_COOL';

export interface RoleInfo {
  role: UserRole;
  title: string;
  badge: string;
  description: string;
  defaultUsername: string;
  defaultPass: string;
  allowedTabs: string[];
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleInfo> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'Super Admin / Gembala Sidang',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Akses penuh ke seluruh sistem, master data, konfigurasi gereja, dan manajemen user.',
    defaultUsername: 'superadmin',
    defaultPass: 'admin123',
    allowedTabs: ['dashboard', 'kkj', 'members', 'cool', 'sacraments', 'workers', 'attendance', 'birthday', 'whatsapp', 'reports', 'settings']
  },
  ADMINISTRATOR: {
    role: 'ADMINISTRATOR',
    title: 'Administrator Gereja / Sekretariat',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Pengelolaan KKJ, Master Data Jemaat, Sakramen, Pengerja, WhatsApp & Pelaporan.',
    defaultUsername: 'admin',
    defaultPass: 'admin123',
    allowedTabs: ['dashboard', 'kkj', 'members', 'cool', 'sacraments', 'workers', 'attendance', 'birthday', 'whatsapp', 'reports']
  },
  OPERATOR: {
    role: 'OPERATOR',
    title: 'Operator Presensi & Ibadah',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Fokus presensi kehadiran ibadah, scan QR code jemaat, dan pencarian cepat jemaat.',
    defaultUsername: 'operator',
    defaultPass: 'operator123',
    allowedTabs: ['dashboard', 'attendance', 'members', 'birthday']
  },
  PEMIMPIN_COOL: {
    role: 'PEMIMPIN_COOL',
    title: 'Pemimpin COOL / Komunitas Kasih',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Akses anggota COOL terdaftar, pengingat ulang tahun anggota, dan kehadiran kelompok.',
    defaultUsername: 'cool_budi',
    defaultPass: 'cool123',
    allowedTabs: ['dashboard', 'cool', 'members', 'birthday']
  }
};

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  role: UserRole;
  coolId?: string; // If role is PEMIMPIN_COOL
  isActive: boolean;
  avatarUrl?: string;
}

export type Gender = 'L' | 'P';

export enum FamilyRelation {
  SUAMI = 1,
  ISTRI = 2,
  ANAK = 3,
  ORANG_TUA = 4,
  SAUDARA_FAMILY = 5,
  PEGAWAI_PEMBANTU = 6,
  ORANG_LAIN = 7
}

export const FamilyRelationLabels: Record<FamilyRelation, string> = {
  [FamilyRelation.SUAMI]: 'Suami / Kepala Keluarga',
  [FamilyRelation.ISTRI]: 'Istri',
  [FamilyRelation.ANAK]: 'Anak',
  [FamilyRelation.ORANG_TUA]: 'Orang Tua / Mertua',
  [FamilyRelation.SAUDARA_FAMILY]: 'Saudara / Famili',
  [FamilyRelation.PEGAWAI_PEMBANTU]: 'Pegawai / Pembantu',
  [FamilyRelation.ORANG_LAIN]: 'Orang Lain'
};

export enum MaritalStatus {
  BELUM_MENIKAH = 1,
  MENIKAH = 2,
  CERAI = 3,
  DUDA = 4,
  JANDA = 5
}

export const MaritalStatusLabels: Record<MaritalStatus, string> = {
  [MaritalStatus.BELUM_MENIKAH]: 'Belum Menikah',
  [MaritalStatus.MENIKAH]: 'Menikah',
  [MaritalStatus.CERAI]: 'Cerai',
  [MaritalStatus.DUDA]: 'Duda',
  [MaritalStatus.JANDA]: 'Janda'
};

export enum EducationLevel {
  TIDAK_SEKOLAH = 0,
  SD = 1,
  SMP = 2,
  SMA_SMK = 3,
  D3 = 4,
  S1 = 5,
  S2 = 6,
  S3 = 7
}

export const EducationLevelLabels: Record<EducationLevel, string> = {
  [EducationLevel.TIDAK_SEKOLAH]: 'Tidak Bersekolah',
  [EducationLevel.SD]: 'SD / Sederajat',
  [EducationLevel.SMP]: 'SMP / Sederajat',
  [EducationLevel.SMA_SMK]: 'SMA / SMK',
  [EducationLevel.D3]: 'Diploma (D3)',
  [EducationLevel.S1]: 'Sarjana (S1)',
  [EducationLevel.S2]: 'Magister (S2)',
  [EducationLevel.S3]: 'Doktor (S3)'
};

export type MemberStatus = 'AKTIF' | 'TIDAK_AKTIF' | 'PINDAH' | 'MENINGGAL';

export interface ChurchMember {
  id: string;
  memberNumber: string; // e.g. MBR/2026/0001
  fullName: string;
  nickname?: string;
  nik?: string; // Restricted RBAC
  gender: Gender;
  birthPlace: string;
  birthDate: string; // YYYY-MM-DD
  whatsappNumber: string; // formatted 628xxx
  email?: string;
  address: string;
  city: string;
  district?: string;
  occupation: string;
  companyOrSchool?: string;
  educationLevel: EducationLevel;
  maritalStatus: MaritalStatus;
  memberStatus: MemberStatus;
  joinedDate: string; // YYYY-MM-DD
  lastAttendedAt?: string; // ISO date string
  coolId?: string;
  familyId?: string;
  familyRelation?: FamilyRelation;
  photoUrl?: string;
  waOptIn: boolean;
  qrToken: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Family {
  id: string;
  familyCode: string;
  kkjNumber: string; // e.g. KKJ/2026/0001
  headMemberId: string; // References ChurchMember.id
  headName: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  telephone?: string;
  whatsappNumber: string;
  coolId?: string;
  registeredDate: string;
  status: 'AKTIF' | 'PINDAH' | 'NONAKTIF';
  familyPhotoUrl?: string;
  adminNotes?: string;
  memberIds: string[]; // List of ChurchMember.id
  createdAt: string;
  updatedAt: string;
}

export type TabType = 
  | 'dashboard' 
  | 'kkj' 
  | 'members' 
  | 'cool' 
  | 'sacraments' 
  | 'workers' 
  | 'attendance' 
  | 'birthday' 
  | 'whatsapp' 
  | 'reports' 
  | 'settings';

export type FamilyKKJ = Family;

export interface COOLGroup {
  id: string;
  coolCode: string;
  coolName: string;
  advisorName?: string; // Pembina
  leaderMemberId?: string; // Ketua COOL
  leaderName: string;
  viceLeaderName?: string;
  secretaryName?: string;
  treasurerName?: string;
  meetingLocation?: string;
  meetingDay?: string; // e.g. 'Jumat'
  meetingTime?: string; // e.g. '19:30'
  locationAddress?: string;
  scheduleDay?: string;
  scheduleTime?: string;
  contactNumber?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChildDedication {
  id: string;
  registrationNumber: string;
  childMemberId: string;
  childName: string;
  birthPlace: string;
  birthDate: string;
  fatherName: string;
  motherName: string;
  address: string;
  dedicationDate: string;
  churchName: string;
  ministerName: string;
  witnessName: string;
  certificateNumber: string;
  notes?: string;
  createdAt: string;
}

export interface WaterBaptism {
  id: string;
  registrationNumber: string;
  memberId: string;
  memberName: string;
  baptismDate: string;
  churchOrLocation: string;
  ministerName: string;
  witnessName: string;
  certificateNumber: string;
  notes?: string;
  createdAt: string;
}

export interface HolySpiritBaptism {
  id: string;
  memberId: string;
  memberName: string;
  baptismDate: string;
  location: string;
  ministerName: string;
  notes?: string;
  createdAt: string;
}

export interface MarriageRecord {
  id: string;
  memberId: string;
  memberName: string;
  spouseName: string;
  spouseMemberId?: string;
  marriageDate: string;
  churchName: string;
  ministerName: string;
  certificateNumber: string;
  notes?: string;
  createdAt: string;
}

export interface DeathRecord {
  id: string;
  memberId: string;
  memberName: string;
  deathDate: string;
  deathPlace: string;
  ministerName: string;
  funeralServiceDetails?: string;
  createdAt: string;
}

export interface WorkerDepartment {
  id: string;
  departmentName: string;
  leaderName: string;
  description: string;
}

export interface Worker {
  id: string;
  memberId: string;
  memberName: string;
  departmentId: string;
  departmentName: string;
  positionTitle: string;
  ministryStartDate?: string;
  appointmentDate?: string;
  skNumber?: string;
  skills?: string;
  spiritualGifts?: string;
  isActive: boolean;
  notes?: string;
  photoUrl?: string;
  whatsappNumber?: string;
  email?: string;
  createdAt?: string;
}

export interface WorshipType {
  id: string;
  typeName: string;
  defaultDay: string;
  defaultTime: string;
  description?: string;
}

export interface WorshipService {
  id: string;
  worshipTypeId: string;
  worshipTypeName: string;
  serviceTitle: string;
  serviceDate: string; // YYYY-MM-DD
  serviceTime: string; // HH:mm
  location: string;
  preacher: string;
  worshipLeader: string;
  notes?: string;
  isOpen: boolean;
  createdAt: string;
}

export type CheckInMethod = 'QR_CODE' | 'MANUAL_SEARCH' | 'BARCODE';

export interface AttendanceRecord {
  id: string;
  serviceId: string;
  memberId: string;
  memberName: string;
  memberNumber: string;
  kkjNumber?: string;
  coolName?: string;
  checkInTime: string; // ISO string
  checkInMethod: CheckInMethod;
  operatorName: string;
}

export type WAMessageType = 'BIRTHDAY' | 'ANNOUNCEMENT' | 'PASTORAL' | 'ATTENDANCE_REMINDER';

export type WAMessageStatus = 
  | 'PENDING' 
  | 'TERKIRIM' 
  | 'GAGAL' 
  | 'DILEWATI_TIDAK_ADA_WA' 
  | 'DILEWATI_NO_OPTIN' 
  | 'DILEWATI_SUDAH_PERNAH_DIKIRIM';

export interface WATemplate {
  id: string;
  templateCode: string;
  templateName: string;
  templateType: WAMessageType;
  bodyText: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WAMessageLog {
  id: string;
  memberId: string;
  recipientName: string;
  phoneNumber: string;
  messageType: WAMessageType;
  sendYear: number; // For anti-duplicate uniqueness check (memberId + type + sendYear)
  templateId?: string;
  messageBody: string;
  status: WAMessageStatus;
  providerMessageId?: string;
  errorDetails?: string;
  scheduledAt: string;
  sentAt?: string;
}

export interface WASettings {
  provider: 'META_CLOUD_API' | 'FONNTE_OFFICIAL' | 'TWILIO_BUSINESS';
  phoneNumberId: string;
  businessAccountId: string;
  apiAccessToken: string; // Masked on client UI
  schedulerSendTime: string; // e.g. "08:00"
  timezone: string; // "Asia/Jakarta"
  isAutoSendEnabled: boolean;
  isTestMode: boolean;
  testPhoneNumber: string;
  lastSchedulerRun?: string;
}

export interface ChurchSettings {
  churchName: string;
  seniorPastor: string;
  synod: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  website?: string;
  kkjFormatPrefix: string;
  inactiveThresholdDays: number; // e.g. 28 days for "Perlu Perhatian"
  logoUrl?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  actionType: string;
  entityName: string;
  entityId: string;
  details: string;
  timestamp: string;
}
