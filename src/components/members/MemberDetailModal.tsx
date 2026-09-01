import React from 'react';
import { ChurchMember, FamilyRelationLabels, MaritalStatusLabels, EducationLevelLabels } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { QrCodeDisplay } from '../ui/QrCodeDisplay';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  BookOpen,
  Briefcase,
  Cake,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare
} from 'lucide-react';

interface MemberDetailModalProps {
  member: ChurchMember;
  onClose: () => void;
  onEdit: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
  onEdit
}) => {
  const { families, coolGroups, waterBaptisms, childDedications, holySpiritBaptisms, marriages, workers, attendanceRecords, waLogs, sendBirthdayMessage } = useChurch();

  const family = families.find(f => f.id === member.familyId);
  const cool = coolGroups.find(c => c.id === member.coolId);
  const water = waterBaptisms.find(w => w.memberId === member.id);
  const dedication = childDedications.find(d => d.childMemberId === member.id);
  const spirit = holySpiritBaptisms.find(s => s.memberId === member.id);
  const marriage = marriages.find(m => m.memberId === member.id || m.spouseMemberId === member.id);
  const workerInfo = workers.filter(w => w.memberId === member.id && w.isActive);
  const memberAttendances = attendanceRecords.filter(a => a.memberId === member.id);
  const memberWALogs = waLogs.filter(l => l.memberId === member.id);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const b = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return age;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AKTIF':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'TIDAK_AKTIF':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PINDAH':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MENINGGAL':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              {member.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold">{member.fullName}</h3>
                {member.nickname && <span className="text-xs text-slate-300">({member.nickname})</span>}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(member.memberStatus)}`}>
                  {member.memberStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">No. Induk: {member.memberNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Edit Data
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Main Overview & QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="md:col-span-2 space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Hubungan Keluarga (KKJ)</span>
                <span className="col-span-2 font-bold text-slate-900">
                  : {FamilyRelationLabels[member.familyRelation || 7]} {family ? `(KKJ: ${family.kkjNumber} - ${family.headName})` : '(Belum terdaftar di KKJ)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Jenis Kelamin / Usia</span>
                <span className="col-span-2 text-slate-800">
                  : {member.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'} • {calculateAge(member.birthDate)} Tahun ({new Date(member.birthDate).toLocaleDateString('id-ID')})
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Status Perkawinan</span>
                <span className="col-span-2 text-slate-800">: {MaritalStatusLabels[member.maritalStatus || 1]}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Kelompok COOL</span>
                <span className="col-span-2 font-bold text-blue-700">: {cool ? `${cool.coolName} (${cool.leaderName})` : 'Belum Terdaftar'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Alamat Domisili</span>
                <span className="col-span-2 text-slate-800">: {member.address || family?.address || '-'}, {member.city || 'Tembilahan'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Nomor WhatsApp</span>
                <span className="col-span-2 font-mono font-bold text-emerald-700">
                  : {member.whatsappNumber || '-'} {member.waOptIn ? '✓ (Opt-in Aktif)' : '✗ (Opt-in Nonaktif)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Pekerjaan & Pendidikan</span>
                <span className="col-span-2 text-slate-800">: {member.occupation || '-'} ({EducationLevelLabels[member.educationLevel || 0]})</span>
              </div>
            </div>

            {/* Digital QR Card */}
            <div className="flex flex-col items-center justify-center">
              <QrCodeDisplay
                value={member.qrToken || `MBR:${member.memberNumber}`}
                size={110}
                label={`QR Jemaat: ${member.fullName}`}
                showDownload={true}
              />
            </div>
          </div>

          {/* Section 2: Riwayat Sakramen & Rohani */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Riwayat Sakramen & Pelayanan Gerejawi</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Penyerahan Anak</span>
                <p className="font-bold text-slate-900">
                  {dedication ? `Terdaftar (${new Date(dedication.dedicationDate).toLocaleDateString('id-ID')})` : 'Belum Tercatat'}
                </p>
                {dedication && <p className="text-[11px] text-slate-500">Dilayani: {dedication.ministerName}</p>}
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Baptisan Selam</span>
                <p className="font-bold text-emerald-700">
                  {water ? `Sudah Dibaptis (${new Date(water.baptismDate).toLocaleDateString('id-ID')})` : 'Belum Dibaptis'}
                </p>
                {water && <p className="text-[11px] text-slate-500">Sertifikat No: {water.certificateNumber || water.registrationNumber}</p>}
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Baptisan Roh Kudus</span>
                <p className="font-bold text-slate-900">
                  {spirit ? `Sudah (${new Date(spirit.baptismDate).toLocaleDateString('id-ID')})` : 'Belum Tercatat'}
                </p>
                {spirit && <p className="text-[11px] text-slate-500">{spirit.notes || 'Berbahasa Roh'}</p>}
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Pemberkatan Pernikahan</span>
                <p className="font-bold text-slate-900">
                  {marriage ? `Tercatat (${new Date(marriage.marriageDate).toLocaleDateString('id-ID')})` : 'Tidak / Belum'}
                </p>
                {marriage && <p className="text-[11px] text-slate-500">Pasangan: {marriage.spouseName}</p>}
              </div>
            </div>

            {/* Worker Positions */}
            {workerInfo.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs">
                <span className="text-[10px] font-bold uppercase text-blue-600 block mb-1">Status Pengerja / Pelayan</span>
                <div className="flex flex-wrap gap-2">
                  {workerInfo.map(w => (
                    <span key={w.id} className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs">
                      {w.positionTitle} ({w.departmentName})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Log Presensi & WhatsApp History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Presensi */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h5 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Riwayat Kehadiran Ibadah</span>
                </h5>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {memberAttendances.length}x Hadir
                </span>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
                {memberAttendances.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada riwayat presensi ibadah.</p>
                ) : (
                  memberAttendances.map(a => (
                    <div key={a.id} className="text-xs p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        {new Date(a.checkInTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(a.checkInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ({a.checkInMethod})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* WA History */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h5 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Log WhatsApp Otomatis</span>
                </h5>
                <button
                  onClick={() => sendBirthdayMessage(member.id, true)}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Test Kirim WA</span>
                </button>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
                {memberWALogs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada riwayat pengiriman pesan WhatsApp.</p>
                ) : (
                  memberWALogs.map(l => (
                    <div key={l.id} className="text-xs p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{l.messageType} {l.sendYear}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-green-100 text-green-700">
                          {l.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{l.messageBody}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
