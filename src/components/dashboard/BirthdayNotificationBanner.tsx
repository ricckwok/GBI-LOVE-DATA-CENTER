import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchMember } from '../../types';
import {
  Cake,
  Send,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Bell,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';

interface BirthdayNotificationBannerProps {
  onOpenBirthdayModal: () => void;
  onSelectMember?: (member: ChurchMember) => void;
}

export const BirthdayNotificationBanner: React.FC<BirthdayNotificationBannerProps> = ({
  onOpenBirthdayModal,
  onSelectMember
}) => {
  const { stats, sendBirthdayMessage, generateWhatsAppWebUrl, waLogs, coolGroups } = useChurch();
  const [dismissed, setDismissed] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  if (dismissed) return null;

  const currentYear = new Date().getFullYear();
  const todayBirthdays = stats.todayBirthdays;
  const upcomingCount = stats.upcomingBirthdays.length;

  if (todayBirthdays.length === 0 && upcomingCount === 0) {
    return null;
  }

  const isSent = (memberId: string) => {
    return waLogs.some(
      l => l.memberId === memberId && l.messageType === 'BIRTHDAY' && l.sendYear === currentYear && l.status === 'TERKIRIM'
    );
  };

  const handleSendWA = async (memberId: string) => {
    setSendingId(memberId);
    try {
      await sendBirthdayMessage(memberId, true);
    } finally {
      setSendingId(null);
    }
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
    <div className="w-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-amber-500/20 border border-amber-400/50 mb-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-2 right-12 w-20 h-20 bg-amber-300/20 rounded-full blur-lg pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Message & Counter */}
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shrink-0 shadow-inner">
            <Cake className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Pengingat Pastoral Hari Ini</span>
              </span>
              {upcomingCount > 0 && (
                <span className="text-xs text-amber-100 font-semibold hidden sm:inline">
                  • {upcomingCount} jemaat menyusul minggu ini
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
              {todayBirthdays.length > 0
                ? `🎉 ${todayBirthdays.length} Jemaat Berulang Tahun Hari Ini!`
                : `📅 ${upcomingCount} Jemaat Berulang Tahun Dalam 7 Hari Ke Depan`}
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 mt-0.5 font-medium">
              Kirimkan ucapan selamat & doa berkat melalui WhatsApp otomatis atau WhatsApp Web.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
          <button
            onClick={onOpenBirthdayModal}
            className="px-4 py-2.5 bg-white text-amber-900 hover:bg-amber-50 font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Lihat Semua Notifikasi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-2 rounded-xl text-amber-100 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="Tutup banner untuk sesi ini"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Celebrants Grid Preview (if any today) */}
      {todayBirthdays.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
          {todayBirthdays.map(member => {
            const age = calculateAge(member.birthDate);
            const sent = isSent(member.id);
            const cool = coolGroups.find(c => c.id === member.coolId);
            const waWebUrl = generateWhatsAppWebUrl(member.id);

            return (
              <div
                key={member.id}
                className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/25 flex items-center justify-between gap-2 shadow-xs"
              >
                <div
                  className="flex items-center space-x-2.5 min-w-0 cursor-pointer"
                  onClick={() => onSelectMember && onSelectMember(member)}
                >
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-white/40 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-white/30 text-white font-bold flex items-center justify-center text-xs shrink-0 border border-white/40">
                      {member.fullName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate hover:underline">
                      {member.fullName}
                    </p>
                    <p className="text-[11px] text-amber-100 truncate">
                      Ke-{age} thn • {cool?.coolName?.split(' ')[0] || 'GBI'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  {sent ? (
                    <span className="px-2 py-1 bg-emerald-950/40 text-emerald-200 border border-emerald-300/40 rounded-lg text-[10px] font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                      <span>Terkirim</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendWA(member.id)}
                      disabled={sendingId === member.id}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                      title="Kirim ucapan via WA API"
                    >
                      <Send className={`w-3 h-3 ${sendingId === member.id ? 'animate-spin' : ''}`} />
                      <span>{sendingId === member.id ? '...' : 'Kirim WA'}</span>
                    </button>
                  )}

                  <a
                    href={waWebUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors cursor-pointer"
                    title="Buka WhatsApp Web"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
