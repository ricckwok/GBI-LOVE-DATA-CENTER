import React, { useState, useEffect } from 'react';
import { Family, ChurchMember, FamilyRelationLabels } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { X, Plus, Trash2, CheckCircle2, UserPlus, Users } from 'lucide-react';

interface KKJFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editFamily?: Family;
}

export const KKJFormModal: React.FC<KKJFormModalProps> = ({
  isOpen,
  onClose,
  editFamily
}) => {
  const { members, coolGroups, addFamily, updateFamily, addMember, showToast } = useChurch();

  const [headName, setHeadName] = useState('');
  const [headMemberId, setHeadMemberId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Tembilahan');
  const [district, setDistrict] = useState('Tembilahan Kota');
  const [postalCode, setPostalCode] = useState('29212');
  const [telephone, setTelephone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [coolId, setCoolId] = useState('');
  const [familyPhotoUrl, setFamilyPhotoUrl] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // Quick New Member State (to add family member inline without leaving form)
  const [showQuickAddMember, setShowQuickAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberGender, setNewMemberGender] = useState<'L' | 'P'>('L');
  const [newMemberRelation, setNewMemberRelation] = useState<number>(3); // Anak default
  const [newMemberBirthDate, setNewMemberBirthDate] = useState('2015-05-15');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  useEffect(() => {
    if (editFamily) {
      setHeadName(editFamily.headName);
      setHeadMemberId(editFamily.headMemberId || '');
      setAddress(editFamily.address);
      setCity(editFamily.city || 'Tembilahan');
      setDistrict(editFamily.district || '');
      setPostalCode(editFamily.postalCode || '');
      setTelephone(editFamily.telephone || '');
      setWhatsappNumber(editFamily.whatsappNumber || '');
      setCoolId(editFamily.coolId || '');
      setFamilyPhotoUrl(editFamily.familyPhotoUrl || '');
      setSelectedMemberIds(editFamily.memberIds || []);
    } else {
      setHeadName('');
      setHeadMemberId('');
      setAddress('');
      setCity('Tembilahan');
      setDistrict('Tembilahan Kota');
      setPostalCode('29212');
      setTelephone('');
      setWhatsappNumber('');
      setCoolId(coolGroups[0]?.id || '');
      setFamilyPhotoUrl('');
      setSelectedMemberIds([]);
    }
  }, [editFamily, coolGroups, isOpen]);

  if (!isOpen) return null;

  // Handle head of family select
  const handleHeadSelect = (mId: string) => {
    setHeadMemberId(mId);
    const m = members.find(item => item.id === mId);
    if (m) {
      setHeadName(m.fullName);
      if (m.address) setAddress(m.address);
      if (m.whatsappNumber) setWhatsappNumber(m.whatsappNumber);
      if (!selectedMemberIds.includes(mId)) {
        setSelectedMemberIds(prev => [mId, ...prev]);
      }
    }
  };

  const toggleMemberSelection = (mId: string) => {
    if (selectedMemberIds.includes(mId)) {
      if (mId === headMemberId) {
        showToast('warning', 'Kepala Keluarga', 'Kepala keluarga harus tetap berada di dalam daftar anggota KKJ.');
        return;
      }
      setSelectedMemberIds(prev => prev.filter(id => id !== mId));
    } else {
      setSelectedMemberIds(prev => [...prev, mId]);
    }
  };

  const handleQuickAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama anggota keluarga wajib diisi.');
      return;
    }

    const created = addMember({
      fullName: newMemberName,
      gender: newMemberGender,
      familyRelation: newMemberRelation,
      birthPlace: 'Tembilahan',
      birthDate: newMemberBirthDate,
      maritalStatus: newMemberRelation === 1 || newMemberRelation === 2 ? 2 : 1,
      address,
      city,
      whatsappNumber: newMemberPhone || whatsappNumber,
      waOptIn: true,
      coolId: coolId || undefined,
      memberStatus: 'AKTIF',
      registeredDate: new Date().toISOString().split('T')[0]
    });

    setSelectedMemberIds(prev => [...prev, created.id]);
    setNewMemberName('');
    setNewMemberPhone('');
    setShowQuickAddMember(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headName.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama kepala keluarga wajib diisi.');
      return;
    }

    if (!address.trim()) {
      showToast('error', 'Validasi Gagal', 'Alamat domisili keluarga wajib diisi.');
      return;
    }

    const payload = {
      headName,
      headMemberId: headMemberId || undefined,
      address,
      city,
      district,
      postalCode,
      telephone,
      whatsappNumber,
      coolId: coolId || undefined,
      familyPhotoUrl: familyPhotoUrl || undefined,
      registeredDate: editFamily ? editFamily.registeredDate : new Date().toISOString().split('T')[0],
      memberIds: selectedMemberIds
    };

    if (editFamily) {
      updateFamily(editFamily.id, payload);
    } else {
      addFamily(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {editFamily ? 'Edit Kartu Keluarga Jemaat (KKJ)' : 'Pendaftaran KKJ Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Satu Master Data Jemaat Terintegrasi • GBI Love Inhil
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Identitas Kepala Keluarga */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
              1. Identitas Kepala Keluarga & Domisili
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih dari Master Data Jemaat (Opsional)
                </label>
                <select
                  value={headMemberId}
                  onChange={e => handleHeadSelect(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="">-- Pilih dari Master Data Jemaat --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.memberNumber}) • {m.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Memilih jemaat akan otomatis mengisi nama, alamat, dan nomor WhatsApp.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Kepala Keluarga *
                </label>
                <input
                  type="text"
                  required
                  value={headName}
                  onChange={e => setHeadName(e.target.value)}
                  placeholder="Contoh: Hendrikus Tanoto"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Komunitas Kasih (COOL)
                </label>
                <select
                  value={coolId}
                  onChange={e => setCoolId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="">-- Belum Tergabung COOL --</option>
                  {coolGroups.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.coolName} ({c.leaderName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Lengkap Domisili *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Contoh: Jl. M. Boya No. 42, RT 02 / RW 04"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="Tembilahan Kota"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Tembilahan"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Utama</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="081234567890"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Keluarga (4:3)</label>
                <input
                  type="text"
                  value={familyPhotoUrl}
                  onChange={e => setFamilyPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Susunan Anggota Keluarga (Relational Binding) */}
          <div>
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-200">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Susunan Anggota Keluarga ({selectedMemberIds.length} Terpilih)
                </h4>
                <p className="text-[10px] text-slate-500">
                  Data anggota otomatis terhubung ke Master Data Jemaat tanpa duplikasi.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowQuickAddMember(!showQuickAddMember)}
                className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Entri Anggota Cepat</span>
              </button>
            </div>

            {/* Quick Add Form Box */}
            {showQuickAddMember && (
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 mb-4 space-y-3">
                <p className="text-xs font-bold text-blue-900">Input Jemaat Baru ke Master Data & Sambungkan ke KKJ</p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Nama Lengkap Anggota"
                      value={newMemberName}
                      onChange={e => setNewMemberName(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <select
                      value={newMemberGender}
                      onChange={e => setNewMemberGender(e.target.value as 'L' | 'P')}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={newMemberRelation}
                      onChange={e => setNewMemberRelation(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    >
                      {Object.entries(FamilyRelationLabels).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="date"
                      value={newMemberBirthDate}
                      onChange={e => setNewMemberBirthDate(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="No. WhatsApp (opsional)"
                      value={newMemberPhone}
                      onChange={e => setNewMemberPhone(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleQuickAddMember}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Simpan & Sambungkan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List of Member Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto custom-scrollbar p-1">
              {members.map(m => {
                const isSelected = selectedMemberIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleMemberSelection(m.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 text-transparent'
                      }`}>
                        ✓
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{m.fullName}</p>
                        <p className="text-[10px] text-slate-500">
                          {FamilyRelationLabels[m.familyRelation || 7]} • {m.gender === 'L' ? 'L' : 'P'}
                        </p>
                      </div>
                    </div>
                    {m.id === headMemberId && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white shrink-0">
                        Kepala
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              {editFamily ? 'Simpan Perubahan KKJ' : 'Daftarkan KKJ Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
