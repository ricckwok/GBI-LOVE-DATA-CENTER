import React, { useState } from 'react';
import { COOLGroup, ChurchMember } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import {
  HeartHandshake,
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  MapPin,
  Clock,
  Phone,
  X,
  UserCheck
} from 'lucide-react';

export const COOLListView: React.FC = () => {
  const { coolGroups, members, addCOOLGroup, updateCOOLGroup, deleteCOOLGroup, showToast } = useChurch();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCOOL, setEditingCOOL] = useState<COOLGroup | undefined>(undefined);
  const [coolToDelete, setCoolToDelete] = useState<COOLGroup | null>(null);

  // Form states
  const [coolName, setCoolName] = useState('');
  const [leaderMemberId, setLeaderMemberId] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [scheduleDay, setScheduleDay] = useState('Jumat');
  const [scheduleTime, setScheduleTime] = useState('19:30 WIB');
  const [contactNumber, setContactNumber] = useState('');

  const openForm = (cool?: COOLGroup) => {
    if (cool) {
      setEditingCOOL(cool);
      setCoolName(cool.coolName);
      setLeaderMemberId(cool.leaderMemberId || '');
      setLeaderName(cool.leaderName);
      setLocationAddress(cool.locationAddress);
      setScheduleDay(cool.scheduleDay);
      setScheduleTime(cool.scheduleTime);
      setContactNumber(cool.contactNumber || '');
    } else {
      setEditingCOOL(undefined);
      setCoolName('');
      setLeaderMemberId('');
      setLeaderName('');
      setLocationAddress('Jl. ');
      setScheduleDay('Jumat');
      setScheduleTime('19:30 WIB');
      setContactNumber('');
    }
    setIsModalOpen(true);
  };

  const handleLeaderSelect = (mId: string) => {
    setLeaderMemberId(mId);
    const m = members.find(item => item.id === mId);
    if (m) {
      setLeaderName(m.fullName);
      if (m.whatsappNumber) setContactNumber(m.whatsappNumber);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coolName.trim() || !leaderName.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama kelompok COOL dan nama ketua wajib diisi.');
      return;
    }

    const payload = {
      coolName,
      leaderMemberId: leaderMemberId || undefined,
      leaderName,
      locationAddress,
      scheduleDay,
      scheduleTime,
      contactNumber,
      isActive: true
    };

    if (editingCOOL) {
      updateCOOLGroup(editingCOOL.id, payload);
    } else {
      addCOOLGroup(payload);
    }
    setIsModalOpen(false);
  };

  const filteredCOOL = coolGroups.filter(c =>
    c.coolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.locationAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Administrasi</span>
            <span>•</span>
            <span className="text-blue-600">Komunitas Kasih (COOL)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Kelompok COOL & Komunitas Sel
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wadah pembinaan, pemuridan, dan persekutuan jemaat berbasis wilayah di Tembilahan & Inhil.
          </p>
        </div>

        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelompok COOL</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kelompok COOL, ketua, atau alamat pertemuan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Cards Grid of COOL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCOOL.map(cool => {
          const groupMembers = members.filter(m => m.coolId === cool.id);
          return (
            <div
              key={cool.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-blue-300 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{cool.coolName}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{cool.coolCode}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-bold text-slate-800">Ketua: {cool.leaderName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Jadwal: {cool.scheduleDay}, {cool.scheduleTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{cool.locationAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{cool.contactNumber || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {groupMembers.length} Jemaat Terdaftar
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openForm(cool)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCoolToDelete(cool)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCOOL ? 'Edit Kelompok COOL' : 'Tambah Kelompok COOL Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kelompok COOL *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: COOL Kasih Karunia"
                  value={coolName}
                  onChange={e => setCoolName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Ketua dari Master Data Jemaat</label>
                <select
                  value={leaderMemberId}
                  onChange={e => handleLeaderSelect(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="">-- Pilih dari Master Jemaat --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.memberNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Ketua / Pemimpin COOL *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Pemimpin"
                  value={leaderName}
                  onChange={e => setLeaderName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari Pertemuan</label>
                  <select
                    value={scheduleDay}
                    onChange={e => setScheduleDay(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam Pertemuan</label>
                  <input
                    type="text"
                    placeholder="19:30 WIB"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat / Lokasi Pertemuan</label>
                <input
                  type="text"
                  placeholder="Jl. M. Boya No. 12"
                  value={locationAddress}
                  onChange={e => setLocationAddress(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Kontak</label>
                <input
                  type="text"
                  placeholder="081234567890"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold shadow-xs"
                >
                  Simpan COOL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!coolToDelete}
        title="Hapus Kelompok COOL"
        message={`Apakah Anda yakin ingin menghapus kelompok ${coolToDelete?.coolName}? Anggota kelompok tidak akan terhapus dari Master Data.`}
        confirmLabel="Hapus Kelompok"
        isDanger={true}
        onConfirm={() => {
          if (coolToDelete) {
            deleteCOOLGroup(coolToDelete.id);
            setCoolToDelete(null);
          }
        }}
        onCancel={() => setCoolToDelete(null)}
      />
    </div>
  );
};
