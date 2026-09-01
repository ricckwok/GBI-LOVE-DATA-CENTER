import {
  ChurchMember,
  Family,
  COOLGroup,
  ChildDedication,
  WaterBaptism,
  HolySpiritBaptism,
  MarriageRecord,
  DeathRecord,
  WorkerDepartment,
  Worker,
  WorshipType,
  WorshipService,
  AttendanceRecord,
  WATemplate,
  WAMessageLog,
  WASettings,
  ChurchSettings,
  User,
  ActivityLog,
  FamilyRelation,
  MaritalStatus,
  EducationLevel
} from '../types';

import { GBI_LOGO_SVG_DATA_URL } from '../components/common/GBILogo';

export const initialChurchSettings: ChurchSettings = {
  churchName: 'GBI LOVE INHIL',
  seniorPastor: 'Pdt. Yohanes Setiawan, M.Th.',
  synod: 'Gereja Bethel Indonesia (GBI)',
  address: 'Jl. M. Boya No. 45, Tembilahan Kota',
  city: 'Indragiri Hilir',
  province: 'Riau',
  phone: '+62 768 21455',
  email: 'sekretariat@gbiloveinhil.org',
  website: 'https://gbiloveinhil.org',
  kkjFormatPrefix: 'KKJ',
  inactiveThresholdDays: 21,
  logoUrl: GBI_LOGO_SVG_DATA_URL
};

