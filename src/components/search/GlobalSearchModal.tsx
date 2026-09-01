import React, { useState, useEffect } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { ChurchMember, FamilyKKJ, COOLGroup, TabType } from '../../types';
import {
  Search,
  User,
  Users,
  HeartHandshake,
  ArrowRight,
  X,
  Phone,
  Calendar
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType, extra?: { memberId?: string; familyId?: string }) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { members, families, coolGroups } = useChurch();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedMembers = q
    ? members.filter(
        m =>
          m.fullName.toLowerCase().includes(q) ||
          m.memberNumber.toLowerCase().includes(q) ||
          (m.whatsappNumber && m.whatsappNumber.includes(q)) ||
          (m.address && m.address.toLowerCase().includes(q))
      ).slice(0, 5)
    : [];

  const matchedFamilies = q
    ? families.filter(
        f =>
          f.headName.toLowerCase().includes(q) ||
          f.kkjNumber.toLowerCase().includes(q) ||
          (f.address && f.address.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  const matchedCOOL = q
    ? coolGroups.filter(
        c =>
          c.coolName.toLowerCase().includes(q) ||
          c.leaderName.toLowerCase().includes(q) ||
          c.coolCode.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const hasResults = matchedMembers.length > 0 || matchedFamilies.length > 0 || matchedCOOL.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Cari jemaat, nomor KKJ, nomor HP, kelompok COOL..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-sm font-semibold text-slate-900 focus:outline-hidden placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {!q && (
            <div className="p-8 text-center text-slate-400">
              <p className="font-semibold text-xs text-slate-500">Pencarian Universal Sistem GBI Love Inhil</p>
              <p className="text-[11px] mt-1">Ketik nama jemaat, nomor induk jemaat, nomor kartu keluarga, atau nama COOL.</p>
            </div>
          )}

          {q && !hasResults && (
            <div className="p-8 text-center text-slate-400">
              <p className="font-semibold text-xs">Tidak ada data yang cocok dengan "{query}".</p>
            </div>
          )}

          {/* Members */}
          {matchedMembers.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Jemaat ({matchedMembers.length})
              </span>
              <div className="space-y-1">
                {matchedMembers.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onClose();
                      onNavigate('members', { memberId: m.id });
                    }}
                    className="p-2.5 hover:bg-blue-50 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block group-hover:text-blue-700">{m.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{m.memberNumber} • {m.whatsappNumber || 'Tanpa HP'}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Families (KKJ) */}
          {matchedFamilies.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Kartu Keluarga Jemaat ({matchedFamilies.length})
              </span>
              <div className="space-y-1">
                {matchedFamilies.map(f => (
                  <div
                    key={f.id}
                    onClick={() => {
                      onClose();
                      onNavigate('kkj', { familyId: f.id });
                    }}
                    className="p-2.5 hover:bg-purple-50 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block group-hover:text-purple-700">KK: {f.headName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{f.kkjNumber} • {f.membersCount} Anggota</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COOL */}
          {matchedCOOL.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Komunitas Kasih / COOL ({matchedCOOL.length})
              </span>
              <div className="space-y-1">
                {matchedCOOL.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onClose();
                      onNavigate('cool');
                    }}
                    className="p-2.5 hover:bg-emerald-50 rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block group-hover:text-emerald-700">{c.coolName}</span>
                        <span className="text-[10px] text-slate-400">Ketua: {c.leaderName} ({c.scheduleDay})</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tekan <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">ESC</kbd> untuk menutup</span>
          <span className="text-blue-600 font-semibold">GBI Love Inhil Database</span>
        </div>
      </div>
    </div>
  );
};
