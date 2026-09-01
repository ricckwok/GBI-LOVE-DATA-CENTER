import React, { useState } from 'react';
import { ChurchMember, FamilyRelationLabels, MemberStatus } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { MemberDetailModal } from './MemberDetailModal';
import { MemberFormModal } from './MemberFormModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import {
  UserCheck,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  Phone,
  QrCode,
  CheckCircle2,
  Cake
} from 'lucide-react';

export const MemberListView: React.FC = () => {
  const { members, families, coolGroups, deleteMember, sendBirthdayMessage } = useChurch();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');
  const [coolFilter, setCoolFilter] = useState<string>('ALL');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('ALL');

  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState<ChurchMember | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<ChurchMember | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<ChurchMember | null>(null);

  const calculateAge = (birthDateStr: string) => {
    if (!birthDateStr) return 0;
    const b = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - b.getFullYear();
    const m = today.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
    return age;
  };

  // Filter Logic
  const filteredMembers = members.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      m.fullName.toLowerCase().includes(q) ||
      m.memberNumber.toLowerCase().includes(q) ||
      (m.whatsappNumber && m.whatsappNumber.includes(q)) ||
      (m.address && m.address.toLowerCase().includes(q)) ||
      (m.occupation && m.occupation.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'ALL' || m.memberStatus === statusFilter;
    const matchGender = genderFilter === 'ALL' || m.gender === genderFilter;
    const matchCOOL = coolFilter === 'ALL' || m.coolId === coolFilter;

    // Age group
    let matchAge = true;
    const age = calculateAge(m.birthDate);
    if (ageGroupFilter === 'CHILD') matchAge = age < 13;
    else if (ageGroupFilter === 'YOUTH') matchAge = age >= 13 && age <= 25;
    else if (ageGroupFilter === 'ADULT') matchAge = age >= 26 && age <= 55;
    else if (ageGroupFilter === 'SENIOR') matchAge = age >= 56;

    return matchSearch && matchStatus && matchGender && matchCOOL && matchAge;
  });

  const handleCreateNew = () => {
    setMemberToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (mem: ChurchMember) => {
    setMemberToEdit(mem);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete.id);
      setMemberToDelete(null);
    }
  };

  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case 'AKTIF':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'TIDAK_AKTIF':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PINDAH':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MENINGGAL':
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'No Induk',
      'Nama Lengkap',
      'Panggilan',
      'L/P',
      'Hubungan Keluarga',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Usia',
      'Status Nikah',
      'Alamat',
      'No WhatsApp',
      'COOL',
      'Status Keanggotaan'
    ];

    const rows = filteredMembers.map(m => {
      const cool = coolGroups.find(c => c.id === m.coolId);
      return [
        `"${m.memberNumber}"`,
        `"${m.fullName}"`,
        `"${m.nickname || '-'}"`,
        m.gender,
        `"${FamilyRelationLabels[m.familyRelation || 7]}"`,
        `"${m.birthPlace || 'Tembilahan'}"`,
        m.birthDate,
        calculateAge(m.birthDate),
        m.maritalStatus || 1,
        `"${m.address || '-'}"`,
        `"${m.whatsappNumber || '-'}"`,
        `"${cool?.coolName || '-'}"`,
        m.memberStatus
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Data_Jemaat_GBI_Love_Inhil_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Administrasi</span>
            <span>•</span>
            <span className="text-blue-600">Master Data Jemaat</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Master Data Jemaat Terintegrasi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Single Source of Truth: Menghubungkan KKJ, COOL, Sakramen, Pengerja & Presensi.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Master CSV</span>
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Jemaat Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, no induk, no HP, pekerjaan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="AKTIF">Status: Aktif</option>
            <option value="TIDAK_AKTIF">Status: Tidak Aktif</option>
            <option value="PINDAH">Status: Pindah</option>
            <option value="MENINGGAL">Status: Meninggal</option>
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={e => setGenderFilter(e.target.value)}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua Gender</option>
            <option value="L">Laki-laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>

          {/* COOL Filter */}
          <select
            value={coolFilter}
            onChange={e => setCoolFilter(e.target.value)}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua COOL</option>
            {coolGroups.map(c => (
              <option key={c.id} value={c.id}>{c.coolName}</option>
            ))}
          </select>

          {/* Age Bracket */}
          <select
            value={ageGroupFilter}
            onChange={e => setAgeGroupFilter(e.target.value)}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua Kategori Usia</option>
            <option value="CHILD">Anak (&lt;13 thn)</option>
            <option value="YOUTH">Pemuda (13-25 thn)</option>
            <option value="ADULT">Dewasa (26-55 thn)</option>
            <option value="SENIOR">Lansia (56+ thn)</option>
          </select>
        </div>
      </div>

      {/* Member Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Nama & No Induk</th>
                <th className="px-4 py-3.5">Klm / Usia</th>
                <th className="px-4 py-3.5">Hub. Keluarga (KKJ)</th>
                <th className="px-4 py-3.5">COOL</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">WhatsApp</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600 divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <UserCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-xs">Tidak ada data jemaat yang sesuai filter.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map(mem => {
                  const cool = coolGroups.find(c => c.id === mem.coolId);
                  const fam = families.find(f => f.id === mem.familyId);
                  const age = calculateAge(mem.birthDate);

                  return (
                    <tr key={mem.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 flex items-center space-x-3">
                        {mem.photoUrl ? (
                          <img
                            src={mem.photoUrl}
                            alt={mem.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                            {mem.fullName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">{mem.fullName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{mem.memberNumber}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-800">{mem.gender}</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="font-medium text-slate-600">{age} Thn</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800 block">
                          {FamilyRelationLabels[mem.familyRelation || 7]}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[140px] block">
                          {fam ? `KKJ: ${fam.headName}` : 'Belum di KKJ'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800 block truncate max-w-[130px]">
                          {cool?.coolName || '-'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {cool ? cool.leaderName : 'Belum ada COOL'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 text-[10px] rounded-full border font-bold ${getStatusBadge(mem.memberStatus)}`}>
                          {mem.memberStatus}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono text-slate-700 block">{mem.whatsappNumber || '-'}</span>
                        <span className={`text-[9px] font-semibold ${mem.waOptIn ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {mem.waOptIn ? 'Opt-in Aktif' : 'Opt-in Off'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedMemberForDetail(mem)}
                            title="Lihat Profil Lengkap"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(mem)}
                            title="Edit Data Jemaat"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setMemberToDelete(mem)}
                            title="Hapus Jemaat"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMemberForDetail && (
        <MemberDetailModal
          member={selectedMemberForDetail}
          onClose={() => setSelectedMemberForDetail(null)}
          onEdit={() => {
            const mem = selectedMemberForDetail;
            setSelectedMemberForDetail(null);
            handleEdit(mem);
          }}
        />
      )}

      {/* Member Form Modal */}
      <MemberFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editMember={memberToEdit}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!memberToDelete}
        title="Hapus Master Data Jemaat"
        message={`Apakah Anda yakin ingin menghapus data ${memberToDelete?.fullName} (${memberToDelete?.memberNumber}) dari sistem? Data ini akan dilepaskan dari seluruh modul.`}
        confirmLabel="Hapus Data"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setMemberToDelete(null)}
      />
    </div>
  );
};
