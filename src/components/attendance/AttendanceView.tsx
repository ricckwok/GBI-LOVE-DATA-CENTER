import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { WorshipService, AttendanceRecord } from '../../types';
import {
  CalendarCheck,
  QrCode,
  Search,
  Plus,
  Trash2,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Volume2
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const {
    worshipServices,
    attendanceRecords,
    members,
    addWorshipService,
    deleteWorshipService,
    checkInMember,
    deleteAttendance,
    showToast
  } = useChurch();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(worshipServices[0]?.id || '');
  const [qrInput, setQrInput] = useState('');
  const [searchMemberQuery, setSearchMemberQuery] = useState('');
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);

  // New Service Form
  const [newTitle, setNewTitle] = useState('Ibadah Raya Minggu');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState('09:00 WIB');
  const [newSpeaker, setNewSpeaker] = useState('Pdt. Timotius Hendrik');
  const [newTheme, setNewTheme] = useState('Hidup Penuh Kemenangan');

  const activeService = worshipServices.find(s => s.id === selectedServiceId) || worshipServices[0];
  const serviceRecords = attendanceRecords.filter(a => a.serviceId === activeService?.id);

  const handleScanOrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    if (!activeService) {
      showToast('error', 'Pilih Sesi', 'Buka sesi ibadah terlebih dahulu.');
      return;
    }

    const res = checkInMember(activeService.id, qrInput.trim(), 'QR_SCAN');
    if (res.success) {
      setQrInput('');
    } else {
      showToast('warning', 'Presensi Gagal', res.message);
    }
  };

  const handleManualCheckIn = (memberId: string) => {
    if (!activeService) return;
    const res = checkInMember(activeService.id, memberId, 'MANUAL_OPERATOR');
    if (!res.success) {
      showToast('warning', 'Presensi Gagal', res.message);
    }
    setSearchMemberQuery('');
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addWorshipService({
      worshipTypeId: 'WTP-01',
      serviceTitle: newTitle,
      serviceDate: newDate,
      startTime: newStartTime,
      speakerName: newSpeaker,
      sermonTheme: newTheme,
      isSessionOpen: true
    });
    setSelectedServiceId(created.id);
    setIsNewServiceModalOpen(false);
  };

  // Export Attendance CSV
  const handleExportCSV = () => {
    if (!activeService) return;
    const headers = ['No', 'Nama Jemaat', 'No Induk', 'No KKJ', 'COOL', 'Waktu Presensi', 'Metode', 'Operator'];
    const rows = serviceRecords.map((rec, i) => [
      i + 1,
      `"${rec.memberName}"`,
      `"${rec.memberNumber || '-'}"`,
      `"${rec.kkjNumber || '-'}"`,
      `"${rec.coolName || '-'}"`,
      `"${new Date(rec.checkInTime).toLocaleTimeString('id-ID')}"`,
      rec.checkInMethod,
      `"${rec.operatorName}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `Presensi_${activeService.serviceTitle.replace(/ /g, '_')}_${activeService.serviceDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick suggestions for manual search
  const memberSuggestions = searchMemberQuery.trim()
    ? members.filter(m =>
        m.memberStatus !== 'MENINGGAL' &&
        (m.fullName.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
          m.memberNumber.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
          (m.whatsappNumber && m.whatsappNumber.includes(searchMemberQuery)))
      ).slice(0, 5)
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Operasional</span>
            <span>•</span>
            <span className="text-blue-600">Presensi Kehadiran Ibadah</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Check-In Presensi Ibadah & QR Scanner
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem presensi terpadu dengan perlindungan anti-duplikasi dan pembaruan riwayat kehadiran otomatis.
          </p>
        </div>

        <button
          onClick={() => setIsNewServiceModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buka Sesi Ibadah Baru</span>
        </button>
      </div>

      {/* Sesi Ibadah Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <CalendarCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Pilih Sesi Ibadah Aktif:</span>
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="block font-bold text-slate-900 text-sm bg-transparent border-0 focus:outline-hidden cursor-pointer"
            >
              {worshipServices.map(s => (
                <option key={s.id} value={s.id}>
                  {s.serviceTitle} • {new Date(s.serviceDate).toLocaleDateString('id-ID')} ({s.startTime})
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeService && (
          <div className="flex items-center space-x-4 text-xs">
            <div className="hidden md:block text-right">
              <p className="font-bold text-slate-800">{activeService.speakerName}</p>
              <p className="text-[10px] text-slate-500 italic">"{activeService.sermonTheme}"</p>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-blue-600 block">Total Hadir</span>
              <span className="text-base font-black text-blue-800">{serviceRecords.length} Jiwa</span>
            </div>
            <button
              onClick={handleExportCSV}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
              title="Ekspor Data Presensi Sesi Ini"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Scanning & Manual Check-in Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Scanner / Input Box */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <QrCode className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Scanner / Input QR Code</h3>
          </div>

          <form onSubmit={handleScanOrSubmit} className="space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              Arahkan barcode scanner / paste token QR jemaat / ketik nomor induk jemaat:
            </p>

            <div className="relative">
              <input
                type="text"
                autoFocus
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                placeholder="Scan / Ketik No Induk..."
                className="w-full text-xs font-mono font-bold p-3 bg-slate-50 border-2 border-blue-400 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Proses Check-In</span>
            </button>
          </form>

          {/* Manual Search Fallback */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block">Atau Cari Jemaat Secara Manual:</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik nama jemaat..."
                value={searchMemberQuery}
                onChange={e => setSearchMemberQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>

            {memberSuggestions.length > 0 && (
              <div className="space-y-1 bg-white border border-slate-200 rounded-xl p-1 shadow-md">
                {memberSuggestions.map(mem => (
                  <div
                    key={mem.id}
                    onClick={() => handleManualCheckIn(mem.id)}
                    className="p-2 hover:bg-blue-50 rounded-lg flex items-center justify-between cursor-pointer text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{mem.fullName}</span>
                      <span className="text-[10px] text-slate-400">{mem.memberNumber}</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                      + Hadir
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Live Attendance Roster */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daftar Jemaat Hadir Pada Sesi Ini</h3>
              <p className="text-[11px] text-slate-500">Urutan realtime dari jemaat yang baru saja check-in</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              Live Realtime ({serviceRecords.length})
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Nama Jemaat</th>
                  <th className="px-4 py-3">No. KKJ / KK</th>
                  <th className="px-4 py-3">COOL</th>
                  <th className="px-4 py-3">Waktu Check-In</th>
                  <th className="px-4 py-3">Metode</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {serviceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold">Belum ada jemaat yang presensi pada sesi ibadah ini.</p>
                      <p className="text-[11px] mt-1">Gunakan scanner QR di sebelah kiri untuk memulai check-in.</p>
                    </td>
                  </tr>
                ) : (
                  serviceRecords.map((record, index) => (
                    <tr key={record.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3 font-bold text-slate-900">
                        {index + 1}. {record.memberName}
                        <span className="text-[10px] text-slate-400 font-mono block">{record.memberNumber}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{record.kkjNumber || '-'}</td>
                      <td className="px-4 py-3 font-medium text-blue-700">{record.coolName || '-'}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {new Date(record.checkInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {record.checkInMethod}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => deleteAttendance(record.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Batalkan Presensi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Service Modal */}
      {isNewServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Buka Sesi Ibadah Baru
            </h3>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul / Nama Sesi Ibadah *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ibadah Raya 1 / Ibadah Youth"
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Ibadah *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jam Mulai</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pengkhotbah / Pembicara</label>
                <input
                  type="text"
                  value={newSpeaker}
                  onChange={e => setNewSpeaker(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tema Khotbah</label>
                <input
                  type="text"
                  value={newTheme}
                  onChange={e => setNewTheme(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsNewServiceModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold">Buka Sesi Presensi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