export const initialUsers: User[] = [
  {
    id: 'USR-001',
    username: 'superadmin',
    password: 'admin123',
    fullName: 'Pdt. Yohanes Setiawan (Super Admin)',
    email: 'gembala@gbiloveinhil.org',
    role: 'SUPER_ADMIN',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-002',
    username: 'admin',
    password: 'admin123',
    fullName: 'Maria Angela (Administrator Gereja)',
    email: 'admin@gbiloveinhil.org',
    role: 'ADMINISTRATOR',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-003',
    username: 'operator',
    password: 'operator123',
    fullName: 'David Pratama (Operator Kehadiran)',
    email: 'operator@gbiloveinhil.org',
    role: 'OPERATOR',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-004',
    username: 'cool_budi',
    password: 'cool123',
    fullName: 'Budi Santoso (Pemimpin COOL Kasih 1)',
    email: 'budi.santoso@gbiloveinhil.org',
    role: 'PEMIMPIN_COOL',
    coolId: 'COOL-001',
    isActive: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialCOOLGroups: COOLGroup[] = [
  {
    id: 'COOL-001',
    coolCode: 'COOL-KSH-01',
    coolName: 'COOL Kasih 1 - Tembilahan Kota',
    advisorName: 'Pdt. Yohanes Setiawan',
    leaderMemberId: 'MBR-001',
    leaderName: 'Budi Santoso',
    viceLeaderName: 'Siti Maria',
    secretaryName: 'Ruth Handayani',
    treasurerName: 'Lidya Permata',
    meetingLocation: 'Jl. M. Boya No. 12, Tembilahan Kota',
    meetingDay: 'Jumat',
    meetingTime: '19:30',
    isActive: true,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'COOL-002',
    coolCode: 'COOL-SHL-02',
    coolName: 'COOL Shalom - Sungai Beringin',
    advisorName: 'Pdp. Daniel Hartono',
    leaderMemberId: 'MBR-005',
    leaderName: 'Hendra Gunawan',
    viceLeaderName: 'Grace Natalia',
    secretaryName: 'Ester Wijaya',
    meetingLocation: 'Jl. Sungai Beringin No. 88, Tembilahan',
    meetingDay: 'Kamis',
    meetingTime: '19:30',
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'COOL-003',
    coolCode: 'COOL-AGP-03',
    coolName: 'COOL Agape - Parit 6',
    advisorName: 'Pdp. Stefanus Lie',
    leaderMemberId: 'MBR-008',
    leaderName: 'Samuel Tarigan',
    viceLeaderName: 'Debora Manurung',
    meetingLocation: 'Jl. Baharuddin Yusuf Gg. Damai, Parit 6',
    meetingDay: 'Jumat',
    meetingTime: '19:00',
    isActive: true,
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'COOL-004',
    coolCode: 'COOL-YTH-04',
    coolName: 'COOL Youth Fire - Tembilahan',
    advisorName: 'Pdp. Timothy Chandra',
    leaderMemberId: 'MBR-003',
    leaderName: 'Andreas Wijaya',
    viceLeaderName: 'Jonathan Sitompul',
    secretaryName: 'Kezia Putri',
    meetingLocation: 'Ruang Serbaguna GBI Love Inhil lt. 2',
    meetingDay: 'Sabtu',
    meetingTime: '17:00',
    isActive: true,
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  }
];

export const initialChurchMembers: ChurchMember[] = [
  {
    id: 'MBR-001',
    memberNumber: 'MBR/2025/0001',
    fullName: 'Budi Santoso',
    nickname: 'Budi',
    nik: '1404011208820001',
    gender: 'L',
    birthPlace: 'Tembilahan',
    birthDate: '1982-08-31', // Today's birthday!
    whatsappNumber: '6281234567801',
    email: 'budi.santoso@gmail.com',
    address: 'Jl. M. Boya No. 12',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Kota',
    occupation: 'Wiraswasta',
    companyOrSchool: 'Toko Berkat Abadi',
    educationLevel: EducationLevel.S1,
    maritalStatus: MaritalStatus.MENIKAH,
    memberStatus: 'AKTIF',
    joinedDate: '2020-01-12',
    lastAttendedAt: '2026-08-30T09:00:00Z',
    coolId: 'COOL-001',
    familyId: 'KKJ-001',
    familyRelation: FamilyRelation.SUAMI,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    waOptIn: true,
    qrToken: 'QR-MBR-001-LOVEINHIL',
    notes: 'Pemimpin COOL Kasih 1, Diaken Gereja',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'MBR-002',
    memberNumber: 'MBR/2025/0002',
    fullName: 'Siti Maria',
    nickname: 'Maria',
    nik: '1404015509860002',
    gender: 'P',
    birthPlace: 'Pekanbaru',
    birthDate: '1986-08-31', // Today's birthday!
    whatsappNumber: '6281234567802',
    email: 'siti.maria@gmail.com',
    address: 'Jl. M. Boya No. 12',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Kota',
    occupation: 'Guru',
    companyOrSchool: 'SD Kristen Immanuel',
    educationLevel: EducationLevel.S1,
    maritalStatus: MaritalStatus.MENIKAH,
    memberStatus: 'AKTIF',
    joinedDate: '2020-01-12',
    lastAttendedAt: '2026-08-30T09:00:00Z',
    coolId: 'COOL-001',
    familyId: 'KKJ-001',
    familyRelation: FamilyRelation.ISTRI,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    waOptIn: true,
    qrToken: 'QR-MBR-002-LOVEINHIL',
    notes: 'Guru Sekolah Minggu',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'MBR-003',
    memberNumber: 'MBR/2025/0003',
    fullName: 'Andreas Wijaya',
    nickname: 'Andre',
    nik: '1404011809070003',
    gender: 'L',
    birthPlace: 'Tembilahan',
    birthDate: '2007-09-01', // Tomorrow's birthday!
    whatsappNumber: '6281234567803',
    email: 'andreas.wijaya@gmail.com',
    address: 'Jl. M. Boya No. 12',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Kota',
    occupation: 'Pelajar / Mahasiswa',
    companyOrSchool: 'SMA Negeri 1 Tembilahan',
    educationLevel: EducationLevel.SMA_SMK,
    maritalStatus: MaritalStatus.BELUM_MENIKAH,
    memberStatus: 'AKTIF',
    joinedDate: '2020-01-12',
    lastAttendedAt: '2026-08-30T09:00:00Z',
    coolId: 'COOL-004',
    familyId: 'KKJ-001',
    familyRelation: FamilyRelation.ANAK,
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    waOptIn: true,
    qrToken: 'QR-MBR-003-LOVEINHIL',
    notes: 'Pemain Keyboard Youth',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'MBR-004',
    memberNumber: 'MBR/2025/0004',
    fullName: 'Kezia Putri Santoso',
    nickname: 'Kezia',
    gender: 'P',
    birthPlace: 'Tembilahan',
    birthDate: '2014-09-03', // 3 days away
    whatsappNumber: '6281234567804',
    address: 'Jl. M. Boya No. 12',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Kota',
    occupation: 'Pelajar',
    companyOrSchool: 'SD Kristen Immanuel',
    educationLevel: EducationLevel.SD,
    maritalStatus: MaritalStatus.BELUM_MENIKAH,
    memberStatus: 'AKTIF',
    joinedDate: '2020-01-12',
    lastAttendedAt: '2026-08-30T09:00:00Z',
    coolId: 'COOL-001',
    familyId: 'KKJ-001',
    familyRelation: FamilyRelation.ANAK,
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    waOptIn: false,
    qrToken: 'QR-MBR-004-LOVEINHIL',
    notes: 'Anak',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'MBR-005',
    memberNumber: 'MBR/2025/0005',
    fullName: 'Hendra Gunawan',
    nickname: 'Hendra',
    nik: '1404012504780001',
    gender: 'L',
    birthPlace: 'Medan',
    birthDate: '1978-04-25',
    whatsappNumber: '6281234567805',
    email: 'hendra.gunawan@gmail.com',
    address: 'Jl. Sungai Beringin No. 88',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Hulu',
    occupation: 'Karyawan Swasta',
    companyOrSchool: 'PT. Sambu Group',
    educationLevel: EducationLevel.S1,
    maritalStatus: MaritalStatus.MENIKAH,
    memberStatus: 'AKTIF',
    joinedDate: '2021-03-15',
    lastAttendedAt: '2026-08-30T09:00:00Z',
    coolId: 'COOL-002',
    familyId: 'KKJ-002',
    familyRelation: FamilyRelation.SUAMI,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    waOptIn: true,
    qrToken: 'QR-MBR-005-LOVEINHIL',
    notes: 'Pemimpin COOL Shalom, Usher Coordinator',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'MBR-006',
    memberNumber: 'MBR/2025/0006',
    fullName: 'Grace Natalia',
    nickname: 'Grace',
    nik: '1404016212820002',
    gender: 'P',
    birthPlace: 'Tembilahan',
    birthDate: '1982-12-22',
    whatsappNumber: '6281234567806',
    email: 'grace.natalia@gmail.com',
    address: 'Jl. Sungai Beringin No. 88',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Hulu',
    occupation: 'Ibu Rumah Tangga',
    educationLevel: EducationLevel.SMA_SMK,
    maritalStatus: MaritalStatus.MENIKAH,
    memberStatus: 'AKTIF',
    joinedDate: '2021-03-15',
    lastAttendedAt: '2026-08-30T09:00:00Z',
    coolId: 'COOL-002',
    familyId: 'KKJ-002',
    familyRelation: FamilyRelation.ISTRI,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    waOptIn: true,
    qrToken: 'QR-MBR-006-LOVEINHIL',
    notes: 'Singer Ibadah Raya',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'MBR-007',
    memberNumber: 'MBR/2025/0007',
    fullName: 'Lidya Permata',
    nickname: 'Lidya',
    nik: '1404014809910003',
    gender: 'P',
    birthPlace: 'Tembilahan',
    birthDate: '1991-08-31', // Today's birthday!
    whatsappNumber: '6281234567807',
    email: 'lidya.permata@gmail.com',
    address: 'Jl. Telaga Biru No. 34',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Kota',
    occupation: 'Tenaga Medis / Bidan',
    companyOrSchool: 'RSUD Puri Husada',
    educationLevel: EducationLevel.D3,
    maritalStatus: MaritalStatus.BELUM_MENIKAH,
    memberStatus: 'AKTIF',
    joinedDate: '2022-05-10',
    lastAttendedAt: '2026-08-23T09:00:00Z',
    coolId: 'COOL-001',
    familyId: 'KKJ-003',
    familyRelation: FamilyRelation.ANAK,
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    waOptIn: true,
    qrToken: 'QR-MBR-007-LOVEINHIL',
    notes: 'Tim Medis Kasih Gereja',
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'MBR-008',
    memberNumber: 'MBR/2025/0008',
    fullName: 'Samuel Tarigan',
    nickname: 'Samuel',
    nik: '1404011503850004',
    gender: 'L',
    birthPlace: 'Kabanjahe',
    birthDate: '1985-03-15',
    whatsappNumber: '6281234567808',
    email: 'samuel.tarigan@gmail.com',
    address: 'Jl. Baharuddin Yusuf Gg. Damai No. 5',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Barat',
    occupation: 'PNS / ASN',
    companyOrSchool: 'Kantor Bupati Inhil',
    educationLevel: EducationLevel.S1,
    maritalStatus: MaritalStatus.MENIKAH,
    memberStatus: 'AKTIF',
    joinedDate: '2023-01-20',
    lastAttendedAt: '2026-08-02T09:00:00Z', // 4 weeks ago -> Status: PERLU PERHATIAN
    coolId: 'COOL-003',
    familyId: 'KKJ-004',
    familyRelation: FamilyRelation.SUAMI,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    waOptIn: true,
    qrToken: 'QR-MBR-008-LOVEINHIL',
    notes: 'Worship Leader & Pemimpin COOL Agape',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'MBR-009',
    memberNumber: 'MBR/2025/0009',
    fullName: 'Debora Manurung',
    nickname: 'Debora',
    nik: '1404016507880005',
    gender: 'P',
    birthPlace: 'Tembilahan',
    birthDate: '1988-07-25',
    whatsappNumber: '6281234567809',
    email: 'debora.manurung@gmail.com',
    address: 'Jl. Baharuddin Yusuf Gg. Damai No. 5',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Barat',
    occupation: 'Wiraswasta',
    educationLevel: EducationLevel.S1,
    maritalStatus: MaritalStatus.MENIKAH,
    memberStatus: 'AKTIF',
    joinedDate: '2023-01-20',
    lastAttendedAt: '2026-08-02T09:00:00Z',
    coolId: 'COOL-003',
    familyId: 'KKJ-004',
    familyRelation: FamilyRelation.ISTRI,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    waOptIn: true,
    qrToken: 'QR-MBR-009-LOVEINHIL',
    notes: 'Worship Team',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'MBR-010',
    memberNumber: 'MBR/2025/0010',
    fullName: 'Opa Markus Lie',
    nickname: 'Markus',
    nik: '1404011005480001',
    gender: 'L',
    birthPlace: 'Tembilahan',
    birthDate: '1948-05-10',
    whatsappNumber: '',
    address: 'Jl. Telaga Biru No. 34',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Kota',
    occupation: 'Pensiunan',
    educationLevel: EducationLevel.SMA_SMK,
    maritalStatus: MaritalStatus.DUDA,
    memberStatus: 'MENINGGAL',
    joinedDate: '2018-01-01',
    lastAttendedAt: '2025-11-10T09:00:00Z',
    coolId: 'COOL-001',
    familyId: 'KKJ-003',
    familyRelation: FamilyRelation.ORANG_TUA,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    waOptIn: false,
    qrToken: 'QR-MBR-010-LOVEINHIL',
    notes: 'Telah dipanggil Tuhan pada Desember 2025. Riwayat tetap tersimpan utuh.',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-12-05T10:00:00Z'
  }
];

export const initialFamilies: Family[] = [
  {
    id: 'KKJ-001',
    familyCode: 'FAM-2025-001',
    kkjNumber: 'KKJ/2025/0001',
    headMemberId: 'MBR-001',
    headName: 'Budi Santoso',
    address: 'Jl. M. Boya No. 12',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Kota',
    postalCode: '29212',
    telephone: '0768-22345',
    whatsappNumber: '6281234567801',
    coolId: 'COOL-001',
    registeredDate: '2020-01-12',
    status: 'AKTIF',
    familyPhotoUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&auto=format&fit=crop&q=80',
    adminNotes: 'Keluarga inti aktif melayani di bidang Diaken & Sekolah Minggu.',
    memberIds: ['MBR-001', 'MBR-002', 'MBR-003', 'MBR-004'],
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'KKJ-002',
    familyCode: 'FAM-2025-002',
    kkjNumber: 'KKJ/2025/0002',
    headMemberId: 'MBR-005',
    headName: 'Hendra Gunawan',
    address: 'Jl. Sungai Beringin No. 88',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Hulu',
    postalCode: '29213',
    telephone: '0768-21990',
    whatsappNumber: '6281234567805',
    coolId: 'COOL-002',
    registeredDate: '2021-03-15',
    status: 'AKTIF',
    familyPhotoUrl: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=600&auto=format&fit=crop&q=80',
    adminNotes: 'Pemimpin COOL Shalom wilayah Sungai Beringin.',
    memberIds: ['MBR-005', 'MBR-006'],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'KKJ-003',
    familyCode: 'FAM-2025-003',
    kkjNumber: 'KKJ/2025/0003',
    headMemberId: 'MBR-007',
    headName: 'Lidya Permata',
    address: 'Jl. Telaga Biru No. 34',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Kota',
    postalCode: '29212',
    whatsappNumber: '6281234567807',
    coolId: 'COOL-001',
    registeredDate: '2022-05-10',
    status: 'AKTIF',
    adminNotes: 'Keluarga saudari Lidya Permata.',
    memberIds: ['MBR-007', 'MBR-010'],
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'KKJ-004',
    familyCode: 'FAM-2025-004',
    kkjNumber: 'KKJ/2025/0004',
    headMemberId: 'MBR-008',
    headName: 'Samuel Tarigan',
    address: 'Jl. Baharuddin Yusuf Gg. Damai No. 5',
    city: 'Indragiri Hilir',
    district: 'Tembilahan Barat',
    postalCode: '29214',
    whatsappNumber: '6281234567808',
    coolId: 'COOL-003',
    registeredDate: '2023-01-20',
    status: 'AKTIF',
    adminNotes: 'Keluarga bpk Samuel Tarigan - Perlu perhatian kunjungan pastoral.',
    memberIds: ['MBR-008', 'MBR-009'],
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z'
  }
];

export const initialChildDedications: ChildDedication[] = [
  {
    id: 'DED-001',
    registrationNumber: 'PA/2025/001',
    childMemberId: 'MBR-004',
    childName: 'Kezia Putri Santoso',
    birthPlace: 'Tembilahan',
    birthDate: '2014-09-03',
    fatherName: 'Budi Santoso',
    motherName: 'Siti Maria',
    address: 'Jl. M. Boya No. 12, Tembilahan',
    dedicationDate: '2015-02-15',
    churchName: 'GBI LOVE INHIL',
    ministerName: 'Pdt. Yohanes Setiawan, M.Th.',
    witnessName: 'Pdp. Daniel Hartono',
    certificateNumber: 'SRT-PA-2015-0012',
    notes: 'Penyerahan anak berjalan lancar dalam Ibadah Raya.',
    createdAt: '2025-01-10T10:00:00Z'
  }
];

export const initialWaterBaptisms: WaterBaptism[] = [
  {
    id: 'BAP-001',
    registrationNumber: 'BS/2025/001',
    memberId: 'MBR-003',
    memberName: 'Andreas Wijaya',
    baptismDate: '2024-04-20',
    churchOrLocation: 'Kolam Baptisan GBI Love Inhil',
    ministerName: 'Pdt. Yohanes Setiawan, M.Th.',
    witnessName: 'Budi Santoso',
    certificateNumber: 'SRT-BS-2024-0045',
    notes: 'Telah mengikuti kelas pembinaan dasar kekristenan.',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'BAP-002',
    registrationNumber: 'BS/2025/002',
    memberId: 'MBR-007',
    memberName: 'Lidya Permata',
    baptismDate: '2022-07-15',
    churchOrLocation: 'Kolam Baptisan GBI Love Inhil',
    ministerName: 'Pdp. Stefanus Lie',
    witnessName: 'Grace Natalia',
    certificateNumber: 'SRT-BS-2022-0021',
    notes: 'Baptisan selam jemaat baru.',
    createdAt: '2025-02-10T10:00:00Z'
  }
];

export const initialHolySpiritBaptisms: HolySpiritBaptism[] = [
  {
    id: 'HSB-001',
    memberId: 'MBR-001',
    memberName: 'Budi Santoso',
    baptismDate: '2018-06-10',
    location: 'Retreat Doa Bukit Zaitun',
    ministerName: 'Pdt. Yohanes Setiawan, M.Th.',
    notes: 'Menerima kepenuhan Roh Kudus dengan tanda bahasa roh.',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'HSB-002',
    memberId: 'MBR-003',
    memberName: 'Andreas Wijaya',
    baptismDate: '2024-08-17',
    location: 'Youth Camp GBI Love Inhil',
    ministerName: 'Pdp. Timothy Chandra',
    notes: 'Menerima karunia bahasa roh dalam KKR Youth.',
    createdAt: '2025-01-10T10:00:00Z'
  }
];

export const initialMarriages: MarriageRecord[] = [
  {
    id: 'MAR-001',
    memberId: 'MBR-001',
    memberName: 'Budi Santoso',
    spouseName: 'Siti Maria',
    spouseMemberId: 'MBR-002',
    marriageDate: '2006-05-20',
    churchName: 'GBI Love Inhil Tembilahan',
    ministerName: 'Pdt. Yohanes Setiawan, M.Th.',
    certificateNumber: 'AKTA-NIKAH-2006-008',
    notes: 'Pemberkatan pernikahan kudus.',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'MAR-002',
    memberId: 'MBR-005',
    memberName: 'Hendra Gunawan',
    spouseName: 'Grace Natalia',
    spouseMemberId: 'MBR-006',
    marriageDate: '2008-11-14',
    churchName: 'GBI Love Inhil Tembilahan',
    ministerName: 'Pdt. Yohanes Setiawan, M.Th.',
    certificateNumber: 'AKTA-NIKAH-2008-015',
    notes: 'Pemberkatan pernikahan kudus.',
    createdAt: '2025-01-15T10:00:00Z'
  }
];

export const initialDeathRecords: DeathRecord[] = [
  {
    id: 'DTH-001',
    memberId: 'MBR-010',
    memberName: 'Opa Markus Lie',
    deathDate: '2025-12-05',
    deathPlace: 'RSUD Puri Husada Tembilahan',
    ministerName: 'Pdt. Yohanes Setiawan, M.Th.',
    funeralServiceDetails: 'Ibadah pelepasan dan pemakaman di TPU Kristen Tembilahan.',
    createdAt: '2025-12-06T10:00:00Z'
  }
];

export const initialWorkerDepartments: WorkerDepartment[] = [
  {
    id: 'DEP-001',
    departmentName: 'Pastoral & Penggembalaan',
    leaderName: 'Pdt. Yohanes Setiawan, M.Th.',
    description: 'Pelayanan bimbingan konseling, perkunjungan, dan pelayanan firman.'
  },
  {
    id: 'DEP-002',
    departmentName: 'Musik & Praise and Worship',
    leaderName: 'Samuel Tarigan',
    description: 'Worship Leader, Singers, Pemain Musik dan Choir.'
  },
  {
    id: 'DEP-003',
    departmentName: 'Multimedia & Sound System',
    leaderName: 'Jonathan Sitompul',
    description: 'Live streaming, EasyWorship/ProPresenter, dan operator sound mixer.'
  },
  {
    id: 'DEP-004',
    departmentName: 'Usher & Penerima Tamu',
    leaderName: 'Hendra Gunawan',
    description: 'Menyambut jemaat, tata ibadah, dan kolekte persembahan.'
  },
  {
    id: 'DEP-005',
    departmentName: 'Sekolah Minggu / Kids Ministry',
    leaderName: 'Siti Maria',
    description: 'Pengajaran firman untuk anak-anak usia balita hingga remaja muda.'
  },
  {
    id: 'DEP-006',
    departmentName: 'Youth & Young Adult',
    leaderName: 'Andreas Wijaya',
    description: 'Pembinaan generasi muda dan ibadah remaja sabtu.'
  }
];

export const initialWorkers: Worker[] = [
  {
    id: 'WRK-001',
    memberId: 'MBR-001',
    memberName: 'Budi Santoso',
    departmentId: 'DEP-001',
    departmentName: 'Pastoral & Penggembalaan',
    positionTitle: 'Diaken & Majelis Jemaat',
    ministryStartDate: '2021-01-01',
    skills: 'Manajemen, Konseling Keluarga',
    spiritualGifts: 'Kepemimpinan, Kemurahan Hati',
    isActive: true,
    whatsappNumber: '6281234567801',
    email: 'budi.santoso@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'WRK-002',
    memberId: 'MBR-002',
    memberName: 'Siti Maria',
    departmentId: 'DEP-005',
    departmentName: 'Sekolah Minggu / Kids Ministry',
    positionTitle: 'Kepala Sekolah Minggu',
    ministryStartDate: '2020-02-01',
    skills: 'Pengajaran Kreatif, Bernyanyi Anak',
    spiritualGifts: 'Mengajar, Kasih Sayang',
    isActive: true,
    whatsappNumber: '6281234567802',
    email: 'siti.maria@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'WRK-003',
    memberId: 'MBR-003',
    memberName: 'Andreas Wijaya',
    departmentId: 'DEP-002',
    departmentName: 'Musik & Praise and Worship',
    positionTitle: 'Keyboardist / Pianist',
    ministryStartDate: '2022-03-01',
    skills: 'Piano, Keyboard Synthesizer',
    spiritualGifts: 'Seni Musik',
    isActive: true,
    whatsappNumber: '6281234567803',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'WRK-004',
    memberId: 'MBR-005',
    memberName: 'Hendra Gunawan',
    departmentId: 'DEP-004',
    departmentName: 'Usher & Penerima Tamu',
    positionTitle: 'Koordinator Usher',
    ministryStartDate: '2021-06-01',
    skills: 'Keramahan, Protokoler',
    spiritualGifts: 'Melayani, Membantu',
    isActive: true,
    whatsappNumber: '6281234567805',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'WRK-005',
    memberId: 'MBR-006',
    memberName: 'Grace Natalia',
    departmentId: 'DEP-002',
    departmentName: 'Musik & Praise and Worship',
    positionTitle: 'Singer & Worship Leader',
    ministryStartDate: '2021-07-01',
    skills: 'Vokal Alto / Sopran',
    spiritualGifts: 'Pujian & Penyembahan',
    isActive: true,
    whatsappNumber: '6281234567806',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-15T10:00:00Z'
  }
];

export const initialWorshipTypes: WorshipType[] = [
  {
    id: 'WT-001',
    typeName: 'Ibadah Raya 1 (Pagi)',
    defaultDay: 'Minggu',
    defaultTime: '07:30',
    description: 'Ibadah umum sesi pagi'
  },
  {
    id: 'WT-002',
    typeName: 'Ibadah Raya 2 (Siang)',
    defaultDay: 'Minggu',
    defaultTime: '10:00',
    description: 'Ibadah umum sesi siang + live streaming'
  },
  {
    id: 'WT-003',
    typeName: 'Ibadah Youth Fire',
    defaultDay: 'Sabtu',
    defaultTime: '17:30',
    description: 'Ibadah remaja & pemuda'
  },
  {
    id: 'WT-004',
    typeName: 'Sekolah Minggu Kids Club',
    defaultDay: 'Minggu',
    defaultTime: '07:30',
    description: 'Ibadah anak-anak balita s/d SD'
  },
  {
    id: 'WT-005',
    typeName: 'Doa Pagi & Menara Doa',
    defaultDay: 'Sabtu',
    defaultTime: '05:30',
    description: 'Doa fajar bersama pengerja dan jemaat'
  }
];

export const initialWorshipServices: WorshipService[] = [
  {
    id: 'SRV-20260830-1',
    worshipTypeId: 'WT-001',
    worshipTypeName: 'Ibadah Raya 1 (Pagi)',
    serviceTitle: 'Ibadah Raya Minggu Pagi - Mengalami Kasih Bapa',
    serviceDate: '2026-08-30',
    serviceTime: '07:30',
    location: 'Sanctuary Utama GBI Love Inhil',
    preacher: 'Pdt. Yohanes Setiawan, M.Th.',
    worshipLeader: 'Grace Natalia',
    isOpen: true,
    notes: 'Tema Khotbah: Berakar dan Berbuah di dalam Kristus',
    createdAt: '2026-08-25T10:00:00Z'
  },
  {
    id: 'SRV-20260830-2',
    worshipTypeId: 'WT-003',
    worshipTypeName: 'Ibadah Youth Fire',
    serviceTitle: 'Youth Fire Revival Night',
    serviceDate: '2026-08-29',
    serviceTime: '17:30',
    location: 'Youth Hall lt. 2',
    preacher: 'Pdp. Timothy Chandra',
    worshipLeader: 'Andreas Wijaya',
    isOpen: false,
    notes: 'Ibadah Youth Sabtu sore',
    createdAt: '2026-08-24T10:00:00Z'
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT-001',
    serviceId: 'SRV-20260830-1',
    memberId: 'MBR-001',
    memberName: 'Budi Santoso',
    memberNumber: 'MBR/2025/0001',
    kkjNumber: 'KKJ/2025/0001',
    coolName: 'COOL Kasih 1',
    checkInTime: '2026-08-30T07:22:15Z',
    checkInMethod: 'QR_CODE',
    operatorName: 'David Pratama'
  },
  {
    id: 'ATT-002',
    serviceId: 'SRV-20260830-1',
    memberId: 'MBR-002',
    memberName: 'Siti Maria',
    memberNumber: 'MBR/2025/0002',
    kkjNumber: 'KKJ/2025/0001',
    coolName: 'COOL Kasih 1',
    checkInTime: '2026-08-30T07:22:18Z',
    checkInMethod: 'QR_CODE',
    operatorName: 'David Pratama'
  },
  {
    id: 'ATT-003',
    serviceId: 'SRV-20260830-1',
    memberId: 'MBR-003',
    memberName: 'Andreas Wijaya',
    memberNumber: 'MBR/2025/0003',
    kkjNumber: 'KKJ/2025/0001',
    coolName: 'COOL Youth Fire',
    checkInTime: '2026-08-30T07:15:00Z',
    checkInMethod: 'MANUAL_SEARCH',
    operatorName: 'David Pratama'
  },
  {
    id: 'ATT-004',
    serviceId: 'SRV-20260830-1',
    memberId: 'MBR-005',
    memberName: 'Hendra Gunawan',
    memberNumber: 'MBR/2025/0005',
    kkjNumber: 'KKJ/2025/0002',
    coolName: 'COOL Shalom',
    checkInTime: '2026-08-30T07:10:00Z',
    checkInMethod: 'QR_CODE',
    operatorName: 'David Pratama'
  },
  {
    id: 'ATT-005',
    serviceId: 'SRV-20260830-1',
    memberId: 'MBR-006',
    memberName: 'Grace Natalia',
    memberNumber: 'MBR/2025/0006',
    kkjNumber: 'KKJ/2025/0002',
    coolName: 'COOL Shalom',
    checkInTime: '2026-08-30T07:10:05Z',
    checkInMethod: 'QR_CODE',
    operatorName: 'David Pratama'
  }
];

export const initialWATemplates: WATemplate[] = [
  {
    id: 'TMP-001',
    templateCode: 'TMP_BIRTHDAY_OFFICIAL',
    templateName: 'Ucapan Ulang Tahun Resmi Jemaat',
    templateType: 'BIRTHDAY',
    bodyText: `🎉 *SELAMAT ULANG TAHUN* 🎂

Shalom {NAMA_JEMAAT},

Selamat bertambah usia! 🥳🎉

Kami segenap keluarga besar *{NAMA_GEREJA}* mengucapkan Selamat Ulang Tahun kepada Saudara {NAMA_JEMAAT} yang ke-*{USIA}* tahun.

Kiranya Tuhan senantiasa memberkati setiap langkah kehidupanmu, melimpahkan kesehatan, sukacita, damai sejahtera, hikmat, dan penyertaan yang sempurna. 🙏✨

_"Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan."_
*(Yeremia 29:11)*

Tuhan Yesus Memberkati berlimpah-limpah! ❤️

Salam Kasih dalam Kristus,
*{NAMA_GEMBALA}*
*{NAMA_GEREJA}*`,
    isActive: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'TMP-002',
    templateCode: 'TMP_PASTORAL_CARE',
    templateName: 'Salam Rindu Pastoral & Kunjungan',
    templateType: 'PASTORAL',
    bodyText: `Shalom {NAMA_JEMAAT},

Salam kasih dari keluarga besar *{NAMA_GEREJA}*. Kami rindu menyapa Saudara dalam kasih Tuhan Yesus.

Kiranya damai sejahtera dan berkat Tuhan senantiasa melimpah dalam kehidupan keluarga Saudara di {NAMA_COOL}.

Jika ada pokok doa atau kebutuhan pelayanan pastoral, jangan ragu untuk menghubungi sekretariat gereja atau pemimpin COOL Anda.

Tuhan Yesus Memberkati! 🙏`,
    isActive: true,
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  }
];

export const initialWASettings: WASettings = {
  provider: 'META_CLOUD_API',
  phoneNumberId: '109847291837492',
  businessAccountId: '298374829102938',
  apiAccessToken: 'EAAG9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  schedulerSendTime: '08:00',
  timezone: 'Asia/Jakarta',
  isAutoSendEnabled: true,
  isTestMode: false,
  testPhoneNumber: '6281234567801',
  lastSchedulerRun: '2026-08-31T08:00:00+07:00'
};

export const initialWAMessageLogs: WAMessageLog[] = [
  {
    id: 'LOG-2026-001',
    memberId: 'MBR-001',
    recipientName: 'Budi Santoso',
    phoneNumber: '6281234567801',
    messageType: 'BIRTHDAY',
    sendYear: 2026,
    templateId: 'TMP-001',
    messageBody: '🎉 SELAMAT ULANG TAHUN 🎂 Shalom Budi Santoso, Selamat bertambah usia ke-44...',
    status: 'TERKIRIM',
    providerMessageId: 'wamid.HBgNNjI4MTIzNDU2NzgwMQUCABEYEkVFRDFFQjEzMTE4RjAxRkY3MgA=',
    scheduledAt: '2026-08-31T08:00:00+07:00',
    sentAt: '2026-08-31T08:01:14+07:00'
  },
  {
    id: 'LOG-2026-002',
    memberId: 'MBR-002',
    recipientName: 'Siti Maria',
    phoneNumber: '6281234567802',
    messageType: 'BIRTHDAY',
    sendYear: 2026,
    templateId: 'TMP-001',
    messageBody: '🎉 SELAMAT ULANG TAHUN 🎂 Shalom Siti Maria, Selamat bertambah usia ke-40...',
    status: 'TERKIRIM',
    providerMessageId: 'wamid.HBgNNjI4MTIzNDU2NzgwMgUCABEYEkVFRDFFQjEzMTE4RjAxRkY3MwA=',
    scheduledAt: '2026-08-31T08:00:00+07:00',
    sentAt: '2026-08-31T08:01:28+07:00'
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'ACT-001',
    userId: 'USR-001',
    userName: 'Pdt. Yohanes Setiawan (Super Admin)',
    actionType: 'SYSTEM_BOOT',
    entityName: 'system',
    entityId: 'GBI-LOVE-INHIL',
    details: 'Sistem Informasi GBI Love Inhil berjalan dengan status Master Data Terintegrasi.',
    timestamp: '2026-08-31T07:00:00Z'
  },
  {
    id: 'ACT-002',
    userId: 'SYSTEM_SCHEDULER',
    userName: 'Scheduler Server (08:00 WIB)',
    actionType: 'AUTO_SEND_WHATSAPP',
    entityName: 'whatsapp_message_logs',
    entityId: 'LOG-2026-001',
    details: 'Auto Birthday WhatsApp terkirim ke 2 jemaat yang berulang tahun hari ini.',
    timestamp: '2026-08-31T08:01:30Z'
  }
];
