import React from 'react';
import { useChurch } from '../../context/ChurchContext';
import { GBILogo } from '../common/GBILogo';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  HeartHandshake,
  BookOpen,
  Briefcase,
  CalendarCheck,
  Cake,
  MessageSquare,
  FileBarChart2,
  Settings,
  ShieldCheck,
  UserCog,
  LogOut,
  X
} from 'lucide-react';

import { TabType } from '../../types';

export type NavTab = TabType;

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout?: () => void;
  onOpenEditProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  onLogout = () => {},
  onOpenEditProfile
}) => {
  const { currentUser, stats } = useChurch();

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const navItems = [
    {
      section: 'Utama',
      items: [
        { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      section: 'Administrasi',
      items: [
        { id: 'kkj' as NavTab, label: 'Data Keluarga (KKJ)', icon: Users, count: stats.totalKKJ },
        { id: 'members' as NavTab, label: 'Master Data Jemaat', icon: UserCheck, count: stats.totalMembers },
        { id: 'cool' as NavTab, label: 'COOL / Komunitas Kasih', icon: HeartHandshake, count: stats.totalCOOL }
      ]
    },
    {
      section: 'Operasional',
      items: [
        { id: 'sacraments' as NavTab, label: 'Sakramen & Riwayat', icon: BookOpen },
        { id: 'workers' as NavTab, label: 'Data Pengerja', icon: Briefcase, count: stats.totalWorkers },
        { id: 'attendance' as NavTab, label: 'Kehadiran Ibadah', icon: CalendarCheck }
      ]
    },
    {
      section: 'Pastoral & Otomasi',
      items: [
        { 
          id: 'birthday' as NavTab, 
          label: 'Pengingat Ulang Tahun', 
          icon: Cake, 
          badge: stats.todayBirthdays.length > 0 ? `${stats.todayBirthdays.length} Hari Ini` : undefined,
          badgeColor: 'bg-amber-500 text-white'
        },
        { id: 'whatsapp' as NavTab, label: 'WhatsApp & Scheduler', icon: MessageSquare },
        { id: 'reports' as NavTab, label: 'Laporan & Statistik', icon: FileBarChart2 }
      ]
    },
    {
      section: 'Sistem & Otoritas',
      items: [
        { id: 'settings' as NavTab, label: 'Pengaturan & Akun', icon: Settings },
        ...(isSuperAdmin
          ? [{
              id: 'settings' as NavTab,
              label: 'Manajemen Role (Super)',
              icon: ShieldCheck,
              badge: 'SuperAdmin',
              badgeColor: 'bg-purple-600 text-white'
            }]
          : [])
      ]
    }
  ];

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-900/60 text-purple-300 border-purple-700/50';
      case 'ADMINISTRATOR':
        return 'bg-blue-900/60 text-blue-300 border-blue-700/50';
      case 'OPERATOR':
        return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50';
      case 'PEMIMPIN_COOL':
        return 'bg-amber-900/60 text-amber-300 border-amber-700/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <GBILogo className="w-9 h-9" />
            <div>
              <span className="text-white font-bold text-base tracking-tight block">GBI LOVE INHIL</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">Tembilahan • Riau</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto custom-scrollbar">
          {navItems.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest px-3 pt-2 pb-1.5">
                {group.section}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item, itemIdx) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={`${item.id}-${itemIdx}`}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge ? (
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      ) : item.count !== undefined ? (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          isActive ? 'bg-blue-700/80 text-blue-100' : 'text-slate-400 bg-slate-800'
                        }`}>
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-800">
            <button
              type="button"
              onClick={onOpenEditProfile || (() => setActiveTab('settings'))}
              className="flex items-center space-x-2.5 min-w-0 flex-1 text-left cursor-pointer group"
              title="Klik untuk Edit Nama Akun & Profil"
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0 group-hover:border-blue-500 transition-colors"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {currentUser.fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate leading-tight group-hover:text-blue-300 transition-colors">
                  {currentUser.fullName}
                </p>
                <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-semibold mt-0.5 ${getRoleBadge(currentUser.role)}`}>
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </button>

            <div className="flex items-center space-x-1 shrink-0 ml-1">
              <button
                onClick={onOpenEditProfile || (() => setActiveTab('settings'))}
                title="Edit Profil & Ganti Nama Akun"
                className="text-slate-400 hover:text-blue-400 p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <UserCog className="w-4 h-4" />
              </button>

              <button
                onClick={onLogout}
                title="Keluar Akun"
                className="text-slate-400 hover:text-red-400 p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
