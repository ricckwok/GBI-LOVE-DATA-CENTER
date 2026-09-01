import React from 'react';
import { useChurch } from '../../context/ChurchContext';
import { UserRole, ROLE_DEFINITIONS } from '../../types';
import { Menu, Search, Shield, ShieldCheck, RefreshCw, Bell, Cake, UserCog, User as UserIcon, LogOut } from 'lucide-react';
import { NavTab } from './Sidebar';

interface TopbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  onOpenGlobalSearch: () => void;
  onOpenBirthdayNotification?: () => void;
  onOpenEditProfile?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  onOpenGlobalSearch,
  onOpenBirthdayNotification,
  onOpenEditProfile
}) => {
  const { currentUser, switchRole, logout, waSettings, stats, resetAllData } = useChurch();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Utama & Statistik';
      case 'kkj': return 'Data Keluarga & Kartu Keluarga Jemaat (KKJ)';
      case 'members': return 'Master Data Jemaat Terintegrasi';
      case 'cool': return 'COOL / Komunitas Kasih';
      case 'sacraments': return 'Sakramen & Riwayat Gerejawi';
      case 'workers': return 'Data Pengerja & Departemen Pelayanan';
      case 'attendance': return 'Presensi Kehadiran Ibadah & Check-in';
      case 'birthday': return 'Pengingat Ulang Tahun & Notifikasi Pastoral';
      case 'whatsapp': return 'WhatsApp Cloud API & Scheduler';
      case 'reports': return 'Laporan, Rekapitulasi & Ekspor Data';
      case 'settings': return 'Pengaturan Sistem & Hak Akses';
      default: return 'Sistem Informasi GBI Love Inhil';
    }
  };

  // Indonesian Date Formatter
  const todayStr = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchRole(e.target.value as UserRole);
  };

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none truncate max-w-[180px] sm:max-w-md">
            {getTitle()}
          </h1>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
            GBI LOVE INHIL • Master Data Jemaat Terpadu
          </p>
        </div>
      </div>

      {/* Right section: System Badges, Quick Search, Role Switcher, Profile Pill */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Global Search Button */}
        <button
          onClick={onOpenGlobalSearch}
          className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-200"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Cari jemaat / KKJ...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded font-mono text-slate-400">⌘K</kbd>
        </button>

        {/* Super Admin Manage Role Shortcut */}
        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('settings')}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition-colors cursor-pointer"
            title="Kelola Role & Pengguna (Super Admin)"
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Kelola Role</span>
          </button>
        )}

        {/* Birthday Bell Notification Button */}
        <button
          onClick={onOpenBirthdayNotification || (() => setActiveTab('birthday'))}
          className="relative p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
          title="Notifikasi Ulang Tahun Jemaat"
        >
          <Bell className="w-4 h-4" />
          {stats.todayBirthdays.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-xs">
              {stats.todayBirthdays.length}
            </span>
          )}
        </button>

        {/* Birthday Indicator Shortcut */}
        {stats.todayBirthdays.length > 0 && (
          <button
            onClick={onOpenBirthdayNotification || (() => setActiveTab('birthday'))}
            className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-full border border-amber-200 hover:bg-amber-100 transition-colors animate-pulse cursor-pointer"
            title={`${stats.todayBirthdays.length} jemaat berulang tahun hari ini`}
          >
            <Cake className="w-3.5 h-3.5 text-amber-600" />
            <span>{stats.todayBirthdays.length} Ultah Hari Ini</span>
          </button>
        )}

        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* User Profile Pill & Edit Button */}
        <div className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-1 pr-2 transition-all">
          <button
            onClick={onOpenEditProfile || (() => setActiveTab('settings'))}
            className="flex items-center space-x-2 text-left cursor-pointer group"
            title="Edit Nama & Profil Akun"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-7 h-7 rounded-lg object-cover border border-slate-300"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {currentUser.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="hidden lg:block max-w-[130px]">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors leading-tight">
                {currentUser.fullName}
              </p>
              <span className="text-[9px] font-mono text-slate-400 block truncate">
                @{currentUser.username}
              </span>
            </div>
          </button>

          <button
            onClick={onOpenEditProfile || (() => setActiveTab('settings'))}
            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
            title="Edit Nama Akun & Password"
          >
            <UserCog className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Role Switcher for Testing RBAC */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <Shield className="w-3.5 h-3.5 text-slate-500 ml-1.5 hidden lg:block" />
          <select
            value={currentUser.role}
            onChange={handleRoleChange}
            className="bg-transparent text-[11px] font-bold text-slate-700 focus:outline-hidden cursor-pointer py-0.5 px-1 rounded"
            title="Ganti Role Hak Akses"
          >
            <option value="SUPER_ADMIN">Role: Super Admin</option>
            <option value="ADMINISTRATOR">Role: Administrator</option>
            <option value="OPERATOR">Role: Operator</option>
            <option value="PEMIMPIN_COOL">Role: Pemimpin COOL</option>
          </select>
        </div>

        {/* Logout / Switch Account Button */}
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-red-200"
          title="Keluar / Kembali ke Halaman Login"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
