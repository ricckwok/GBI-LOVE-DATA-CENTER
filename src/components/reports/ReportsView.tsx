import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import {
  FileBarChart2,
  Printer,
  Download,
  Users,
  Award,
  HeartHandshake,
  Calendar,
  CheckCircle2,
  TrendingUp,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const ReportsView: React.FC = () => {
  const {
    members,
    families,
    coolGroups,
    waterBaptisms,
    marriages,
    attendanceRecords,
    worshipServices,
    churchSettings,
    stats
  } = useChurch();

  const [reportType, setReportType] = useState<'DEMOGRAPHIC' | 'COOL_SUMMARY' | 'ATTENDANCE_SUMMARY' | 'SACRAMENTS'>('DEMOGRAPHIC');

  // Demographic Chart Data
  const ageDistributionData = [
    { name: 'Anak (<13)', count: stats.ageGroups.children, fill: '#3b82f6' },
    { name: 'Pemuda (13-25)', count: stats.ageGroups.youth, fill: '#8b5cf6' },
    { name: 'Dewasa (26-55)', count: stats.ageGroups.adults, fill: '#10b981' },
    { name: 'Lansia (56+)', count: stats.ageGroups.seniors, fill: '#f59e0b' }
  ];

  const genderData = [
    { name: 'Laki-laki', value: stats.totalMale, color: '#2563eb' },
    { name: 'Perempuan', value: stats.totalFemale, color: '#ec4899' }
  ];

  // COOL Summary Data
  const coolSummary = coolGroups.map(cool => {
    const mems = members.filter(m => m.coolId === cool.id);
    return {
      name: cool.coolName,
      leader: cool.leaderName,
      totalMembers: mems.length,
      male: mems.filter(m => m.gender === 'L').length,
      female: mems.filter(m => m.gender === 'P').length
    };
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Eksekutif & Pastoral</span>
            <span>•</span>
            <span className="text-blue-600">Laporan & Statistik</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Laporan Eksekutif & Statistik Gereja
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis demografi, rekapitulasi keanggotaan KKJ, pertumbuhan COOL, dan sakramen gerejawi.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Laporan</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1 print:hidden">
        <button
          onClick={() => setReportType('DEMOGRAPHIC')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            reportType === 'DEMOGRAPHIC' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Rekapitulasi Demografi & Jemaat
        </button>

        <button
          onClick={() => setReportType('COOL_SUMMARY')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            reportType === 'COOL_SUMMARY' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Rekapitulasi Komunitas Kasih (COOL)
        </button>

        <button
          onClick={() => setReportType('ATTENDANCE_SUMMARY')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            reportType === 'ATTENDANCE_SUMMARY' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Rekapitulasi Presensi Ibadah
        </button>
      </div>

      {/* Printable Report Header for Official Paper */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-xl font-black uppercase text-slate-900">{churchSettings.churchName}</h1>
        <p className="text-xs text-slate-600 uppercase font-semibold">{churchSettings.synod} • {churchSettings.address} • Telp: {churchSettings.phone}</p>
        <h2 className="text-base font-bold text-blue-900 mt-2 uppercase tracking-wide">
          LAPORAN RESMI ADMINISTRASI & KEANGGOTAAN GEREJA
        </h2>
        <p className="text-[10px] text-slate-500">Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
      </div>

      {/* Demographic Report Section */}
      {reportType === 'DEMOGRAPHIC' && (
        <div className="space-y-6">
          {/* Summary Stat Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Anggota Jemaat</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.totalMembers} Jiwa</span>
              <span className="text-[10px] text-emerald-600 font-bold">{stats.activeMembers} Terdaftar Aktif</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Kepala Keluarga</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.totalFamilies} KKJ</span>
              <span className="text-[10px] text-blue-600 font-bold">Kartu Keluarga Jemaat</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Sudah Dibaptis Selam</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.baptizedMembers} Jiwa</span>
              <span className="text-[10px] text-purple-600 font-bold">
                {Math.round((stats.baptizedMembers / (stats.totalMembers || 1)) * 100)}% dari Total Jemaat
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Terdaftar Dalam COOL</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.membersInCOOL} Jiwa</span>
              <span className="text-[10px] text-amber-600 font-bold">{stats.totalCOOLGroups} Kelompok COOL</span>
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
            {/* Age Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Distribusi Kategori Usia Jemaat</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Komposisi Gender Jemaat</h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COOL Summary Report Section */}
      {reportType === 'COOL_SUMMARY' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Rekapitulasi Anggota Per Kelompok Komunitas Kasih (COOL)</h3>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Nama Kelompok COOL</th>
                <th className="px-4 py-3">Pemimpin / Ketua</th>
                <th className="px-4 py-3 text-center">Pria</th>
                <th className="px-4 py-3 text-center">Wanita</th>
                <th className="px-5 py-3 text-right">Total Anggota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {coolSummary.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{item.name}</td>
                  <td className="px-4 py-3.5 font-medium">{item.leader}</td>
                  <td className="px-4 py-3.5 text-center font-mono">{item.male}</td>
                  <td className="px-4 py-3.5 text-center font-mono">{item.female}</td>
                  <td className="px-5 py-3.5 text-right font-black text-blue-700">{item.totalMembers} Jiwa</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance Summary */}
      {reportType === 'ATTENDANCE_SUMMARY' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Rekapitulasi Kehadiran Ibadah Raya & Kebaktian Khusus</h3>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Nama Sesi Ibadah</th>
                <th className="px-4 py-3">Tanggal Pelaksanaan</th>
                <th className="px-4 py-3">Pembicara / Pengkhotbah</th>
                <th className="px-5 py-3 text-right">Jumlah Hadir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {worshipServices.map(svc => {
                const count = attendanceRecords.filter(a => a.serviceId === svc.id).length;
                return (
                  <tr key={svc.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{svc.serviceTitle}</td>
                    <td className="px-4 py-3.5">{new Date(svc.serviceDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</td>
                    <td className="px-4 py-3.5">{svc.speakerName}</td>
                    <td className="px-5 py-3.5 text-right font-black text-emerald-700">{count} Jiwa</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Official Sign-off on Print */}
      <div className="hidden print:flex justify-between items-end pt-12 mt-12 text-xs border-t border-slate-300">
        <div>
          <p className="text-slate-500">Sekretariat GBI Love Inhil</p>
          <div className="h-16 flex items-end font-bold text-slate-900">
            ( Bagian Tata Usaha Gereja )
          </div>
        </div>

        <div className="text-right">
          <p className="text-slate-500">Tembilahan, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
          <p className="text-slate-500">Gembala Sidang</p>
          <div className="h-16 flex items-end justify-end font-bold text-slate-900">
            ( {churchSettings.seniorPastor} )
          </div>
        </div>
      </div>
    </div>
  );
};
