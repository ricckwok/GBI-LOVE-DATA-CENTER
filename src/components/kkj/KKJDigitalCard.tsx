import React, { useRef } from 'react';
import { Family, ChurchMember, FamilyRelationLabels, MaritalStatusLabels, EducationLevelLabels } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { QrCodeDisplay } from '../ui/QrCodeDisplay';
import { GBILogo } from '../common/GBILogo';
import { Printer, Download, X, ShieldCheck, Heart } from 'lucide-react';

interface KKJDigitalCardProps {
  family: Family;
  onClose: () => void;
}

export const KKJDigitalCard: React.FC<KKJDigitalCardProps> = ({ family, onClose }) => {
  const { churchSettings, members, coolGroups, waterBaptisms, childDedications, holySpiritBaptisms, marriages, workers } = useChurch();
  const printRef = useRef<HTMLDivElement>(null);

  // Get family members
  const familyMembers = members.filter(m => family.memberIds.includes(m.id));
  const cool = coolGroups.find(c => c.id === family.coolId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold">Kartu Keluarga Jemaat Digital (KKJ)</h3>
              <p className="text-[11px] text-slate-400">Nomor: {family.kkjNumber} • {family.headName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak KKJ Resmi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable KKJ Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white print:p-0 print:overflow-visible" ref={printRef}>
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <GBILogo className="w-10 h-10 shrink-0" />
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    {churchSettings.churchName}
                  </h2>
                </div>
                <p className="text-xs font-medium text-slate-600">
                  {churchSettings.synod} • Gembala Sidang: {churchSettings.seniorPastor}
                </p>
                <p className="text-[11px] text-slate-500">
                  {churchSettings.address}, {churchSettings.city}, {churchSettings.province} • Telp: {churchSettings.phone}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded">
                  KARTU KELUARGA JEMAAT
                </span>
                <p className="text-xs font-bold text-slate-800 mt-2">
                  No. KKJ: <span className="font-mono text-blue-700 font-bold">{family.kkjNumber}</span>
                </p>
                <p className="text-[11px] text-slate-500 font-mono">Kode: {family.familyCode}</p>
              </div>
            </div>
          </div>

          {/* Family Identity Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-1.5 md:col-span-2 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Nama Kepala Keluarga</span>
                <span className="col-span-2 font-bold text-slate-900">: {family.headName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Alamat Lengkap</span>
                <span className="col-span-2 text-slate-800">: {family.address}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Kecamatan / Kota</span>
                <span className="col-span-2 text-slate-800">: {family.district || '-'} / {family.city} ({family.postalCode || '-'})</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Nomor Telepon / HP</span>
                <span className="col-span-2 text-slate-800">: {family.telephone || '-'} / {family.whatsappNumber}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Komunitas Kasih (COOL)</span>
                <span className="col-span-2 font-bold text-blue-700">: {cool?.coolName || 'Belum Terdaftar di COOL'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-slate-500">Tanggal Terdaftar</span>
                <span className="col-span-2 text-slate-800">: {new Date(family.registeredDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* QR Code & Family Photo Area */}
            <div className="flex items-center justify-end space-x-3">
              {family.familyPhotoUrl ? (
                <div className="text-center">
                  <img
                    src={family.familyPhotoUrl}
                    alt={family.headName}
                    className="w-28 h-20 object-cover rounded-lg border border-slate-300 shadow-xs"
                  />
                  <span className="text-[9px] text-slate-400 mt-1 block">Foto Keluarga (4:3)</span>
                </div>
              ) : (
                <div className="w-28 h-20 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                  Foto 4:3
                </div>
              )}

              <QrCodeDisplay
                value={`KKJ-VERIFIED:${family.kkjNumber}:${family.headName}`}
                size={80}
                showDownload={false}
                label="Otentikasi Resmi"
              />
            </div>
          </div>

          {/* Table G3: Daftar Anggota Keluarga */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              I. SUSUNAN ANGGOTA KELUARGA
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2 text-center w-8">No</th>
                    <th className="p-2">Nama Lengkap</th>
                    <th className="p-2 text-center">Klm</th>
                    <th className="p-2">Hub. Keluarga</th>
                    <th className="p-2">Status Nikah</th>
                    <th className="p-2">Tempat / Tgl Lahir</th>
                    <th className="p-2">Pekerjaan</th>
                    <th className="p-2">Pendidikan</th>
                    <th className="p-2">No. WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {familyMembers.map((member, index) => (
                    <tr key={member.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="p-2 text-center font-bold">{index + 1}</td>
                      <td className="p-2 font-bold text-slate-900">
                        {member.fullName}
                        {member.nickname ? ` (${member.nickname})` : ''}
                      </td>
                      <td className="p-2 text-center font-semibold">{member.gender}</td>
                      <td className="p-2">{FamilyRelationLabels[member.familyRelation || 7]}</td>
                      <td className="p-2">{MaritalStatusLabels[member.maritalStatus || 1]}</td>
                      <td className="p-2">
                        {member.birthPlace}, {new Date(member.birthDate).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-2">{member.occupation || '-'}</td>
                      <td className="p-2">{EducationLevelLabels[member.educationLevel || 0]}</td>
                      <td className="p-2 font-mono text-[10px]">{member.whatsappNumber || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table J: Riwayat Gerejawi & Sakramen Anggota Keluarga */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
              II. RIWAYAT GEREJAWI & SAKRAMEN ANGGOTA KELUARGA
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2">Nama Anggota</th>
                    <th className="p-2">Penyerahan Anak</th>
                    <th className="p-2">Baptisan Selam</th>
                    <th className="p-2">Baptisan Roh Kudus</th>
                    <th className="p-2">Pernikahan Kudus</th>
                    <th className="p-2">Jabatan / Pelayanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {familyMembers.map((member) => {
                    const water = waterBaptisms.find(w => w.memberId === member.id);
                    const dedic = childDedications.find(d => d.childMemberId === member.id);
                    const spirit = holySpiritBaptisms.find(s => s.memberId === member.id);
                    const marriage = marriages.find(m => m.memberId === member.id || m.spouseMemberId === member.id);
                    const worker = workers.find(w => w.memberId === member.id && w.isActive);

                    return (
                      <tr key={member.id} className="bg-white">
                        <td className="p-2 font-bold text-slate-900">{member.fullName}</td>
                        <td className="p-2">
                          {dedic ? `${new Date(dedic.dedicationDate).toLocaleDateString('id-ID')} (${dedic.ministerName})` : '-'}
                        </td>
                        <td className="p-2">
                          {water ? `${new Date(water.baptismDate).toLocaleDateString('id-ID')} (${water.ministerName})` : '-'}
                        </td>
                        <td className="p-2">
                          {spirit ? `${new Date(spirit.baptismDate).toLocaleDateString('id-ID')}` : '-'}
                        </td>
                        <td className="p-2">
                          {marriage ? `${new Date(marriage.marriageDate).toLocaleDateString('id-ID')} (${marriage.ministerName})` : '-'}
                        </td>
                        <td className="p-2 font-semibold text-blue-700">
                          {worker ? `${worker.positionTitle}` : 'Jemaat'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Validation & Signatures */}
          <div className="mt-8 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <p className="text-slate-500">Kepala Keluarga</p>
              <div className="h-16 flex items-end justify-center font-bold text-slate-900 border-b border-slate-300 pb-1 mx-6">
                ( {family.headName} )
              </div>
            </div>
            <div>
              <p className="text-slate-500">Pemimpin COOL</p>
              <div className="h-16 flex items-end justify-center font-bold text-slate-900 border-b border-slate-300 pb-1 mx-6">
                ( {cool?.leaderName || '..........................'} )
              </div>
            </div>
            <div>
              <p className="text-slate-500">Gembala Sidang GBI Love Inhil</p>
              <div className="h-16 flex items-end justify-center font-bold text-slate-900 border-b border-slate-300 pb-1 mx-6">
                ( {churchSettings.seniorPastor} )
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
