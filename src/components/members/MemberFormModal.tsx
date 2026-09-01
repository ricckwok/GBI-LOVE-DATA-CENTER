import React, { useState, useEffect } from 'react';
import { ChurchMember, FamilyRelationLabels, MaritalStatusLabels, EducationLevelLabels, MemberStatus } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { X, User, Check, Shield } from 'lucide-react';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMember?: ChurchMember;
}

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  isOpen,
  onClose,
  editMember
}) => {
  const { families, coolGroups, addMember, updateMember, showToast } = useChurch();

  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [familyRelation, setFamilyRelation] = useState<number>(1);
  const [maritalStatus, setMaritalStatus] = useState<number>(1);
  const [birthPlace, setBirthPlace] = useState('Tembilahan');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [bloodType, setBloodType] = useState('O');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Tembilahan Kota');
  const [city, setCity] = useState('Tembilahan');
  const [postalCode, setPostalCode] = useState('29212');
  const [telephone, setTelephone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [educationLevel, setEducationLevel] = useState<number>(3);
  const [spiritualGifts, setSpiritualGifts] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [coolId, setCoolId] = useState('');
  const [memberStatus, setMemberStatus] = useState<MemberStatus>('AKTIF');
  const [waOptIn, setWaOptIn] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (editMember) {
      setFullName(editMember.fullName);
      setNickname(editMember.nickname || '');
      setGender(editMember.gender);
      setFamilyRelation(editMember.familyRelation || 1);
      setMaritalStatus(editMember.maritalStatus || 1);
      setBirthPlace(editMember.birthPlace || 'Tembilahan');
      setBirthDate(editMember.birthDate || '1990-01-01');
      setBloodType(editMember.bloodType || 'O');
      setAddress(editMember.address || '');
      setDistrict(editMember.district || 'Tembilahan Kota');
      setCity(editMember.city || 'Tembilahan');
      setPostalCode(editMember.postalCode || '29212');
      setTelephone(editMember.telephone || '');
      setWhatsappNumber(editMember.whatsappNumber || '');
      setEmail(editMember.email || '');
      setOccupation(editMember.occupation || '');
      setCompanyName(editMember.companyName || '');
      setEducationLevel(editMember.educationLevel || 3);
      setSpiritualGifts(editMember.spiritualGifts || '');
      setFamilyId(editMember.familyId || '');
      setCoolId(editMember.coolId || '');
      setMemberStatus(editMember.memberStatus || 'AKTIF');
      setWaOptIn(editMember.waOptIn ?? true);
      setPhotoUrl(editMember.photoUrl || '');
    } else {
      setFullName('');
      setNickname('');
      setGender('L');
      setFamilyRelation(1);
      setMaritalStatus(1);
      setBirthPlace('Tembilahan');
      setBirthDate('1990-01-01');
      setBloodType('O');
      setAddress('');
      setDistrict('Tembilahan Kota');
      setCity('Tembilahan');
      setPostalCode('29212');
      setTelephone('');
      setWhatsappNumber('');
      setEmail('');
      setOccupation('');
      setCompanyName('');
      setEducationLevel(3);
      setSpiritualGifts('');
      setFamilyId('');
      setCoolId(coolGroups[0]?.id || '');
      setMemberStatus('AKTIF');
      setWaOptIn(true);
      setPhotoUrl('');
    }
  }, [editMember, coolGroups, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama lengkap jemaat wajib diisi.');
      return;
    }

    const payload = {
      fullName,
      nickname,
      gender,
      familyRelation,
      maritalStatus,
      birthPlace,
      birthDate,
      bloodType,
      address,
      district,
      city,
      postalCode,
      telephone,
      whatsappNumber,
      email,
      occupation,
      companyName,
      educationLevel,
      spiritualGifts,
      familyId: familyId || undefined,
      coolId: coolId || undefined,
      memberStatus,
      registeredDate: editMember ? editMember.registeredDate : new Date().toISOString().split('T')[0],
      photoUrl: photoUrl || undefined,
      waOptIn
    };

    if (editMember) {
      updateMember(editMember.id, payload);
    } else {
      addMember(payload);
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
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {editMember ? 'Edit Data Jemaat' : 'Pendaftaran Master Data Jemaat'}
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
          {/* Section 1: Identitas Pribadi */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
              1. Identitas Utama & Demografi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Sesuai KTP *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Contoh: Hendrikus Tanoto"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="Hendrik"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as 'L' | 'P')}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hubungan Keluarga (Hklg) *</label>
                <select
                  value={familyRelation}
                  onChange={e => setFamilyRelation(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {Object.entries(FamilyRelationLabels).map(([k, v]) => (
                    <option key={k} value={k}>{k}. {v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Perkawinan *</label>
                <select
                  value={maritalStatus}
                  onChange={e => setMaritalStatus(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {Object.entries(MaritalStatusLabels).map(([k, v]) => (
                    <option key={k} value={k}>{k}. {v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={e => setBirthPlace(e.target.value)}
                  placeholder="Tembilahan"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Lahir *</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Golongan Darah</label>
                <select
                  value={bloodType}
                  onChange={e => setBloodType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="-">-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Kontak & Domisili */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
              2. Kontak, WhatsApp & Domisili
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Domisili</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Jl. M. Boya No. 42"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kota / Kab</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Tembilahan"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp *</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="081234567890"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jemaat@gmail.com"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                <select
                  value={educationLevel}
                  onChange={e => setEducationLevel(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {Object.entries(EducationLevelLabels).map(([k, v]) => (
                    <option key={k} value={k}>{k}. {v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pekerjaan</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  placeholder="Wiraswasta / Karyawan"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Perusahaan / Usaha</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Toko Sinar Jaya"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Karunia Rohani / Bakat</label>
                <input
                  type="text"
                  value={spiritualGifts}
                  onChange={e => setSpiritualGifts(e.target.value)}
                  placeholder="Musik, Mengajar, Doa"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Komunitas & Status Gerejawi */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">
              3. Tautan Keluarga, COOL & Status Jemaat
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kartu Keluarga (KKJ)</label>
                <select
                  value={familyId}
                  onChange={e => setFamilyId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="">-- Belum Terhubung KKJ --</option>
                  {families.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.kkjNumber} - {f.headName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kelompok COOL</label>
                <select
                  value={coolId}
                  onChange={e => setCoolId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="">-- Belum Tergabung di COOL --</option>
                  {coolGroups.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.coolName} ({c.leaderName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Keanggotaan *</label>
                <select
                  value={memberStatus}
                  onChange={e => setMemberStatus(e.target.value as MemberStatus)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="TIDAK_AKTIF">TIDAK AKTIF</option>
                  <option value="PINDAH">PINDAH</option>
                  <option value="MENINGGAL">MENINGGAL</option>
                </select>
              </div>
            </div>

            {/* WA Opt-in Toggle */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Persetujuan Pesan WhatsApp Otomatis (Opt-In)</span>
                <span className="text-[11px] text-slate-500">
                  Mengizinkan sistem mengirimkan ucapan ulang tahun dan notifikasi ibadah otomatis.
                </span>
              </div>
              <input
                type="checkbox"
                checked={waOptIn}
                onChange={e => setWaOptIn(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Footer */}
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
              {editMember ? 'Simpan Perubahan' : 'Daftarkan Jemaat Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
