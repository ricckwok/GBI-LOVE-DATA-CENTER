import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchMember } from '../../types';
import {
  Cake,
  Send,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Play,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

export const BirthdayView: React.FC = () => {
  const {
    members,
    coolGroups,
    stats,
    sendBirthdayMessage,
    generateWhatsAppWebUrl,
    waLogs,
    runDailyBirthdayScheduler,
    showToast
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'month'>('today');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [isSending, setIsSending] = useState<string | null>(null);
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  const currentYear = new Date().getFullYear();

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const b = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return age;
  };

  // Get status of WA for this member in the current year
  const getBirthdayStatus = (memberId: string) => {
    const log = waLogs.find(l => l.memberId === memberId && l.messageType === 'BIRTHDAY' && l.sendYear === currentYear);
    if (!log) return { status: 'PENDING', label: 'Belum Dikirim', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (log.status === 'TERKIRIM') return { status: 'TERKIRIM', label: 'Terkirim ✓', color: 'bg-green-50 text-green-700 border-green-200' };
    if (log.status === 'GAGAL') return { status: 'GAGAL', label: 'Gagal Kirim', color: 'bg-red-50 text-red-700 border-red-200' };
    return { status: log.status, label: 'Dilewati', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  const handleSendWA = async (memberId: string) => {
    setIsSending(memberId);
    try {
      await sendBirthdayMessage(memberId, true);
    } finally {
      setIsSending(null);
    }
  };

  const handleRunScheduler = async () => {
    setIsBatchRunning(true);
    try {
      const res = await runDailyBirthdayScheduler();
      showToast('success', 'Scheduler Selesai', `${res.sent} pesan terkirim, ${res.skipped} dilewati.`);
    } finally {
      setIsBatchRunning(false);
    }
  };

  // Month members
  const monthMembers = members.filter(m => {
    if (!m.birthDate || m.memberStatus !== 'AKTIF') return false;
    const b = new Date(m.birthDate);
    return (b.getMonth() + 1) === selectedMonth;
  }).sort((a, b) => {
    const da = new Date(a.birthDate).getDate();
    const db = new Date(b.birthDate).getDate();
    return da - db;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Pastoral & Otomasi</span>
            <span>•</span>
            <span className="text-blue-600">Pengingat Ulang Tahun</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Pengingat Ulang Tahun & Perhatian Pastoral
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar otomatis jemaat berulang tahun dengan generator ucapan personal dan scheduler WhatsApp.
          </p>
        </div>

        <button
          onClick={handleRunScheduler}
          disabled={isBatchRunning}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Play className={`w-3.5 h-3.5 ${isBatchRunning ? 'animate-spin' : ''}`} />
          <span>{isBatchRunning ? 'Mengirim...' : 'Jalankan Scheduler Otomatis'}</span>
        </button>
      </div>

      {/* 3 Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Hari Ini</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.todayBirthdays.length} Jemaat</h3>
            <p className="text-[11px] text-amber-700 font-medium">Ulang tahun hari ini</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">7 Hari Kedepan</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.upcomingBirthdays.length} Jemaat</h3>
            <p className="text-[11px] text-blue-600 font-medium">Mendekati hari ulang tahun</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">Bulan Ini</p>
            <h3 className="text-2xl font-bold text-slate-900">{monthMembers.length} Jemaat</h3>
            <p className="text-[11px] text-emerald-700 font-medium">Bulan {new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date())}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'today' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Hari Ini ({stats.todayBirthdays.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'upcoming' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            7 Hari Kedepan ({stats.upcomingBirthdays.length})
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'month' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Kalender Bulanan
          </button>
        </div>

        {activeTab === 'month' && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Pilih Bulan:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="text-xs font-bold p-2 bg-white border border-slate-200 rounded-xl"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                <option key={m} value={m}>
                  {new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2026, m - 1, 1))}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Nama Jemaat</th>
              <th className="px-4 py-3.5">Tanggal Lahir & Usia</th>
              <th className="px-4 py-3.5">COOL</th>
              <th className="px-4 py-3.5">No. WhatsApp</th>
              <th className="px-4 py-3.5">Status Pengiriman</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {activeTab === 'today' && stats.todayBirthdays.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                  <Cake className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="font-semibold">Tidak ada jemaat yang berulang tahun hari ini.</p>
                </td>
              </tr>
            )}

            {activeTab === 'today' && stats.todayBirthdays.map(mem => {
              const cool = coolGroups.find(c => c.id === mem.coolId);
              const statusInfo = getBirthdayStatus(mem.id);
              const age = calculateAge(mem.birthDate);

              return (
                <tr key={mem.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs shrink-0">
                      🎂
                    </div>
                    <div>
                      <span>{mem.fullName}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{mem.memberNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-800">{new Date(mem.birthDate).toLocaleDateString('id-ID')}</span>
                    <span className="text-[11px] text-amber-700 font-bold block">Ulang Tahun ke-{age}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{cool?.coolName || '-'}</td>
                  <td className="px-4 py-3.5 font-mono text-[11px]">{mem.whatsappNumber || '-'}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleSendWA(mem.id)}
                        disabled={isSending === mem.id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                        title="Kirim otomatis melalui WhatsApp Cloud API"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isSending === mem.id ? 'Mengirim...' : 'Kirim WA API'}</span>
                      </button>

                      <a
                        href={generateWhatsAppWebUrl(mem.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors inline-flex items-center"
                        title="Buka WhatsApp Web dengan pesan siap kirim"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}

            {activeTab === 'upcoming' && stats.upcomingBirthdays.map(({ member: mem, daysUntil, age }) => {
              const cool = coolGroups.find(c => c.id === mem.coolId);
              const statusInfo = getBirthdayStatus(mem.id);

              return (
                <tr key={mem.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {mem.fullName}
                    <span className="text-[10px] text-slate-400 font-mono block">{mem.memberNumber}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-800">{new Date(mem.birthDate).toLocaleDateString('id-ID')}</span>
                    <span className="text-[10px] font-bold text-blue-600 block">
                      {daysUntil === 0 ? 'Hari Ini!' : `${daysUntil} hari lagi (ke-${age + 1})`}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{cool?.coolName || '-'}</td>
                  <td className="px-4 py-3.5 font-mono">{mem.whatsappNumber || '-'}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleSendWA(mem.id)}
                        disabled={isSending === mem.id}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim Sekarang</span>
                      </button>

                      <a
                        href={generateWhatsAppWebUrl(mem.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors inline-flex items-center"
                        title="Buka WhatsApp Web"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}

            {activeTab === 'month' && monthMembers.map(mem => {
              const cool = coolGroups.find(c => c.id === mem.coolId);
              const statusInfo = getBirthdayStatus(mem.id);
              const age = calculateAge(mem.birthDate);

              return (
                <tr key={mem.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {mem.fullName}
                    <span className="text-[10px] text-slate-400 font-mono block">{mem.memberNumber}</span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">
                    Tgl {new Date(mem.birthDate).getDate()} ({age} Thn)
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{cool?.coolName || '-'}</td>
                  <td className="px-4 py-3.5 font-mono">{mem.whatsappNumber || '-'}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold border ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleSendWA(mem.id)}
                        disabled={isSending === mem.id}
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim WA</span>
                      </button>

                      <a
                        href={generateWhatsAppWebUrl(mem.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors inline-flex items-center"
                        title="Buka WhatsApp Web"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
