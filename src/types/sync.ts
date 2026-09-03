import {
  ChurchSettings,
  User,
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
  WASettings,
  WATemplate,
  WAMessageLog,
  ActivityLog
} from './index';

export interface FullDatabaseBackup {
  version: string;
  exportDate: string;
  appTitle: string;
  churchSettings: ChurchSettings;
  users: User[];
  members: ChurchMember[];
  families: Family[];
  coolGroups: COOLGroup[];
  childDedications: ChildDedication[];
  waterBaptisms: WaterBaptism[];
  holySpiritBaptisms: HolySpiritBaptism[];
  marriages: MarriageRecord[];
  deathRecords: DeathRecord[];
  workerDepartments: WorkerDepartment[];
  workers: Worker[];
  worshipTypes: WorshipType[];
  worshipServices: WorshipService[];
  attendanceRecords: AttendanceRecord[];
  waSettings: WASettings;
  waTemplates: WATemplate[];
  waLogs: WAMessageLog[];
  activityLogs: ActivityLog[];
}

export type SyncMode = 'FILE_SYSTEM' | 'LOCAL_SERVER' | 'MANUAL_JSON';

export interface PCSyncStatus {
  // File System Access API
  isFileSystemSupported: boolean;
  isPCFileLinked: boolean;
  pcFileName: string | null;
  pcFileLastSaved: string | null;
  isAutoSaveToPC: boolean;

  // Localhost REST Server API
  localApiUrl: string;
  isLocalApiConnected: boolean;
  localApiLastSync: string | null;
  isAutoSyncLocalApi: boolean;
  autoSyncIntervalSec: number;

  // Browser Persistent Storage
  isPersistentStorageGranted: boolean;
  storageUsageBytes?: number;
  storageQuotaBytes?: number;
}
