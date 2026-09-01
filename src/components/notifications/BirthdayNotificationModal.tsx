import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchMember } from '../../types';
import {
  X,
  Cake,
  Send,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Play,
  Heart,
  Users,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface BirthdayNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMember?: (member: ChurchMember) => void;
  onNavigateToBirthdayView?: () => void;
}

export const BirthdayNotificationModal: React.FC<BirthdayNotificationModalProps> = ({
  isOpen,
  onClose,
  onSelectMember,
  onNavigateToBirthdayView
}) => {
  const {
    stats,
    members,
    coolGroups,
    sendBirthdayMessage,
    generateWhatsAppWebUrl,
    waLogs,
    runDailyBirthdayScheduler,
    showToast
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'month'>('today');
  const [isSendingId, setIsSendingId] = useState<string | null>(null);
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const today = new Date();
  const currentMonth = today.getMonth() + 1;

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const b = new Date(birthDate);
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return age;
  };

  const getBirthdayStatus = (memberId: string) => {
    const log = waLogs.find(
      l => l.memberId === memberId && l.messageType === 'BIRTHDAY' && l.sendYear === currentYear
    );
    if (!log) {
      return { status: 'PENDING', label: 'Belum Terkirim', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    if (log.status === 'TERKIRIM') {
      const timeStr = log.sentAt ? new Date(log.sentAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
      return { status: 'TERKIRIM', label: `Terkirim ✓ ${timeStr ? '(' + timeStr + ')' : ''}`, color: 'bg-green-100 text-green-800 border-green-200' };
    }
    if (log.status === 'GAGAL') {
      return { status: 'GAGAL', label: 'Gagal Kirim', color: 'bg-red-100 text-red-800 border-red-200' };
    }
    return { status: log.status, label: 'Dilewati', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const handleSendWA = async (memberId: string) => {
    setIsSendingId(memberId);
    try {
      await sendBirthdayMessage(memberId, true);
    } finally {
      setIsSendingId(null);
    }
  };

  const handleRunBatch = async () => {
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
    return (b.getMonth() + 1) === currentMonth;
  }).sort((a, b) => {
    const da = new Date(a.birthDate).getDate();
    const db = new Date(b.birthDate).getDate();
    return da - db;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Cake className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-100">
                <span>Pusat Notifikasi Pastoral</span>
                <span>•</span>
                <span>GBI Love Inhil</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Notifikasi Ulang Tahun Jemaat
              </h2>
              <p className="text-xs text-amber-100 font-medium mt-0.5">
                {stats.todayBirthdays.length > 0
                  ? `🎉 Ada ${stats.todayBirthdays.length} jemaat berulang tahun hari ini!`
                  : 'Tidak ada jemaat yang berulang tahun hari ini.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {stats.todayBirthdays.length > 0 && (
              <button
                onClick={handleRunBatch}
                disabled={isBatchRunning}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                <Play className={`w-3.5 h-3.5 ${isBatchRunning ? 'animate-spin' : ''}`} />
                <span>{isBatchRunning ? 'Mengirim...' : 'Kirim Semua WA (Batch)'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'today'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Cake className="w-3.5 h-3.5" />
              <span>Hari Ini ({stats.todayBirthdays.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'upcoming'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>7 Hari Ke Depan ({stats.upcomingBirthdays.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('month')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'month'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Bulan Ini ({monthMembers.length})</span>
            </button>
          </div>

          {onNavigateToBirthdayView && (
            <button
              onClick={() => {
                onClose();
                onNavigateToBirthdayView();
              }}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <span>Halaman Lengkap</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {/* TAB 1: TODAY */}
          {activeTab === 'today' && (
            stats.todayBirthdays.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Cake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-700">Tidak ada jemaat yang berulang tahun hari ini.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Periksa tab "7 Hari Ke Depan" untuk melihat jadwal ulang tahun terdekat.
                </p>
              </div>
            ) : (
              stats.todayBirthdays.map(member => {
                const cool = coolGroups.find(c => c.id === member.coolId);
                const age = calculateAge(member.birthDate);
                const statusInfo = getBirthdayStatus(member.id);
                const waWebUrl = generateWhatsAppWebUrl(member.id);

                return (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center space-x-3.5">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-300 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-base shrink-0 border border-amber-300">
                          {member.fullName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">{member.fullName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px]">
                            Ultah ke-{age} 🎉
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                          <span>{member.memberNumber}</span>
                          <span>•</span>
                          <span>{cool?.coolName || 'GBI Love Inhil'}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-600">{member.whatsappNumber || '-'}</span>
                        </p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusInfo.color}`}>
                            <span>Status: {statusInfo.label}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {/* Send Automated API */}
                      <button
                        onClick={() => handleSendWA(member.id)}
                        disabled={isSendingId === member.id}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                        title="Kirim ucapan otomatis lewat WhatsApp Cloud API"
                      >
                        <Send className={`w-3.5 h-3.5 ${isSendingId === member.id ? 'animate-spin' : ''}`} />
                        <span>{isSendingId === member.id ? 'Mengirim...' : 'Kirim WA API'}</span>
                      </button>

                      {/* Direct WhatsApp Web Link */}
                      <a
                        href={waWebUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
                        title="Buka WhatsApp Web dengan pesan ucapan siap kirim"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Buka WA Web</span>
                      </a>

                      {/* View Profile */}
                      {onSelectMember && (
                        <button
                          onClick={() => {
                            onSelectMember(member);
                            onClose();
                          }}
                          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl border border-slate-200 transition-colors cursor-pointer"
                          title="Lihat Detail Jemaat"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )
          )}

          {/* TAB 2: UPCOMING 7 DAYS */}
          {activeTab === 'upcoming' && (
            stats.upcomingBirthdays.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-700">Tidak ada jadwal ulang tahun dalam 7 hari ke depan.</p>
              </div>
            ) : (
              stats.upcomingBirthdays.map(({ member, daysUntil, age }) => {
                const cool = coolGroups.find(c => c.id === member.coolId);
                const b = new Date(member.birthDate);
                const formattedDate = `${b.getDate()} ${new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(b)}`;
                const waWebUrl = generateWhatsAppWebUrl(member.id);

                return (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center font-bold border border-blue-200 shrink-0">
                        <span className="text-[10px] uppercase font-semibold leading-none">H-{daysUntil}</span>
                        <span className="text-sm font-black leading-tight mt-0.5">{b.getDate()}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-900 text-sm">{member.fullName}</h4>
                          <span className="text-xs text-blue-600 font-semibold">
                            Akan berulang tahun ke-{age} ({formattedDate})
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {member.memberNumber} • {cool?.coolName || 'GBI Love Inhil'} • WA: {member.whatsappNumber || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <a
                        href={waWebUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Kirim Ucapan Awal</span>
                      </a>

                      {onSelectMember && (
                        <button
                          onClick={() => {
                            onSelectMember(member);
                            onClose();
                          }}
                          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )
          )}

          {/* TAB 3: THIS MONTH */}
          {activeTab === 'month' && (
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Daftar Jemaat Berulang Tahun Bulan Ini ({monthMembers.length} Jemaat)
              </p>
              {monthMembers.map(member => {
                const b = new Date(member.birthDate);
                const age = calculateAge(member.birthDate);
                const cool = coolGroups.find(c => c.id === member.coolId);
                const isToday = b.getDate() === today.getDate();

                return (
                  <div
                    key={member.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isToday
                        ? 'bg-amber-50/80 border-amber-300 font-semibold'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isToday ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.getDate()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">{member.fullName}</span>
                          {isToday && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-extrabold">
                              HARI INI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          Usia: {age} thn • {cool?.coolName || 'GBI Love Inhil'}
                        </p>
                      </div>
                    </div>

                    <a
                      href={generateWhatsAppWebUrl(member.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 hover:text-emerald-800 font-bold flex items-center space-x-1 p-1.5 rounded-lg hover:bg-emerald-50"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WA</span>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Otomasi WhatsApp terjadwal setiap hari pkl 08:00 WIB</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup Notifikasi
          </button>
        </div>
      </div>
    </div>
  );
};
