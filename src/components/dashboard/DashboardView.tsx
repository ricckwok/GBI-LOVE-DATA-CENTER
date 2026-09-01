import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { NavTab } from '../layout/Sidebar';
import { BirthdayNotificationBanner } from './BirthdayNotificationBanner';
import {
  Users,
  UserCheck,
  Briefcase,
  TrendingUp,
  Cake,
  AlertTriangle,
  Send,
  CheckCircle2,
  Calendar,
  HeartHandshake,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Play
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: NavTab) => void;
  onOpenBirthdayModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab, onOpenBirthdayModal }) => {
  const { stats, members, families, coolGroups, sendBirthdayMessage, waLogs, activityLogs, runDailyBirthdayScheduler, showToast } = useChurch();
  const [filterCOOL, setFilterCOOL] = useState<string>('ALL');
  const [isSending, setIsSending] = useState<string | null>(null);
  const [isSchedulerRunning, setIsSchedulerRunning] = useState<boolean>(false);

  // Filter calculations
  const filteredMembers = filterCOOL === 'ALL' 
    ? members 
    : members.filter(m => m.coolId === filterCOOL);

  const activeFiltered = filteredMembers.filter(m => m.memberStatus === 'AKTIF').length;

  const handleSendWA = async (memberId: string) => {
    setIsSending(memberId);
    try {
      await sendBirthdayMessage(memberId, true);
    } finally {
      setIsSending(null);
    }
  };

  const handleRunScheduler = async () => {
    setIsSchedulerRunning(true);
    try {
      const res = await runDailyBirthdayScheduler();
      showToast('success', 'Scheduler Selesai', `${res.sent} pesan terkirim, ${res.skipped} dilewati.`);
    } finally {
      setIsSchedulerRunning(false);
    }
  };

  // Check if member already received WA this year
  const currentYear = new Date().getFullYear();
  const getBirthdayStatus = (memberId: string) => {
    const log = waLogs.find(l => l.memberId === memberId && l.messageType === 'BIRTHDAY' && l.sendYear === currentYear);
    if (!log) return { status: 'PENDING', label: 'Siap Kirim', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    if (log.status === 'TERKIRIM') return { status: 'TERKIRIM', label: `Terkirim (${new Date(log.sentAt || '').toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})`, color: 'bg-green-100 text-green-700 border-green-200' };
    if (log.status === 'GAGAL') return { status: 'GAGAL', label: 'Gagal API', color: 'bg-red-100 text-red-700 border-red-200' };
    return { status: log.status, label: 'Dilewati (Opt-out)', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const b = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return age;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Prominent Birthday Notification Banner */}
      <BirthdayNotificationBanner
        onOpenBirthdayModal={onOpenBirthdayModal || (() => setActiveTab('birthday'))}
      />

      {/* Top Filter & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Ringkasan Eksekutif Gereja</h2>
            <p className="text-xs text-slate-500">Master Data Terintegrasi • Single Source of Truth</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-xs font-semibold text-slate-500">Filter COOL:</span>
            <select
              value={filterCOOL}
              onChange={e => setFilterCOOL(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Semua Wilayah & COOL</option>
              {coolGroups.map(c => (
                <option key={c.id} value={c.id}>{c.coolName}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunScheduler}
            disabled={isSchedulerRunning}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isSchedulerRunning ? 'animate-spin' : ''}`} />
            <span>{isSchedulerRunning ? 'Memproses...' : 'Jalankan Scheduler WA'}</span>
          </button>
        </div>
      </div>

      {/* 4 Main Stat Cards (Clean Utility Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          onClick={() => setActiveTab('kkj')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Keluarga (KKJ)</p>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{stats.totalKKJ}</h3>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
              {stats.totalHeadOfFamily} Kepala Keluarga
            </span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('members')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Jemaat Aktif</p>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{filterCOOL === 'ALL' ? stats.totalActiveMembers : activeFiltered}</h3>
          <p className="text-xs text-blue-600 font-medium mt-2">
            Total {filterCOOL === 'ALL' ? stats.totalMembers : filteredMembers.length} Terdaftar di Sistem
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('workers')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Pengerja</p>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{stats.totalWorkers}</h3>
          <p className="text-xs text-slate-500 font-medium mt-2">
            6 Departemen Pelayanan Aktif
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Presensi Terakhir</p>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{stats.todayAttendance} Hadir</h3>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full w-[85%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Secondary Demographic Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Suami / Kepala</p>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{stats.totalHusbands}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Istri</p>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{stats.totalWives}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Anak & Pemuda</p>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{stats.totalChildren}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Kelompok COOL</p>
          <p className="text-lg font-bold text-blue-600 mt-0.5">{stats.totalCOOL}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Baptisan Selam</p>
          <p className="text-lg font-bold text-emerald-600 mt-0.5">{stats.totalWaterBaptisms}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Penyerahan Anak</p>
          <p className="text-lg font-bold text-purple-600 mt-0.5">{stats.totalChildDedications}</p>
        </div>
      </div>

      {/* Main Grid: Birthday Table (2 cols) & Pastoral Attention / Quick Info (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Birthday Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cake className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Ulang Tahun Jemaat Hari Ini</h4>
                <p className="text-[11px] text-slate-500">Scheduler berjalan otomatis setiap pukul 08:00 WIB</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Lihat Log WhatsApp →
            </button>
          </div>

          <div className="p-0 flex-1 overflow-x-auto">
            {stats.todayBirthdays.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Cake className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold">Tidak ada jemaat yang berulang tahun hari ini.</p>
                <p className="text-[11px] text-slate-400 mt-1">Sistem akan otomatis mengecek kembali besok pagi.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Nama Jemaat</th>
                    <th className="px-4 py-3">Usia</th>
                    <th className="px-4 py-3">COOL</th>
                    <th className="px-4 py-3">Status WA</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 divide-y divide-slate-50">
                  {stats.todayBirthdays.map(member => {
                    const statusInfo = getBirthdayStatus(member.id);
                    const cool = coolGroups.find(c => c.id === member.coolId);
                    const age = calculateAge(member.birthDate);

                    return (
                      <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3 flex items-center space-x-3">
                          {member.photoUrl ? (
                            <img
                              src={member.photoUrl}
                              alt={member.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                              {member.fullName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 block truncate">{member.fullName}</span>
                            <span className="text-[10px] text-slate-400">{member.whatsappNumber || 'Tanpa No WA'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">{age} Thn</td>
                        <td className="px-4 py-3 text-xs text-slate-500 truncate max-w-[120px]">
                          {cool?.coolName || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[10px] rounded-full border font-bold ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleSendWA(member.id)}
                            disabled={isSending === member.id}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" />
                            <span>{isSending === member.id ? 'Mengirim...' : 'Kirim WA'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Pastoral Need Attention & Activity Stream */}
        <div className="space-y-6">
          {/* Jemaat Perlu Perhatian */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Perlu Perhatian Khusus</h4>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                {stats.needAttentionMembers.length} Jemaat
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Jemaat aktif yang belum hadir dalam 3+ minggu terakhir. Disarankan untuk perkunjungan atau sapaan pastoral.
            </p>

            <div className="space-y-2.5">
              {stats.needAttentionMembers.slice(0, 3).map(mem => (
                <div key={mem.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                      !
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{mem.fullName}</p>
                      <p className="text-[10px] text-slate-500">
                        {mem.lastAttendedAt ? `Hadir: ${new Date(mem.lastAttendedAt).toLocaleDateString('id-ID')}` : 'Belum pernah presensi'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('members')}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 px-2 py-1 bg-white rounded border border-slate-200 cursor-pointer"
                  >
                    Profil
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
              Aktivitas Sistem Terbaru
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {activityLogs.slice(0, 4).map(act => (
                <div key={act.id} className="flex items-start space-x-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium leading-tight">{act.details}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(act.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {act.userName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
