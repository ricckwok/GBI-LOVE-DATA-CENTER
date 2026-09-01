import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { WaterBaptism, ChildDedication, MarriageRecord, HolySpiritBaptism, DeathRecord } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { QrCodeDisplay } from '../ui/QrCodeDisplay';
import { GBILogo } from '../common/GBILogo';
import {
  BookOpen,
  Plus,
  Search,
  Printer,
  Trash2,
  Edit2,
  Award,
  Heart,
  Flame,
  ShieldAlert,
  UserCheck,
  X,
  Download
} from 'lucide-react';

export const SacramentsView: React.FC = () => {
  const {
    members,
    churchSettings,
    waterBaptisms,
    addWaterBaptism,
    deleteWaterBaptism,
    childDedications,
    addChildDedication,
    deleteChildDedication,
    holySpiritBaptisms,
    addHolySpiritBaptism,
    deleteHolySpiritBaptism,
    marriages,
    addMarriage,
    deleteMarriage,
    deathRecords,
    addDeathRecord,
    deleteDeathRecord,
    showToast
  } = useChurch();

  const [activeSubTab, setActiveSubTab] = useState<'water' | 'child' | 'spirit' | 'marriage' | 'death'>('water');
  const [searchQuery, setSearchQuery] = useState('');

  // Certificate Preview Modal State
  const [certificateData, setCertificateData] = useState<{
    type: string;
    title: string;
    recipientName: string;
    certNumber: string;
    date: string;
    ministerName: string;
    detail1?: string;
    detail2?: string;
  } | null>(null);

  // Form Modals
  const [isWaterFormOpen, setIsWaterFormOpen] = useState(false);
  const [isChildFormOpen, setIsChildFormOpen] = useState(false);
  const [isSpiritFormOpen, setIsSpiritFormOpen] = useState(false);
  const [isMarriageFormOpen, setIsMarriageFormOpen] = useState(false);
  const [isDeathFormOpen, setIsDeathFormOpen] = useState(false);

  // Form Fields
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [ministerName, setMinisterName] = useState(churchSettings.seniorPastor);
  const [baptismDate, setBaptismDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = useState('Kolam Baptisan GBI Love Inhil');
  const [certificateNumber, setCertificateNumber] = useState('');

  // Child dedication extras
  const [childName, setChildName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');

  // Marriage extras
  const [spouseMemberId, setSpouseMemberId] = useState('');
  const [spouseName, setSpouseName] = useState('');
  const [holyMatrimonyNumber, setHolyMatrimonyNumber] = useState('');

  // Death extras
  const [deathDate, setDeathDate] = useState(new Date().toISOString().split('T')[0]);
  const [deathPlace, setDeathPlace] = useState('RSUD Puri Husada Tembilahan');

  // Submit Handlers
  const handleWaterBaptismSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === selectedMemberId);
    if (!mem) {
      showToast('error', 'Validasi', 'Pilih jemaat yang dibaptis.');
      return;
    }

    addWaterBaptism({
      memberId: mem.id,
      memberName: mem.fullName,
      baptismDate,
      ministerName,
      locationName,
      certificateNumber: certificateNumber || `BS-${Date.now().toString().slice(-4)}`
    });

    setIsWaterFormOpen(false);
  };

  const handleChildDedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      showToast('error', 'Validasi', 'Nama anak wajib diisi.');
      return;
    }

    addChildDedication({
      childName,
      childMemberId: selectedMemberId || undefined,
      fatherName,
      motherName,
      dedicationDate: baptismDate,
      ministerName,
      churchLocation: churchSettings.churchName,
      certificateNumber: certificateNumber || `PA-${Date.now().toString().slice(-4)}`
    });

    setIsChildFormOpen(false);
  };

  const handleSpiritBaptismSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === selectedMemberId);
    if (!mem) return;

    addHolySpiritBaptism({
      memberId: mem.id,
      memberName: mem.fullName,
      baptismDate,
      ministerName,
      notes: 'Berbahasa roh dan mengalami kepenuhan Roh Kudus.'
    });

    setIsSpiritFormOpen(false);
  };

  const handleMarriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === selectedMemberId);
    if (!mem || !spouseName) {
      showToast('error', 'Validasi', 'Pilih jemaat dan nama pasangan.');
      return;
    }

    addMarriage({
      memberId: mem.id,
      memberName: mem.fullName,
      spouseMemberId: spouseMemberId || undefined,
      spouseName,
      marriageDate: baptismDate,
      ministerName,
      holyMatrimonyNumber: holyMatrimonyNumber || `NIKAH/${new Date().getFullYear()}/${(marriages.length + 1).toString().padStart(3, '0')}`,
      churchLocation: churchSettings.churchName
    });

    setIsMarriageFormOpen(false);
  };

  const handleDeathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === selectedMemberId);
    if (!mem) return;

    addDeathRecord({
      memberId: mem.id,
      memberName: mem.fullName,
      deathDate,
      deathPlace,
      ministerName,
      funeralServiceDetails: 'Ibadah pelepasan dan pemakaman Kristen.'
    });

    setIsDeathFormOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Operasional</span>
            <span>•</span>
            <span className="text-blue-600">Sakramen & Riwayat Gerejawi</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Riwayat Sakramen & Pencatatan Gerejawi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan Baptisan Selam, Penyerahan Anak, Roh Kudus, Pernikahan Kudus & Akta Kematian.
          </p>
        </div>

        {/* Dynamic Add Button */}
        <div>
          {activeSubTab === 'water' && (
            <button
              onClick={() => { setSelectedMemberId(''); setIsWaterFormOpen(true); }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Baptisan Selam</span>
            </button>
          )}
          {activeSubTab === 'child' && (
            <button
              onClick={() => { setChildName(''); setIsChildFormOpen(true); }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Penyerahan Anak</span>
            </button>
          )}
          {activeSubTab === 'spirit' && (
            <button
              onClick={() => { setSelectedMemberId(''); setIsSpiritFormOpen(true); }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Baptisan Roh</span>
            </button>
          )}
          {activeSubTab === 'marriage' && (
            <button
              onClick={() => { setSelectedMemberId(''); setSpouseName(''); setIsMarriageFormOpen(true); }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pernikahan Kudus</span>
            </button>
          )}
          {activeSubTab === 'death' && (
            <button
              onClick={() => { setSelectedMemberId(''); setIsDeathFormOpen(true); }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Kematian</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('water')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'water' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Baptisan Selam ({waterBaptisms.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('child')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'child' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Penyerahan Anak ({childDedications.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('spirit')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'spirit' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Baptisan Roh Kudus ({holySpiritBaptisms.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('marriage')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'marriage' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Pernikahan Kudus ({marriages.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('death')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'death' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Kematian / Berpulang ({deathRecords.length})</span>
        </button>
      </div>

      {/* Main Table for Active Subtab */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Baptisan Selam Table */}
        {activeSubTab === 'water' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Nama Jemaat</th>
                <th className="px-4 py-3.5">Tanggal Baptisan</th>
                <th className="px-4 py-3.5">Pendeta / Pelayan</th>
                <th className="px-4 py-3.5">No. Sertifikat</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {waterBaptisms.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{item.memberName}</td>
                  <td className="px-4 py-3.5">{new Date(item.baptismDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td className="px-4 py-3.5 font-medium">{item.ministerName}</td>
                  <td className="px-4 py-3.5 font-mono text-blue-700">{item.certificateNumber || item.registrationNumber}</td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => setCertificateData({
                        type: 'BAPTISAN SELAM',
                        title: 'SERTIFIKAT BAPTISAN SELAM',
                        recipientName: item.memberName,
                        certNumber: item.certificateNumber || item.registrationNumber,
                        date: item.baptismDate,
                        ministerName: item.ministerName,
                        detail1: `Telah dibaptis selam sesuai amanat agung Tuhan Yesus Kristus di ${item.locationName}.`
                      })}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3 text-blue-300" />
                      <span>Cetak Sertifikat</span>
                    </button>
                    <button
                      onClick={() => deleteWaterBaptism(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Penyerahan Anak Table */}
        {activeSubTab === 'child' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Nama Anak</th>
                <th className="px-4 py-3.5">Nama Orang Tua</th>
                <th className="px-4 py-3.5">Tanggal Penyerahan</th>
                <th className="px-4 py-3.5">Pendeta Melayani</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {childDedications.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{item.childName}</td>
                  <td className="px-4 py-3.5">{item.fatherName} & {item.motherName}</td>
                  <td className="px-4 py-3.5">{new Date(item.dedicationDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td className="px-4 py-3.5 font-medium">{item.ministerName}</td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => setCertificateData({
                        type: 'PENYERAHAN ANAK',
                        title: 'SERTIFIKAT PENYERAHAN ANAK',
                        recipientName: item.childName,
                        certNumber: item.certificateNumber || item.registrationNumber,
                        date: item.dedicationDate,
                        ministerName: item.ministerName,
                        detail1: `Putra / Putri dari Bpk. ${item.fatherName} & Ibu ${item.motherName}, telah diserahkan ke dalam perlindungan Tuhan Yesus Kristus.`
                      })}
                      className="px-2.5 py-1 bg-purple-900 hover:bg-purple-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3 text-purple-300" />
                      <span>Cetak Piagam</span>
                    </button>
                    <button
                      onClick={() => deleteChildDedication(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Baptisan Roh Table */}
        {activeSubTab === 'spirit' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Nama Jemaat</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Pendeta / Pelayan</th>
                <th className="px-4 py-3.5">Catatan Manifestasi</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {holySpiritBaptisms.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{item.memberName}</td>
                  <td className="px-4 py-3.5">{new Date(item.baptismDate).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-3.5 font-medium">{item.ministerName || '-'}</td>
                  <td className="px-4 py-3.5 text-slate-500">{item.notes || 'Bahasa Roh'}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => deleteHolySpiritBaptism(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Marriage Table */}
        {activeSubTab === 'marriage' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Pasangan Mempelai</th>
                <th className="px-4 py-3.5">Tanggal Pernikahan</th>
                <th className="px-4 py-3.5">Pendeta Peneguh</th>
                <th className="px-4 py-3.5">No. Akta Nikah</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {marriages.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{item.memberName} & {item.spouseName}</td>
                  <td className="px-4 py-3.5">{new Date(item.marriageDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td className="px-4 py-3.5 font-medium">{item.ministerName}</td>
                  <td className="px-4 py-3.5 font-mono text-rose-700">{item.holyMatrimonyNumber}</td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => setCertificateData({
                        type: 'PERNIKAHAN KUDUS',
                        title: 'AKTA PEMBERKATAN PERNIKAHAN KUDUS',
                        recipientName: `${item.memberName} & ${item.spouseName}`,
                        certNumber: item.holyMatrimonyNumber,
                        date: item.marriageDate,
                        ministerName: item.ministerName,
                        detail1: `Telah dipersatukan dalam Perjanjian Nikah Kudus yang tak terpisahkan di hadapan Allah dan jemaat GBI Love Inhil.`
                      })}
                      className="px-2.5 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center space-x-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3 text-rose-300" />
                      <span>Cetak Akta</span>
                    </button>
                    <button
                      onClick={() => deleteMarriage(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Death Table */}
        {activeSubTab === 'death' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Nama Jemaat</th>
                <th className="px-4 py-3.5">Tanggal Berpulang</th>
                <th className="px-4 py-3.5">Tempat Meninggal</th>
                <th className="px-4 py-3.5">Pelayan Pastoral</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {deathRecords.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{item.memberName}</td>
                  <td className="px-4 py-3.5">{new Date(item.deathDate).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-3.5">{item.deathPlace || '-'}</td>
                  <td className="px-4 py-3.5 font-medium">{item.ministerName}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => deleteDeathRecord(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Official Certificate Preview & Print Modal */}
      {certificateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-auto overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <span className="text-sm font-bold">{certificateData.title}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Sertifikat</span>
                </button>
                <button
                  onClick={() => setCertificateData(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Printable Certificate Canvas */}
            <div className="p-8 sm:p-12 text-center bg-radial from-white via-slate-50 to-amber-50/20 border-8 border-double border-slate-800 m-4 rounded-xl print:m-0 print:border-8">
              <GBILogo className="w-16 h-16 mx-auto mb-2 drop-shadow-sm" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                {churchSettings.churchName}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                {churchSettings.synod} • Tembilahan, Riau
              </p>

              <div className="my-6">
                <h3 className="text-lg font-black text-blue-900 tracking-widest uppercase border-b-2 border-slate-900 inline-block px-4 pb-1">
                  {certificateData.title}
                </h3>
                <p className="text-xs font-mono text-slate-500 mt-1">Nomor: {certificateData.certNumber}</p>
              </div>

              <p className="text-xs text-slate-600">Diberikan dan disahkan kepada:</p>
              <h4 className="text-2xl font-black text-slate-900 my-3 font-serif underline decoration-blue-500 underline-offset-4">
                {certificateData.recipientName}
              </h4>

              <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed my-4">
                {certificateData.detail1}
              </p>

              <div className="mt-8 pt-4 flex items-end justify-between text-xs border-t border-slate-200">
                <div className="text-left">
                  <p className="text-slate-500">Tembilahan, {new Date(certificateData.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <QrCodeDisplay
                    value={`CERT:${certificateData.certNumber}:${certificateData.recipientName}`}
                    size={60}
                    showDownload={false}
                    className="mt-2"
                  />
                </div>

                <div className="text-center">
                  <p className="text-slate-500">Pendeta / Pelayan Kudus</p>
                  <div className="h-14 flex items-end justify-center font-bold text-slate-900 border-b border-slate-400 pb-1 w-48">
                    ( {certificateData.ministerName} )
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Water Baptism Form Modal */}
      {isWaterFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Pencatatan Baptisan Selam</h3>
              <button onClick={() => setIsWaterFormOpen(false)} className="text-slate-400 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleWaterBaptismSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Jemaat *</label>
                <select
                  required
                  value={selectedMemberId}
                  onChange={e => setSelectedMemberId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="">-- Pilih dari Master Data Jemaat --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.memberNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Baptisan Selam *</label>
                <input
                  type="date"
                  required
                  value={baptismDate}
                  onChange={e => setBaptismDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pendeta Melayani *</label>
                <input
                  type="text"
                  required
                  value={ministerName}
                  onChange={e => setMinisterName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Baptisan</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsWaterFormOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold">Simpan Baptisan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Child Dedication Form */}
      {isChildFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Pencatatan Penyerahan Anak</h3>
              <button onClick={() => setIsChildFormOpen(false)} className="text-slate-400 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleChildDedicationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Anak *</label>
                <input
                  type="text"
                  required
                  value={childName}
                  onChange={e => setChildName(e.target.value)}
                  placeholder="Contoh: Timothy Tanoto"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={e => setFatherName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={e => setMotherName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Penyerahan *</label>
                <input
                  type="date"
                  required
                  value={baptismDate}
                  onChange={e => setBaptismDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pendeta Melayani *</label>
                <input
                  type="text"
                  required
                  value={ministerName}
                  onChange={e => setMinisterName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsChildFormOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-lg font-bold">Simpan Penyerahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Marriage Form */}
      {isMarriageFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Pencatatan Pernikahan Kudus</h3>
              <button onClick={() => setIsMarriageFormOpen(false)} className="text-slate-400 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleMarriageSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Mempelai (Jemaat) *</label>
                <select
                  required
                  value={selectedMemberId}
                  onChange={e => setSelectedMemberId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="">-- Pilih Mempelai 1 --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.memberNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pasangan Mempelai *</label>
                <input
                  type="text"
                  required
                  value={spouseName}
                  onChange={e => setSpouseName(e.target.value)}
                  placeholder="Nama Pasangan"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Pemberkatan Nikah *</label>
                <input
                  type="date"
                  required
                  value={baptismDate}
                  onChange={e => setBaptismDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pendeta Peneguh *</label>
                <input
                  type="text"
                  required
                  value={ministerName}
                  onChange={e => setMinisterName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsMarriageFormOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-rose-600 text-white rounded-lg font-bold">Simpan Pernikahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spirit Baptism Form */}
      {isSpiritFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Pencatatan Baptisan Roh Kudus</h3>
              <button onClick={() => setIsSpiritFormOpen(false)} className="text-slate-400 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSpiritBaptismSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Jemaat *</label>
                <select
                  required
                  value={selectedMemberId}
                  onChange={e => setSelectedMemberId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="">-- Pilih Jemaat --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Baptisan Roh</label>
                <input
                  type="date"
                  value={baptismDate}
                  onChange={e => setBaptismDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsSpiritFormOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-amber-600 text-white rounded-lg font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Death Form */}
      {isDeathFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Pencatatan Kematian / Berpulang</h3>
              <button onClick={() => setIsDeathFormOpen(false)} className="text-slate-400 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleDeathSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Jemaat yang Berpulang *</label>
                <select
                  required
                  value={selectedMemberId}
                  onChange={e => setSelectedMemberId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="">-- Pilih Jemaat --</option>
                  {members.filter(m => m.memberStatus !== 'MENINGGAL').map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.memberNumber})</option>
                  ))}
                </select>
                <p className="text-[10px] text-amber-600 mt-1">Status keanggotaan jemaat akan otomatis diset MENINGGAL.</p>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Meninggal *</label>
                <input
                  type="date"
                  required
                  value={deathDate}
                  onChange={e => setDeathDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tempat Meninggal</label>
                <input
                  type="text"
                  value={deathPlace}
                  onChange={e => setDeathPlace(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsDeathFormOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-slate-800 text-white rounded-lg font-bold">Catat Kematian</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
