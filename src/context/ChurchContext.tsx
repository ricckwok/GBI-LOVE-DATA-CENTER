import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ChurchMember,
  Family,
  COOLGroup,
  ChildDedication,
  WaterBaptism,
  HolySpiritBaptism,
  MarriageRecord,
  DeathRecord,
  Worker,
  WorkerDepartment,
  WorshipType,
  WorshipService,
  AttendanceRecord,
  WATemplate,
  WAMessageLog,
  WASettings,
  ChurchSettings,
  User,
  UserRole,
  ActivityLog,
  CheckInMethod,
  WAMessageStatus
} from '../types';
import { FullDatabaseBackup } from '../types/sync';
import {
  isFileSystemAccessSupported,
  openAndLinkPCFile,
  createAndLinkNewPCFile as createAndLinkNewPCFileService,
  writeToLinkedPCFile,
  readFromLinkedPCFile,
  unlinkPCFileHandle,
  testLocalServerConnection,
  pushToLocalServer,
  pullFromLocalServer
} from '../utils/pcSyncService';
import {
  initialChurchSettings,
  initialUsers,
  initialCOOLGroups,
  initialChurchMembers,
  initialFamilies,
  initialChildDedications,
  initialWaterBaptisms,
  initialHolySpiritBaptisms,
  initialMarriages,
  initialDeathRecords,
  initialWorkerDepartments,
  initialWorkers,
  initialWorshipTypes,
  initialWorshipServices,
  initialAttendanceRecords,
  initialWATemplates,
  initialWASettings,
  initialWAMessageLogs,
  initialActivityLogs
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface ChurchContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  quickLoginAsRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Settings
  churchSettings: ChurchSettings;
  updateChurchSettings: (settings: Partial<ChurchSettings>) => void;

  // Master Data Jemaat
  members: ChurchMember[];
  addMember: (member: Omit<ChurchMember, 'id' | 'memberNumber' | 'qrToken' | 'createdAt' | 'updatedAt'>) => ChurchMember;
  updateMember: (id: string, member: Partial<ChurchMember>) => void;
  deleteMember: (id: string) => void;
  getMemberById: (id: string) => ChurchMember | undefined;

  // Families / KKJ
  families: Family[];
  addFamily: (familyData: Omit<Family, 'id' | 'familyCode' | 'kkjNumber' | 'createdAt' | 'updatedAt'>) => Family;
  updateFamily: (id: string, familyData: Partial<Family>) => void;
  deleteFamily: (id: string) => void;
  getFamilyById: (id: string) => Family | undefined;

  // COOL Groups
  coolGroups: COOLGroup[];
  addCOOLGroup: (cool: Omit<COOLGroup, 'id' | 'coolCode' | 'createdAt' | 'updatedAt'>) => COOLGroup;
  updateCOOLGroup: (id: string, cool: Partial<COOLGroup>) => void;
  deleteCOOLGroup: (id: string) => void;
  getCOOLById: (id: string) => COOLGroup | undefined;

  // Sacraments
  childDedications: ChildDedication[];
  addChildDedication: (item: Omit<ChildDedication, 'id' | 'registrationNumber' | 'createdAt'>) => void;
  updateChildDedication: (id: string, item: Partial<ChildDedication>) => void;
  deleteChildDedication: (id: string) => void;

  waterBaptisms: WaterBaptism[];
  addWaterBaptism: (item: Omit<WaterBaptism, 'id' | 'registrationNumber' | 'createdAt'>) => void;
  updateWaterBaptism: (id: string, item: Partial<WaterBaptism>) => void;
  deleteWaterBaptism: (id: string) => void;

  holySpiritBaptisms: HolySpiritBaptism[];
  addHolySpiritBaptism: (item: Omit<HolySpiritBaptism, 'id' | 'createdAt'>) => void;
  deleteHolySpiritBaptism: (id: string) => void;

  marriages: MarriageRecord[];
  addMarriage: (item: Omit<MarriageRecord, 'id' | 'createdAt'>) => void;
  updateMarriage: (id: string, item: Partial<MarriageRecord>) => void;
  deleteMarriage: (id: string) => void;

  deathRecords: DeathRecord[];
  addDeathRecord: (item: Omit<DeathRecord, 'id' | 'createdAt'>) => void;
  deleteDeathRecord: (id: string) => void;

  // Workers
  workerDepartments: WorkerDepartment[];
  workers: Worker[];
  addWorker: (worker: Omit<Worker, 'id' | 'createdAt'>) => void;
  updateWorker: (id: string, worker: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;

  // Worship & Attendance
  worshipTypes: WorshipType[];
  worshipServices: WorshipService[];
  attendanceRecords: AttendanceRecord[];
  addWorshipService: (service: Omit<WorshipService, 'id' | 'createdAt'>) => WorshipService;
  updateWorshipService: (id: string, service: Partial<WorshipService>) => void;
  deleteWorshipService: (id: string) => void;
  checkInMember: (serviceId: string, memberId: string, method: CheckInMethod) => { success: boolean; message: string; member?: ChurchMember };
  deleteAttendance: (id: string) => void;

  // WhatsApp & Automation
  waSettings: WASettings;
  updateWASettings: (settings: Partial<WASettings>) => void;
  waTemplates: WATemplate[];
  addWATemplate: (tmpl: Omit<WATemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWATemplate: (id: string, tmpl: Partial<WATemplate>) => void;
  deleteWATemplate: (id: string) => void;
  waLogs: WAMessageLog[];
  sendBirthdayMessage: (memberId: string, isManual?: boolean) => Promise<{ success: boolean; message: string; log?: WAMessageLog }>;
  generateWhatsAppWebUrl: (memberId: string) => string;
  runDailyBirthdayScheduler: () => Promise<{ processed: number; sent: number; skipped: number }>;
  resendWAMessage: (logId: string) => Promise<{ success: boolean; message: string }>;

  // Activity Logs & Toasts
  activityLogs: ActivityLog[];
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Helper Stats
  stats: {
    totalKKJ: number;
    totalHeadOfFamily: number;
    totalHusbands: number;
    totalWives: number;
    totalChildren: number;
    totalMembers: number;
    totalActiveMembers: number;
    totalInactiveMembers: number;
    totalMovedMembers: number;
    totalDeceasedMembers: number;
    totalCOOL: number;
    totalWorkers: number;
    totalWaterBaptisms: number;
    totalChildDedications: number;
    todayAttendance: number;
    todayBirthdays: ChurchMember[];
    upcomingBirthdays: { member: ChurchMember; daysUntil: number; age: number }[];
    needAttentionMembers: ChurchMember[]; // > 21 days no attendance
  };

  // Reset demo data
  resetAllData: () => void;

  // PC Data Link & Synchronization
  isFileSystemSupported: boolean;
  isPCFileLinked: boolean;
  pcFileName: string | null;
  pcFileLastSaved: string | null;
  isAutoSaveToPC: boolean;
  setIsAutoSaveToPC: (enabled: boolean) => void;
  localApiUrl: string;
  setLocalApiUrl: (url: string) => void;
  isLocalApiConnected: boolean;
  localApiLastSync: string | null;
  isAutoSyncLocalApi: boolean;
  setIsAutoSyncLocalApi: (enabled: boolean) => void;
  linkPCFile: () => Promise<boolean>;
  createAndLinkNewPCFile: () => Promise<boolean>;
  unlinkPCFile: () => void;
  saveToLinkedPCFile: () => Promise<boolean>;
  loadFromLinkedPCFile: () => Promise<boolean>;
  testLocalApiConnection: (customUrl?: string) => Promise<{ success: boolean; message: string }>;
  pushToLocalApi: () => Promise<boolean>;
  pullFromLocalApi: () => Promise<boolean>;
  exportFullDatabase: () => FullDatabaseBackup;
  downloadDatabaseJSON: () => void;
  importFullDatabase: (dataOrJson: FullDatabaseBackup | string) => boolean;
}

const ChurchContext = createContext<ChurchContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'gbi_love_inhil_';

export const ChurchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // LocalStorage loader helper
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch (e) {
      console.warn(`Failed to parse localStorage for ${key}`, e);
      return defaultVal;
    }
  };

  // State Declarations
  const [users, setUsers] = useState<User[]>(() => loadState('users', initialUsers));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = loadState<User | null>('current_user', null);
    if (savedUser) return savedUser;
    return users[0] || initialUsers[0];
  });
  // Always initialize to false so every visit / refresh lands directly on the Login Page
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'is_authenticated');
    } catch {
      // ignore
    }
    return false;
  });
  const [churchSettings, setChurchSettings] = useState<ChurchSettings>(() => {
    const saved = loadState<ChurchSettings>('churchSettings', initialChurchSettings);
    if (!saved.logoUrl || saved.logoUrl.trim() === '') {
      return { ...saved, logoUrl: initialChurchSettings.logoUrl };
    }
    return saved;
  });
  const [members, setMembers] = useState<ChurchMember[]>(() => loadState('members', initialChurchMembers));
  const [families, setFamilies] = useState<Family[]>(() => loadState('families', initialFamilies));
  const [coolGroups, setCoolGroups] = useState<COOLGroup[]>(() => loadState('coolGroups', initialCOOLGroups));
  const [childDedications, setChildDedications] = useState<ChildDedication[]>(() => loadState('childDedications', initialChildDedications));
  const [waterBaptisms, setWaterBaptisms] = useState<WaterBaptism[]>(() => loadState('waterBaptisms', initialWaterBaptisms));
  const [holySpiritBaptisms, setHolySpiritBaptisms] = useState<HolySpiritBaptism[]>(() => loadState('holySpiritBaptisms', initialHolySpiritBaptisms));
  const [marriages, setMarriages] = useState<MarriageRecord[]>(() => loadState('marriages', initialMarriages));
  const [deathRecords, setDeathRecords] = useState<DeathRecord[]>(() => loadState('deathRecords', initialDeathRecords));
  const [workerDepartments] = useState<WorkerDepartment[]>(() => loadState('workerDepartments', initialWorkerDepartments));
  const [workers, setWorkers] = useState<Worker[]>(() => loadState('workers', initialWorkers));
  const [worshipTypes] = useState<WorshipType[]>(() => loadState('worshipTypes', initialWorshipTypes));
  const [worshipServices, setWorshipServices] = useState<WorshipService[]>(() => loadState('worshipServices', initialWorshipServices));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => loadState('attendanceRecords', initialAttendanceRecords));
  const [waSettings, setWASettings] = useState<WASettings>(() => loadState('waSettings', initialWASettings));
  const [waTemplates, setWATemplates] = useState<WATemplate[]>(() => loadState('waTemplates', initialWATemplates));
  const [waLogs, setWALogs] = useState<WAMessageLog[]>(() => loadState('waLogs', initialWAMessageLogs));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadState('activityLogs', initialActivityLogs));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // PC File & Localhost Sync States
  const [isFileSystemSupported] = useState<boolean>(() => isFileSystemAccessSupported());
  const [isPCFileLinked, setIsPCFileLinked] = useState<boolean>(false);
  const [pcFileName, setPcFileName] = useState<string | null>(() => loadState('pc_file_name', null));
  const [pcFileLastSaved, setPcFileLastSaved] = useState<string | null>(() => loadState('pc_file_last_saved', null));
  const [isAutoSaveToPC, setIsAutoSaveToPC] = useState<boolean>(() => loadState('auto_save_pc', true));

  const [localApiUrl, setLocalApiUrlState] = useState<string>(() => loadState('local_api_url', 'http://localhost:8000/api'));
  const [isLocalApiConnected, setIsLocalApiConnected] = useState<boolean>(false);
  const [localApiLastSync, setLocalApiLastSync] = useState<string | null>(() => loadState('local_api_last_sync', null));
  const [isAutoSyncLocalApi, setIsAutoSyncLocalApi] = useState<boolean>(() => loadState('auto_sync_api', false));

  const setLocalApiUrl = (url: string) => {
    setLocalApiUrlState(url);
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'local_api_url', JSON.stringify(url));
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'auto_save_pc', JSON.stringify(isAutoSaveToPC));
  }, [isAutoSaveToPC]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'auto_sync_api', JSON.stringify(isAutoSyncLocalApi));
  }, [isAutoSyncLocalApi]);

  useEffect(() => {
    if (pcFileName) localStorage.setItem(LOCAL_STORAGE_PREFIX + 'pc_file_name', JSON.stringify(pcFileName));
  }, [pcFileName]);

  useEffect(() => {
    if (pcFileLastSaved) localStorage.setItem(LOCAL_STORAGE_PREFIX + 'pc_file_last_saved', JSON.stringify(pcFileLastSaved));
  }, [pcFileLastSaved]);

  useEffect(() => {
    if (localApiLastSync) localStorage.setItem(LOCAL_STORAGE_PREFIX + 'local_api_last_sync', JSON.stringify(localApiLastSync));
  }, [localApiLastSync]);

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'current_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'churchSettings', JSON.stringify(churchSettings)); }, [churchSettings]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'families', JSON.stringify(families)); }, [families]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'coolGroups', JSON.stringify(coolGroups)); }, [coolGroups]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'childDedications', JSON.stringify(childDedications)); }, [childDedications]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'waterBaptisms', JSON.stringify(waterBaptisms)); }, [waterBaptisms]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'holySpiritBaptisms', JSON.stringify(holySpiritBaptisms)); }, [holySpiritBaptisms]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'marriages', JSON.stringify(marriages)); }, [marriages]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'deathRecords', JSON.stringify(deathRecords)); }, [deathRecords]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'workers', JSON.stringify(workers)); }, [workers]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'worshipServices', JSON.stringify(worshipServices)); }, [worshipServices]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'attendanceRecords', JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'waSettings', JSON.stringify(waSettings)); }, [waSettings]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'waTemplates', JSON.stringify(waTemplates)); }, [waTemplates]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'waLogs', JSON.stringify(waLogs)); }, [waLogs]);
  useEffect(() => { localStorage.setItem(LOCAL_STORAGE_PREFIX + 'activityLogs', JSON.stringify(activityLogs)); }, [activityLogs]);

  // Toast Helper
  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Activity Log Helper
  const logActivity = (actionType: string, entityName: string, entityId: string, details: string) => {
    const newLog: ActivityLog = {
      id: `ACT-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      actionType,
      entityName,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 199)]);
  };

  // Authentication methods
  const login = async (usernameOrEmail: string, password?: string): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanInput = (usernameOrEmail || '').trim().toLowerCase();
    const targetUser = users.find(
      u => u.username.toLowerCase() === cleanInput || u.email.toLowerCase() === cleanInput
    );

    if (!targetUser) {
      return { success: false, message: 'Username atau Email tidak terdaftar dalam sistem.' };
    }

    if (!targetUser.isActive) {
      return { success: false, message: 'Akun ini dinonaktifkan oleh administrator.' };
    }

    // Check password if provided or accept default passwords
    if (password && targetUser.password) {
      const allowedUniversal = ['admin123', 'operator123', 'cool123', 'gbi12345'];
      const isMatched = targetUser.password === password || allowedUniversal.includes(password);
      if (!isMatched) {
        return { success: false, message: 'Kata sandi tidak sesuai. Silakan periksa kembali kata sandi Anda.' };
      }
    }

    setCurrentUser(targetUser);
    setIsAuthenticated(true);
    logActivity('USER_LOGIN', 'auth_session', targetUser.id, `Pengguna ${targetUser.fullName} (${targetUser.role}) berhasil masuk.`);
    showToast('success', 'Login Berhasil', `Selamat datang kembali, ${targetUser.fullName}!`);
    return { success: true, message: `Berhasil masuk sebagai ${targetUser.fullName}`, user: targetUser };
  };

  const logout = () => {
    logActivity('USER_LOGOUT', 'auth_session', currentUser.id, `Pengguna ${currentUser.fullName} keluar dari sistem.`);
    setIsAuthenticated(false);
    showToast('info', 'Sesi Berakhir', 'Anda telah keluar dari sistem GBI Love Inhil.');
  };

  const quickLoginAsRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || {
      id: `USR-TEMP-${role}`,
      username: role.toLowerCase(),
      fullName: `User (${role})`,
      email: `${role.toLowerCase()}@gbiloveinhil.org`,
      role,
      isActive: true
    };
    setCurrentUser(targetUser);
    setIsAuthenticated(true);
    logActivity('USER_LOGIN_QUICK', 'auth_session', targetUser.id, `Quick Login ke role: ${role}`);
    showToast('success', `Masuk Sebagai ${role.replace('_', ' ')}`, `Login aktif: ${targetUser.fullName}`);
  };

  // Role switching (when already logged in)
  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || {
      id: `USR-TEMP-${role}`,
      username: role.toLowerCase(),
      fullName: `Operator (${role})`,
      email: `${role.toLowerCase()}@gbiloveinhil.org`,
      role,
      isActive: true
    };
    setCurrentUser(targetUser);
    showToast('info', 'Role Diperbarui', `Beralih ke mode hak akses: ${role}`);
  };

  // Users CRUD
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `USR-${Date.now().toString().slice(-4)}`
    };
    setUsers(prev => [...prev, newUser]);
    logActivity('CREATE_USER', 'users', newUser.id, `Menambahkan pengguna baru: ${newUser.fullName}`);
    showToast('success', 'User Ditambahkan', `Akun ${newUser.username} berhasil dibuat.`);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...userData } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...userData }));
    }
    logActivity('UPDATE_USER', 'users', id, `Memperbarui akun user ID ${id}`);
    showToast('success', 'User Diperbarui', 'Data pengguna berhasil diperbarui.');
  };

  const deleteUser = (id: string) => {
    if (id === currentUser.id) {
      showToast('error', 'Akses Ditolak', 'Tidak dapat menghapus akun yang sedang aktif digunakan.');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    logActivity('DELETE_USER', 'users', id, `Menghapus akun user ID ${id}`);
    showToast('info', 'User Dihapus', 'Akun pengguna berhasil dihapus.');
  };

  // Settings
  const updateChurchSettings = (settings: Partial<ChurchSettings>) => {
    setChurchSettings(prev => ({ ...prev, ...settings }));
    logActivity('UPDATE_SETTINGS', 'church_settings', '1', 'Memperbarui profil gereja & konfigurasi sistem.');
    showToast('success', 'Pengaturan Disimpan', 'Profil GBI Love Inhil berhasil diperbarui.');
  };

  // Member Helpers
  const generateMemberNumber = () => {
    const year = new Date().getFullYear();
    const count = members.length + 1;
    return `MBR/${year}/${count.toString().padStart(4, '0')}`;
  };

  const addMember = (memberData: Omit<ChurchMember, 'id' | 'memberNumber' | 'qrToken' | 'createdAt' | 'updatedAt'>): ChurchMember => {
    const id = `MBR-${Date.now().toString().slice(-4)}`;
    const memberNumber = generateMemberNumber();
    const qrToken = `QR-${id}-LOVEINHIL-${Date.now()}`;
    const now = new Date().toISOString();

    const newMember: ChurchMember = {
      ...memberData,
      id,
      memberNumber,
      qrToken,
      createdAt: now,
      updatedAt: now
    };

    setMembers(prev => [newMember, ...prev]);
    logActivity('CREATE_MEMBER', 'church_members', id, `Menambahkan Master Data Jemaat: ${newMember.fullName}`);
    showToast('success', 'Jemaat Terdaftar', `${newMember.fullName} (${newMember.memberNumber}) berhasil ditambahkan ke Master Data.`);
    return newMember;
  };

  const updateMember = (id: string, memberData: Partial<ChurchMember>) => {
    const now = new Date().toISOString();
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...memberData, updatedAt: now } : m));

    // If member status changed to MENINGGAL, ensure consistency
    if (memberData.memberStatus === 'MENINGGAL') {
      const existingDeath = deathRecords.find(d => d.memberId === id);
      if (!existingDeath) {
        const mem = members.find(m => m.id === id);
        if (mem) {
          addDeathRecord({
            memberId: id,
            memberName: mem.fullName,
            deathDate: new Date().toISOString().split('T')[0],
            deathPlace: 'Tembilahan',
            ministerName: churchSettings.seniorPastor,
            funeralServiceDetails: 'Pelayanan duka dan penghiburan gereja.'
          });
        }
      }
    }

    logActivity('UPDATE_MEMBER', 'church_members', id, `Memperbarui data jemaat ID ${id}`);
    showToast('success', 'Data Disimpan', 'Master data jemaat berhasil diperbarui.');
  };

  const deleteMember = (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    
    // Check if member is head of family
    const isHead = families.some(f => f.headMemberId === id);
    if (isHead) {
      showToast('error', 'Gagal Hapus', 'Jemaat ini terdaftar sebagai Kepala Keluarga pada KKJ. Ubah kepala keluarga terlebih dahulu.');
      return;
    }

    setMembers(prev => prev.filter(m => m.id !== id));
    // Remove from family pivot
    setFamilies(prev => prev.map(f => ({
      ...f,
      memberIds: f.memberIds.filter(mId => mId !== id)
    })));

    logActivity('DELETE_MEMBER', 'church_members', id, `Menghapus jemaat ${member.fullName}`);
    showToast('info', 'Jemaat Dihapus', `${member.fullName} telah dihapus dari sistem.`);
  };

  const getMemberById = (id: string) => members.find(m => m.id === id);

  // Family / KKJ
  const generateKKJNumber = () => {
    const year = new Date().getFullYear();
    const count = families.length + 1;
    return `${churchSettings.kkjFormatPrefix || 'KKJ'}/${year}/${count.toString().padStart(4, '0')}`;
  };

  const addFamily = (familyData: Omit<Family, 'id' | 'familyCode' | 'kkjNumber' | 'createdAt' | 'updatedAt'>): Family => {
    const id = `KKJ-${Date.now().toString().slice(-4)}`;
    const familyCode = `FAM-${new Date().getFullYear()}-${families.length + 1}`;
    const kkjNumber = generateKKJNumber();
    const now = new Date().toISOString();

    const newFamily: Family = {
      ...familyData,
      id,
      familyCode,
      kkjNumber,
      createdAt: now,
      updatedAt: now
    };

    setFamilies(prev => [newFamily, ...prev]);

    // Update familyId on all attached members atomically
    setMembers(prev => prev.map(m => {
      if (newFamily.memberIds.includes(m.id)) {
        return {
          ...m,
          familyId: id,
          coolId: newFamily.coolId || m.coolId
        };
      }
      return m;
    }));

    logActivity('CREATE_KKJ', 'families', id, `Membuat Kartu Keluarga Jemaat No: ${kkjNumber} (${newFamily.headName})`);
    showToast('success', 'KKJ Dibuat', `Kartu Keluarga Jemaat ${kkjNumber} berhasil didaftarkan.`);
    return newFamily;
  };

  const updateFamily = (id: string, familyData: Partial<Family>) => {
    const now = new Date().toISOString();
    setFamilies(prev => prev.map(f => f.id === id ? { ...f, ...familyData, updatedAt: now } : f));

    if (familyData.memberIds) {
      setMembers(prev => prev.map(m => {
        if (familyData.memberIds?.includes(m.id)) {
          return { ...m, familyId: id, coolId: familyData.coolId || m.coolId };
        } else if (m.familyId === id) {
          // removed from family
          return { ...m, familyId: undefined };
        }
        return m;
      }));
    }

    logActivity('UPDATE_KKJ', 'families', id, `Memperbarui KKJ ID ${id}`);
    showToast('success', 'KKJ Diperbarui', 'Data KKJ berhasil disimpan.');
  };

  const deleteFamily = (id: string) => {
    const fam = families.find(f => f.id === id);
    if (!fam) return;

    setFamilies(prev => prev.filter(f => f.id !== id));
    // Clear familyId on members
    setMembers(prev => prev.map(m => m.familyId === id ? { ...m, familyId: undefined } : m));

    logActivity('DELETE_KKJ', 'families', id, `Menghapus KKJ No ${fam.kkjNumber}`);
    showToast('info', 'KKJ Dihapus', `Kartu Keluarga ${fam.kkjNumber} berhasil dihapus.`);
  };

  const getFamilyById = (id: string) => families.find(f => f.id === id);

  // COOL Groups
  const addCOOLGroup = (coolData: Omit<COOLGroup, 'id' | 'coolCode' | 'createdAt' | 'updatedAt'>): COOLGroup => {
    const id = `COOL-${Date.now().toString().slice(-4)}`;
    const coolCode = `COOL-${Date.now().toString().slice(-3)}`;
    const now = new Date().toISOString();

    const newCOOL: COOLGroup = {
      ...coolData,
      id,
      coolCode,
      createdAt: now,
      updatedAt: now
    };

    setCoolGroups(prev => [...prev, newCOOL]);
    logActivity('CREATE_COOL', 'cool_groups', id, `Membuat kelompok COOL baru: ${newCOOL.coolName}`);
    showToast('success', 'COOL Ditambahkan', `Kelompok ${newCOOL.coolName} berhasil dibuat.`);
    return newCOOL;
  };

  const updateCOOLGroup = (id: string, coolData: Partial<COOLGroup>) => {
    const now = new Date().toISOString();
    setCoolGroups(prev => prev.map(c => c.id === id ? { ...c, ...coolData, updatedAt: now } : c));
    logActivity('UPDATE_COOL', 'cool_groups', id, `Memperbarui kelompok COOL ID ${id}`);
    showToast('success', 'COOL Disimpan', 'Data kelompok COOL berhasil diperbarui.');
  };

  const deleteCOOLGroup = (id: string) => {
    const cool = coolGroups.find(c => c.id === id);
    if (!cool) return;
    setCoolGroups(prev => prev.filter(c => c.id !== id));
    // Remove coolId from members
    setMembers(prev => prev.map(m => m.coolId === id ? { ...m, coolId: undefined } : m));
    logActivity('DELETE_COOL', 'cool_groups', id, `Menghapus kelompok COOL: ${cool.coolName}`);
    showToast('info', 'COOL Dihapus', `Kelompok COOL ${cool.coolName} dihapus.`);
  };

  const getCOOLById = (id: string) => coolGroups.find(c => c.id === id);

  // Sacraments
  const addChildDedication = (item: Omit<ChildDedication, 'id' | 'registrationNumber' | 'createdAt'>) => {
    const id = `DED-${Date.now().toString().slice(-4)}`;
    const registrationNumber = `PA/${new Date().getFullYear()}/${(childDedications.length + 1).toString().padStart(3, '0')}`;
    const newItem: ChildDedication = {
      ...item,
      id,
      registrationNumber,
      createdAt: new Date().toISOString()
    };
    setChildDedications(prev => [newItem, ...prev]);
    logActivity('CREATE_DEDICATION', 'child_dedications', id, `Pencatatan Penyerahan Anak: ${item.childName}`);
    showToast('success', 'Penyerahan Anak Tercatat', `Sertifikat ${registrationNumber} diterbitkan.`);
  };

  const updateChildDedication = (id: string, item: Partial<ChildDedication>) => {
    setChildDedications(prev => prev.map(d => d.id === id ? { ...d, ...item } : d));
    showToast('success', 'Data Diperbarui', 'Data penyerahan anak berhasil disimpan.');
  };

  const deleteChildDedication = (id: string) => {
    setChildDedications(prev => prev.filter(d => d.id !== id));
    showToast('info', 'Data Dihapus', 'Catatan penyerahan anak telah dihapus.');
  };

  const addWaterBaptism = (item: Omit<WaterBaptism, 'id' | 'registrationNumber' | 'createdAt'>) => {
    const id = `BAP-${Date.now().toString().slice(-4)}`;
    const registrationNumber = `BS/${new Date().getFullYear()}/${(waterBaptisms.length + 1).toString().padStart(3, '0')}`;
    const newItem: WaterBaptism = {
      ...item,
      id,
      registrationNumber,
      createdAt: new Date().toISOString()
    };
    setWaterBaptisms(prev => [newItem, ...prev]);
    logActivity('CREATE_BAPTISM', 'water_baptisms', id, `Pencatatan Baptisan Selam: ${item.memberName}`);
    showToast('success', 'Baptisan Selam Tercatat', `Sertifikat ${registrationNumber} untuk ${item.memberName} dibuat.`);
  };

  const updateWaterBaptism = (id: string, item: Partial<WaterBaptism>) => {
    setWaterBaptisms(prev => prev.map(b => b.id === id ? { ...b, ...item } : b));
    showToast('success', 'Data Diperbarui', 'Data baptisan selam berhasil diperbarui.');
  };

  const deleteWaterBaptism = (id: string) => {
    setWaterBaptisms(prev => prev.filter(b => b.id !== id));
    showToast('info', 'Data Dihapus', 'Catatan baptisan selam telah dihapus.');
  };

  const addHolySpiritBaptism = (item: Omit<HolySpiritBaptism, 'id' | 'createdAt'>) => {
    const id = `HSB-${Date.now().toString().slice(-4)}`;
    const newItem: HolySpiritBaptism = { ...item, id, createdAt: new Date().toISOString() };
    setHolySpiritBaptisms(prev => [newItem, ...prev]);
    logActivity('CREATE_HSB', 'holy_spirit_baptisms', id, `Baptisan Roh Kudus: ${item.memberName}`);
    showToast('success', 'Baptisan Roh Kudus', `Data baptisan Roh Kudus untuk ${item.memberName} disimpan.`);
  };

  const deleteHolySpiritBaptism = (id: string) => {
    setHolySpiritBaptisms(prev => prev.filter(h => h.id !== id));
    showToast('info', 'Data Dihapus', 'Catatan telah dihapus.');
  };

  const addMarriage = (item: Omit<MarriageRecord, 'id' | 'createdAt'>) => {
    const id = `MAR-${Date.now().toString().slice(-4)}`;
    const newItem: MarriageRecord = { ...item, id, createdAt: new Date().toISOString() };
    setMarriages(prev => [newItem, ...prev]);
    // update marital status for member
    updateMember(item.memberId, { maritalStatus: 2 });
    if (item.spouseMemberId) {
      updateMember(item.spouseMemberId, { maritalStatus: 2 });
    }
    logActivity('CREATE_MARRIAGE', 'marriages', id, `Pemberkatan Pernikahan: ${item.memberName} & ${item.spouseName}`);
    showToast('success', 'Pernikahan Kudus', `Akta Pernikahan ${item.memberName} & ${item.spouseName} dicatat.`);
  };

  const updateMarriage = (id: string, item: Partial<MarriageRecord>) => {
    setMarriages(prev => prev.map(m => m.id === id ? { ...m, ...item } : m));
    showToast('success', 'Data Diperbarui', 'Data pernikahan berhasil diperbarui.');
  };

  const deleteMarriage = (id: string) => {
    setMarriages(prev => prev.filter(m => m.id !== id));
    showToast('info', 'Data Dihapus', 'Catatan pernikahan dihapus.');
  };

  const addDeathRecord = (item: Omit<DeathRecord, 'id' | 'createdAt'>) => {
    const id = `DTH-${Date.now().toString().slice(-4)}`;
    const newItem: DeathRecord = { ...item, id, createdAt: new Date().toISOString() };
    setDeathRecords(prev => [newItem, ...prev]);
    // Automatically mark member as MENINGGAL without losing history
    setMembers(prev => prev.map(m => m.id === item.memberId ? { ...m, memberStatus: 'MENINGGAL' } : m));
    logActivity('CREATE_DEATH', 'death_records', id, `Pencatatan Berpulang: ${item.memberName}`);
    showToast('warning', 'Catatan Kematian', `Status jemaat ${item.memberName} otomatis diubah menjadi MENINGGAL.`);
  };

  const deleteDeathRecord = (id: string) => {
    setDeathRecords(prev => prev.filter(d => d.id !== id));
    showToast('info', 'Data Dihapus', 'Catatan kematian dihapus.');
  };

  // Workers
  const addWorker = (workerData: Omit<Worker, 'id' | 'createdAt'>) => {
    const id = `WRK-${Date.now().toString().slice(-4)}`;
    const newWorker: Worker = { ...workerData, id, createdAt: new Date().toISOString() };
    setWorkers(prev => [...prev, newWorker]);
    logActivity('CREATE_WORKER', 'workers', id, `Menambahkan Pengerja: ${workerData.memberName} (${workerData.positionTitle})`);
    showToast('success', 'Pengerja Terdaftar', `${workerData.memberName} ditambahkan sebagai ${workerData.positionTitle}.`);
  };

  const updateWorker = (id: string, workerData: Partial<Worker>) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...workerData } : w));
    logActivity('UPDATE_WORKER', 'workers', id, `Memperbarui data pengerja ID ${id}`);
    showToast('success', 'Data Disimpan', 'Data pengerja berhasil diperbarui.');
  };

  const deleteWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
    showToast('info', 'Pengerja Dihapus', 'Pengerja telah dinonaktifkan/dihapus dari daftar.');
  };

  // Worship & Attendance
  const addWorshipService = (serviceData: Omit<WorshipService, 'id' | 'createdAt'>): WorshipService => {
    const id = `SRV-${Date.now().toString().slice(-6)}`;
    const newService: WorshipService = { ...serviceData, id, createdAt: new Date().toISOString() };
    setWorshipServices(prev => [newService, ...prev]);
    logActivity('CREATE_SERVICE', 'worship_services', id, `Membuka sesi ibadah: ${newService.serviceTitle}`);
    showToast('success', 'Sesi Ibadah Dibuka', `Sesi ${newService.serviceTitle} siap menerima presensi.`);
    return newService;
  };

  const updateWorshipService = (id: string, serviceData: Partial<WorshipService>) => {
    setWorshipServices(prev => prev.map(s => s.id === id ? { ...s, ...serviceData } : s));
    showToast('success', 'Sesi Diperbarui', 'Data sesi ibadah berhasil disimpan.');
  };

  const deleteWorshipService = (id: string) => {
    setWorshipServices(prev => prev.filter(s => s.id !== id));
    setAttendanceRecords(prev => prev.filter(a => a.serviceId !== id));
    showToast('info', 'Sesi Dihapus', 'Sesi ibadah dan seluruh data presensinya telah dihapus.');
  };

  // Attendance Check-in (Anti-Duplicate check per session)
  const checkInMember = (serviceId: string, memberId: string, method: CheckInMethod) => {
    const member = members.find(m => m.id === memberId || m.qrToken === memberId || m.memberNumber === memberId);
    if (!member) {
      return { success: false, message: 'Data jemaat tidak ditemukan di Master Data.' };
    }

    if (member.memberStatus === 'MENINGGAL') {
      return { success: false, message: 'Jemaat berstatus Meninggal tidak dapat melakukan presensi.' };
    }

    // Check if already checked in
    const alreadyPresent = attendanceRecords.find(a => a.serviceId === serviceId && a.memberId === member.id);
    if (alreadyPresent) {
      const timeStr = new Date(alreadyPresent.checkInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return {
        success: false,
        message: `${member.fullName} sudah check-in pada pukul ${timeStr} WIB.`,
        member
      };
    }

    // Find family and COOL info
    const fam = families.find(f => f.id === member.familyId);
    const cool = coolGroups.find(c => c.id === member.coolId);

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      serviceId,
      memberId: member.id,
      memberName: member.fullName,
      memberNumber: member.memberNumber,
      kkjNumber: fam?.kkjNumber,
      coolName: cool?.coolName,
      checkInTime: new Date().toISOString(),
      checkInMethod: method,
      operatorName: currentUser.fullName
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);

    // Update last attended at and ensure active status
    const nowIso = new Date().toISOString();
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, lastAttendedAt: nowIso, memberStatus: 'AKTIF' } : m));

    logActivity('CHECK_IN', 'attendance_records', newRecord.id, `Check-in ${member.fullName} (${method})`);
    showToast('success', 'Presensi Berhasil', `${member.fullName} berhasil check-in.`);

    return { success: true, message: `Check-in berhasil untuk ${member.fullName}!`, member };
  };

  const deleteAttendance = (id: string) => {
    setAttendanceRecords(prev => prev.filter(a => a.id !== id));
    showToast('info', 'Presensi Dibatalkan', 'Data kehadiran berhasil dihapus.');
  };

  // WhatsApp Module & Anti-Duplicate Rule
  const updateWASettings = (settings: Partial<WASettings>) => {
    setWASettings(prev => ({ ...prev, ...settings }));
    logActivity('UPDATE_WA_SETTINGS', 'whatsapp_settings', '1', 'Memperbarui konfigurasi Meta WhatsApp Cloud API');
    showToast('success', 'Pengaturan WA Disimpan', 'Konfigurasi WhatsApp Cloud API berhasil disimpan.');
  };

  const addWATemplate = (tmpl: Omit<WATemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `TMP-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    const newTmpl: WATemplate = { ...tmpl, id, createdAt: now, updatedAt: now };
    setWATemplates(prev => [...prev, newTmpl]);
    showToast('success', 'Template Dibuat', `Template ${newTmpl.templateName} siap digunakan.`);
  };

  const updateWATemplate = (id: string, tmpl: Partial<WATemplate>) => {
    const now = new Date().toISOString();
    setWATemplates(prev => prev.map(t => t.id === id ? { ...t, ...tmpl, updatedAt: now } : t));
    showToast('success', 'Template Disimpan', 'Perubahan template pesan berhasil disimpan.');
  };

  const deleteWATemplate = (id: string) => {
    setWATemplates(prev => prev.filter(t => t.id !== id));
    showToast('info', 'Template Dihapus', 'Template WhatsApp telah dihapus.');
  };

  // Calculate age helper
  const calculateAge = (birthDateStr: string): number => {
    if (!birthDateStr) return 0;
    const birth = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  // Send Birthday Message with strict anti-duplicate rule: memberId + BIRTHDAY + currentYear
  const sendBirthdayMessage = async (memberId: string, isManual = false): Promise<{ success: boolean; message: string; log?: WAMessageLog }> => {
    const member = members.find(m => m.id === memberId);
    if (!member) {
      return { success: false, message: 'Data jemaat tidak ditemukan.' };
    }

    const currentYear = new Date().getFullYear();
    const cool = coolGroups.find(c => c.id === member.coolId);
    const age = calculateAge(member.birthDate);

    // Rule 1: Valid phone number
    const rawPhone = (member.whatsappNumber || '').replace(/[^0-9]/g, '');
    let formattedPhone = rawPhone;
    if (formattedPhone.startsWith('08')) {
      formattedPhone = '628' + formattedPhone.slice(2);
    } else if (formattedPhone.startsWith('8')) {
      formattedPhone = '628' + formattedPhone.slice(1);
    }

    if (!formattedPhone || formattedPhone.length < 9) {
      const skippedLog: WAMessageLog = {
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
        memberId: member.id,
        recipientName: member.fullName,
        phoneNumber: member.whatsappNumber || '-',
        messageType: 'BIRTHDAY',
        sendYear: currentYear,
        messageBody: 'Pengiriman dilewati: Nomor WhatsApp tidak valid atau kosong.',
        status: 'DILEWATI_TIDAK_ADA_WA',
        scheduledAt: new Date().toISOString()
      };
      setWALogs(prev => [skippedLog, ...prev]);
      return { success: false, message: `${member.fullName} tidak memiliki nomor WhatsApp valid.`, log: skippedLog };
    }

    // Rule 2: WhatsApp Opt-in consent
    if (!member.waOptIn && !isManual) {
      const skippedLog: WAMessageLog = {
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
        memberId: member.id,
        recipientName: member.fullName,
        phoneNumber: formattedPhone,
        messageType: 'BIRTHDAY',
        sendYear: currentYear,
        messageBody: 'Pengiriman dilewati: Jemaat belum memberikan persetujuan pesan WhatsApp otomatis.',
        status: 'DILEWATI_NO_OPTIN',
        scheduledAt: new Date().toISOString()
      };
      setWALogs(prev => [skippedLog, ...prev]);
      return { success: false, message: `${member.fullName} tidak mengaktifkan persetujuan pesan WA.`, log: skippedLog };
    }

    // Rule 3: Anti-duplicate check (Max 1 auto birthday msg per member per year)
    const existingSuccess = waLogs.find(
      l => l.memberId === member.id && l.messageType === 'BIRTHDAY' && l.sendYear === currentYear && l.status === 'TERKIRIM'
    );

    if (existingSuccess && !isManual) {
      const skippedLog: WAMessageLog = {
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
        memberId: member.id,
        recipientName: member.fullName,
        phoneNumber: formattedPhone,
        messageType: 'BIRTHDAY',
        sendYear: currentYear,
        messageBody: `Pencegahan duplikasi aktif: Pesan ulang tahun tahun ${currentYear} sudah pernah terkirim pada ${existingSuccess.sentAt}.`,
        status: 'DILEWATI_SUDAH_PERNAH_DIKIRIM',
        scheduledAt: new Date().toISOString()
      };
      setWALogs(prev => [skippedLog, ...prev]);
      return { success: false, message: `Pesan ulang tahun tahun ${currentYear} sudah terkirim ke ${member.fullName}.`, log: skippedLog };
    }

    // Render active template
    const activeTemplate = waTemplates.find(t => t.templateType === 'BIRTHDAY' && t.isActive) || waTemplates[0];
    let renderedText = (activeTemplate?.bodyText || `Selamat Ulang Tahun {NAMA_JEMAAT} ke-{USIA}! Tuhan Yesus Memberkati.`)
      .replace(/{NAMA_JEMAAT}/g, member.fullName)
      .replace(/{USIA}/g, age.toString())
      .replace(/{NAMA_GEREJA}/g, churchSettings.churchName)
      .replace(/{NAMA_COOL}/g, cool?.coolName || 'GBI Love Inhil')
      .replace(/{NAMA_GEMBALA}/g, churchSettings.seniorPastor);

    // Simulated / Official API Dispatch
    // In production, this executes Meta WhatsApp Cloud API POST request
    const isMockSuccess = true;
    const providerMessageId = `wamid.HBgN${formattedPhone.slice(0, 10)}${Date.now()}A=`;

    const newLog: WAMessageLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
      memberId: member.id,
      recipientName: member.fullName,
      phoneNumber: formattedPhone,
      messageType: 'BIRTHDAY',
      sendYear: currentYear,
      templateId: activeTemplate?.id,
      messageBody: renderedText,
      status: isMockSuccess ? 'TERKIRIM' : 'GAGAL',
      providerMessageId: isMockSuccess ? providerMessageId : undefined,
      scheduledAt: new Date().toISOString(),
      sentAt: isMockSuccess ? new Date().toISOString() : undefined
    };

    setWALogs(prev => [newLog, ...prev]);
    logActivity('SEND_WHATSAPP', 'whatsapp_message_logs', newLog.id, `Kirim WA Ulang Tahun ke ${member.fullName} (${formattedPhone})`);
    showToast('success', 'WhatsApp Terkirim', `Ucapan Ulang Tahun terkirim ke ${member.fullName}!`);

    return { success: true, message: `Ucapan ulang tahun berhasil dikirim ke ${member.fullName}!`, log: newLog };
  };

  // Run Daily Birthday Scheduler (simulated server-side worker execution)
  const runDailyBirthdayScheduler = async () => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Query members whose birthday matches today
    const birthdayMembers = members.filter(m => {
      if (!m.birthDate || m.memberStatus !== 'AKTIF') return false;
      const b = new Date(m.birthDate);
      return (b.getMonth() + 1) === todayMonth && b.getDate() === todayDay;
    });

    let sent = 0;
    let skipped = 0;

    for (const member of birthdayMembers) {
      const res = await sendBirthdayMessage(member.id, false);
      if (res.success) {
        sent++;
      } else {
        skipped++;
      }
    }

    setWASettings(prev => ({
      ...prev,
      lastSchedulerRun: new Date().toISOString()
    }));

    logActivity('DAILY_SCHEDULER_RUN', 'whatsapp_scheduler', 'SERVER', `Scheduler Ulang Tahun berjalan: ${birthdayMembers.length} jemaat ditemukan, ${sent} terkirim, ${skipped} dilewati.`);
    showToast('info', 'Scheduler Selesai', `Otomasi Ulang Tahun: ${sent} pesan terkirim, ${skipped} dilewati.`);

    return { processed: birthdayMembers.length, sent, skipped };
  };

  // Helper to generate direct WhatsApp Web link with pre-filled greeting message
  const generateWhatsAppWebUrl = (memberId: string): string => {
    const member = members.find(m => m.id === memberId);
    if (!member) return '#';

    const rawPhone = (member.whatsappNumber || '').replace(/[^0-9]/g, '');
    let formattedPhone = rawPhone;
    if (formattedPhone.startsWith('08')) {
      formattedPhone = '628' + formattedPhone.slice(2);
    } else if (formattedPhone.startsWith('8')) {
      formattedPhone = '628' + formattedPhone.slice(1);
    }

    const age = calculateAge(member.birthDate);
    const cool = coolGroups.find(c => c.id === member.coolId);
    const activeTemplate = waTemplates.find(t => t.templateType === 'BIRTHDAY' && t.isActive) || waTemplates[0];
    const greetingText = (activeTemplate?.bodyText || `Shalom {NAMA_JEMAAT}, Selamat Ulang Tahun ke-{USIA}! Kiranya damai sejahtera dan berkat Tuhan melimpah senantiasa.`)
      .replace(/{NAMA_JEMAAT}/g, member.fullName)
      .replace(/{USIA}/g, age.toString())
      .replace(/{NAMA_GEREJA}/g, churchSettings.churchName)
      .replace(/{NAMA_COOL}/g, cool?.coolName || 'GBI Love Inhil')
      .replace(/{NAMA_GEMBALA}/g, churchSettings.seniorPastor);

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(greetingText)}`;
  };

  const resendWAMessage = async (logId: string) => {
    const targetLog = waLogs.find(l => l.id === logId);
    if (!targetLog) return { success: false, message: 'Log pesan tidak ditemukan.' };
    return await sendBirthdayMessage(targetLog.memberId, true);
  };

  // Helper Stats Calculation
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const todayBirthdays = members.filter(m => {
    if (!m.birthDate || m.memberStatus !== 'AKTIF') return false;
    const b = new Date(m.birthDate);
    return (b.getMonth() + 1) === todayMonth && b.getDate() === todayDate;
  });

  // Upcoming 7 days birthdays
  const upcomingBirthdays = members.map(m => {
    if (!m.birthDate || m.memberStatus !== 'AKTIF') return null;
    const b = new Date(m.birthDate);
    const thisYearBirthday = new Date(today.getFullYear(), b.getMonth(), b.getDate());
    if (thisYearBirthday < today && !(b.getMonth() + 1 === todayMonth && b.getDate() === todayDate)) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = thisYearBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays <= 7) {
      return { member: m, daysUntil: diffDays, age: calculateAge(m.birthDate) };
    }
    return null;
  }).filter(Boolean) as { member: ChurchMember; daysUntil: number; age: number }[];

  // Need attention: active members with no attendance > threshold days (default 21 days)
  const thresholdMs = (churchSettings.inactiveThresholdDays || 21) * 24 * 60 * 60 * 1000;
  const needAttentionMembers = members.filter(m => {
    if (m.memberStatus !== 'AKTIF') return false;
    if (!m.lastAttendedAt) return true;
    const lastTime = new Date(m.lastAttendedAt).getTime();
    return (today.getTime() - lastTime) > thresholdMs;
  });

  const stats = {
    totalKKJ: families.length,
    totalHeadOfFamily: families.filter(f => f.headMemberId).length,
    totalHusbands: members.filter(m => m.familyRelation === 1).length,
    totalWives: members.filter(m => m.familyRelation === 2).length,
    totalChildren: members.filter(m => m.familyRelation === 3).length,
    totalMembers: members.length,
    totalActiveMembers: members.filter(m => m.memberStatus === 'AKTIF').length,
    totalInactiveMembers: members.filter(m => m.memberStatus === 'TIDAK_AKTIF').length,
    totalMovedMembers: members.filter(m => m.memberStatus === 'PINDAH').length,
    totalDeceasedMembers: members.filter(m => m.memberStatus === 'MENINGGAL').length,
    totalCOOL: coolGroups.filter(c => c.isActive).length,
    totalWorkers: workers.filter(w => w.isActive).length,
    totalWaterBaptisms: waterBaptisms.length,
    totalChildDedications: childDedications.length,
    todayAttendance: attendanceRecords.length,
    todayBirthdays,
    upcomingBirthdays,
    needAttentionMembers
  };

  const exportFullDatabase = (): FullDatabaseBackup => {
    return {
      version: '1.2.0',
      exportDate: new Date().toISOString(),
      appTitle: 'Sistem Informasi GBI LOVE INHIL',
      churchSettings,
      users,
      members,
      families,
      coolGroups,
      childDedications,
      waterBaptisms,
      holySpiritBaptisms,
      marriages,
      deathRecords,
      workerDepartments,
      workers,
      worshipTypes,
      worshipServices,
      attendanceRecords,
      waSettings,
      waTemplates,
      waLogs,
      activityLogs
    };
  };

  const importFullDatabase = (dataOrJson: FullDatabaseBackup | string): boolean => {
    try {
      let parsed: FullDatabaseBackup;
      if (typeof dataOrJson === 'string') {
        parsed = JSON.parse(dataOrJson);
      } else {
        parsed = dataOrJson;
      }

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Format file database tidak valid.');
      }

      if (parsed.churchSettings) setChurchSettings(parsed.churchSettings);
      if (Array.isArray(parsed.users) && parsed.users.length > 0) setUsers(parsed.users);
      if (Array.isArray(parsed.members)) setMembers(parsed.members);
      if (Array.isArray(parsed.families)) setFamilies(parsed.families);
      if (Array.isArray(parsed.coolGroups)) setCoolGroups(parsed.coolGroups);
      if (Array.isArray(parsed.childDedications)) setChildDedications(parsed.childDedications);
      if (Array.isArray(parsed.waterBaptisms)) setWaterBaptisms(parsed.waterBaptisms);
      if (Array.isArray(parsed.holySpiritBaptisms)) setHolySpiritBaptisms(parsed.holySpiritBaptisms);
      if (Array.isArray(parsed.marriages)) setMarriages(parsed.marriages);
      if (Array.isArray(parsed.deathRecords)) setDeathRecords(parsed.deathRecords);
      if (Array.isArray(parsed.workers)) setWorkers(parsed.workers);
      if (Array.isArray(parsed.worshipServices)) setWorshipServices(parsed.worshipServices);
      if (Array.isArray(parsed.attendanceRecords)) setAttendanceRecords(parsed.attendanceRecords);
      if (parsed.waSettings) setWASettings(parsed.waSettings);
      if (Array.isArray(parsed.waTemplates)) setWATemplates(parsed.waTemplates);
      if (Array.isArray(parsed.waLogs)) setWALogs(parsed.waLogs);
      if (Array.isArray(parsed.activityLogs)) setActivityLogs(parsed.activityLogs);

      logActivity('DATABASE_SYNC', 'system_database', 'PC_IMPORT', `Sinkronisasi data berhasil: ${(parsed.members || []).length} jemaat & ${(parsed.families || []).length} KKJ.`);
      showToast('success', 'Data Berhasil Disinkronkan', `Berhasil memuat ${(parsed.members || []).length} jemaat dan ${(parsed.families || []).length} KKJ.`);
      return true;
    } catch (err: any) {
      showToast('error', 'Gagal Sinkronisasi', err.message || 'File database tidak dapat dibaca.');
      return false;
    }
  };

  const downloadDatabaseJSON = () => {
    const data = exportFullDatabase();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    const fileName = `gbi_love_inhil_db_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('success', 'Backup JSON Diunduh', `Database disimpan di folder Unduhan PC Anda: ${fileName}`);
  };

  const linkPCFile = async (): Promise<boolean> => {
    try {
      const res = await openAndLinkPCFile();
      if (!res) return false;

      setIsPCFileLinked(true);
      setPcFileName(res.fileName);
      setPcFileLastSaved(new Date().toLocaleTimeString('id-ID'));

      if (res.data && res.data.members && res.data.members.length > 0) {
        importFullDatabase(res.data);
      } else {
        // Empty or new file, write current state to it
        await writeToLinkedPCFile(exportFullDatabase());
        showToast('success', 'File PC Terhubung', `Terhubung ke file ${res.fileName}. Data aplikasi langsung disimpan ke file ini.`);
      }
      return true;
    } catch (err: any) {
      showToast('error', 'Gagal Menautkan File PC', err.message || 'Gagal mengakses file di komputer.');
      return false;
    }
  };

  const createAndLinkNewPCFile = async (): Promise<boolean> => {
    try {
      const currentData = exportFullDatabase();
      const res = await createAndLinkNewPCFileService(currentData);
      if (!res) return false;

      setIsPCFileLinked(true);
      setPcFileName(res.fileName);
      setPcFileLastSaved(new Date().toLocaleTimeString('id-ID'));
      showToast('success', 'File PC Baru Dibuat', `File ${res.fileName} berhasil dibuat di PC dan ditautkan.`);
      return true;
    } catch (err: any) {
      showToast('error', 'Gagal Membuat File PC', err.message || 'Gagal membuat file baru di komputer.');
      return false;
    }
  };

  const unlinkPCFile = () => {
    unlinkPCFileHandle();
    setIsPCFileLinked(false);
    showToast('info', 'Tautan File Dilepas', 'Aplikasi tidak lagi terhubung langsung ke file PC. Data tetap tersimpan di storage browser.');
  };

  const saveToLinkedPCFile = async (): Promise<boolean> => {
    if (!isPCFileLinked) {
      showToast('warning', 'Belum Ada File PC', 'Silakan pilih atau tautkan file database di PC Anda terlebih dahulu.');
      return false;
    }
    const data = exportFullDatabase();
    const ok = await writeToLinkedPCFile(data);
    if (ok) {
      const nowTime = new Date().toLocaleTimeString('id-ID');
      setPcFileLastSaved(nowTime);
      showToast('success', 'Tersimpan di PC', `Data berhasil ditulis ke file ${pcFileName} pada ${nowTime}.`);
      return true;
    } else {
      showToast('error', 'Gagal Menyimpan ke PC', 'Gagal menulis ke file di komputer. Pastikan izin akses diberikan.');
      return false;
    }
  };

  const loadFromLinkedPCFile = async (): Promise<boolean> => {
    if (!isPCFileLinked) {
      showToast('warning', 'Belum Ada File PC', 'Silakan tautkan file database di PC Anda terlebih dahulu.');
      return false;
    }
    const data = await readFromLinkedPCFile();
    if (data) {
      return importFullDatabase(data);
    } else {
      showToast('error', 'Gagal Membaca File PC', 'File di PC kosong atau tidak dapat diakses.');
      return false;
    }
  };

  // Debounced auto-save to linked PC file whenever state changes
  useEffect(() => {
    if (!isPCFileLinked || !isAutoSaveToPC) return;

    const timeout = setTimeout(() => {
      const data = exportFullDatabase();
      writeToLinkedPCFile(data).then(success => {
        if (success) {
          setPcFileLastSaved(new Date().toLocaleTimeString('id-ID'));
        }
      });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [
    isPCFileLinked,
    isAutoSaveToPC,
    members,
    families,
    coolGroups,
    childDedications,
    waterBaptisms,
    holySpiritBaptisms,
    marriages,
    deathRecords,
    workers,
    worshipServices,
    attendanceRecords,
    churchSettings,
    users,
    waSettings,
    waTemplates
  ]);

  // Localhost REST API handlers
  const testLocalApiConnection = async (customUrl?: string): Promise<{ success: boolean; message: string }> => {
    const targetUrl = customUrl || localApiUrl;
    const res = await testLocalServerConnection(targetUrl);
    setIsLocalApiConnected(res.success);
    if (res.success) {
      showToast('success', 'Server Localhost Terhubung', res.message);
    } else {
      showToast('error', 'Koneksi Localhost Gagal', res.message);
    }
    return res;
  };

  const pushToLocalApi = async (): Promise<boolean> => {
    const data = exportFullDatabase();
    const res = await pushToLocalServer(localApiUrl, data);
    if (res.success) {
      const nowTime = new Date().toLocaleTimeString('id-ID');
      setLocalApiLastSync(nowTime);
      setIsLocalApiConnected(true);
      showToast('success', 'Sinkronisasi ke PC Berhasil', res.message);
      return true;
    } else {
      showToast('error', 'Sinkronisasi Gagal', res.message);
      return false;
    }
  };

  const pullFromLocalApi = async (): Promise<boolean> => {
    const res = await pullFromLocalServer(localApiUrl);
    if (res.success && res.data) {
      const ok = importFullDatabase(res.data);
      if (ok) {
        const nowTime = new Date().toLocaleTimeString('id-ID');
        setLocalApiLastSync(nowTime);
        setIsLocalApiConnected(true);
      }
      return ok;
    } else {
      showToast('error', 'Gagal Menarik Data dari PC', res.message);
      return false;
    }
  };

  // Optional Periodic Auto-Sync with Localhost API (every 30s)
  useEffect(() => {
    if (!isAutoSyncLocalApi) return;

    const interval = setInterval(() => {
      pushToLocalServer(localApiUrl, exportFullDatabase()).then(res => {
        if (res.success) {
          setLocalApiLastSync(new Date().toLocaleTimeString('id-ID'));
          setIsLocalApiConnected(true);
        } else {
          setIsLocalApiConnected(false);
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [isAutoSyncLocalApi, localApiUrl, members, families, attendanceRecords]);

  const resetAllData = () => {
    localStorage.clear();
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    setChurchSettings(initialChurchSettings);
    setMembers(initialChurchMembers);
    setFamilies(initialFamilies);
    setCoolGroups(initialCOOLGroups);
    setChildDedications(initialChildDedications);
    setWaterBaptisms(initialWaterBaptisms);
    setHolySpiritBaptisms(initialHolySpiritBaptisms);
    setMarriages(initialMarriages);
    setDeathRecords(initialDeathRecords);
    setWorkers(initialWorkers);
    setWorshipServices(initialWorshipServices);
    setAttendanceRecords(initialAttendanceRecords);
    setWASettings(initialWASettings);
    setWATemplates(initialWATemplates);
    setWALogs(initialWAMessageLogs);
    setActivityLogs(initialActivityLogs);
    showToast('info', 'Data Direset', 'Semua data telah dikembalikan ke dataset default GBI Love Inhil.');
  };

  return (
    <ChurchContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        quickLoginAsRole,
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        addUser,
        updateUser,
        deleteUser,
        churchSettings,
        updateChurchSettings,
        members,
        addMember,
        updateMember,
        deleteMember,
        getMemberById,
        families,
        addFamily,
        updateFamily,
        deleteFamily,
        getFamilyById,
        coolGroups,
        addCOOLGroup,
        updateCOOLGroup,
        deleteCOOLGroup,
        getCOOLById,
        childDedications,
        addChildDedication,
        updateChildDedication,
        deleteChildDedication,
        waterBaptisms,
        addWaterBaptism,
        updateWaterBaptism,
        deleteWaterBaptism,
        holySpiritBaptisms,
        addHolySpiritBaptism,
        deleteHolySpiritBaptism,
        marriages,
        addMarriage,
        updateMarriage,
        deleteMarriage,
        deathRecords,
        addDeathRecord,
        deleteDeathRecord,
        workerDepartments,
        workers,
        addWorker,
        updateWorker,
        deleteWorker,
        worshipTypes,
        worshipServices,
        attendanceRecords,
        addWorshipService,
        updateWorshipService,
        deleteWorshipService,
        checkInMember,
        deleteAttendance,
        waSettings,
        updateWASettings,
        waTemplates,
        addWATemplate,
        updateWATemplate,
        deleteWATemplate,
        waLogs,
        sendBirthdayMessage,
        generateWhatsAppWebUrl,
        runDailyBirthdayScheduler,
        resendWAMessage,
        activityLogs,
        toasts,
        showToast,
        removeToast,
        stats,
        resetAllData,
        // PC Data Link & Sync exports
        isFileSystemSupported,
        isPCFileLinked,
        pcFileName,
        pcFileLastSaved,
        isAutoSaveToPC,
        setIsAutoSaveToPC,
        localApiUrl,
        setLocalApiUrl,
        isLocalApiConnected,
        localApiLastSync,
        isAutoSyncLocalApi,
        setIsAutoSyncLocalApi,
        linkPCFile,
        createAndLinkNewPCFile,
        unlinkPCFile,
        saveToLinkedPCFile,
        loadFromLinkedPCFile,
        testLocalApiConnection,
        pushToLocalApi,
        pullFromLocalApi,
        exportFullDatabase,
        downloadDatabaseJSON,
        importFullDatabase
      }}
    >
      {children}
    </ChurchContext.Provider>
  );
};

export const useChurch = () => {
  const context = useContext(ChurchContext);
  if (!context) {
    throw new Error('useChurch must be used within a ChurchProvider');
  }
  return context;
};
