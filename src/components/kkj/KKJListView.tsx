import React, { useState } from 'react';
import { Family } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { KKJDigitalCard } from './KKJDigitalCard';
import { KKJFormModal } from './KKJFormModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import {
  Users,
  Search,
  Plus,
  Printer,
  Edit2,
  Trash2,
  FileText,
  Filter,
  Download,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const KKJListView: React.FC = () => {
  const { families, members, coolGroups, deleteFamily } = useChurch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCOOL, setSelectedCOOL] = useState('ALL');
  const [selectedFamilyForCard, setSelectedFamilyForCard] = useState<Family | null>(null);
  const [familyToEdit, setFamilyToEdit] = useState<Family | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState<Family | null>(null);

  // Filters
  const filteredFamilies = families.filter(f => {
    const matchSearch =
      f.headName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.kkjNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.whatsappNumber && f.whatsappNumber.includes(searchQuery));

    const matchCOOL = selectedCOOL === 'ALL' || f.coolId === selectedCOOL;

    return matchSearch && matchCOOL;
  });

  const handleEdit = (fam: Family) => {
    setFamilyToEdit(fam);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setFamilyToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (familyToDelete) {
      deleteFamily(familyToDelete.id);
      setFamilyToDelete(null);
    }
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = ['No KKJ', 'Kode Keluarga', 'Nama Kepala Keluarga', 'Alamat', 'Kota', 'No WhatsApp', 'Jumlah Anggota', 'COOL'];
    const rows = filteredFamilies.map(f => {
      const cool = coolGroups.find(c => c.id === f.coolId);
      return [
        `"${f.kkjNumber}"`,
        `"${f.familyCode}"`,
        `"${f.headName}"`,
        `"${f.address}"`,
        `"${f.city || 'Tembilahan'}"`,
        `"${f.whatsappNumber || '-'}"`,
        f.memberIds.length,
        `"${cool?.coolName || '-'}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_KKJ_GBI_Love_Inhil_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Administrasi</span>
            <span>•</span>
            <span className="text-blue-600">Kartu Keluarga Jemaat (KKJ)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Data Keluarga & Kartu Keluarga Jemaat
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {families.length} Keluarga terdaftar dengan otentikasi QR Code resmi.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah KKJ Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama kepala keluarga, no KKJ, alamat..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">COOL:</span>
          <select
            value={selectedCOOL}
            onChange={e => setSelectedCOOL(e.target.value)}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua COOL</option>
            {coolGroups.map(c => (
              <option key={c.id} value={c.id}>{c.coolName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Families Table (Clean Utility Minimal) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">No. KKJ & Kode</th>
                <th className="px-5 py-3.5">Kepala Keluarga</th>
                <th className="px-5 py-3.5">Domisili / Alamat</th>
                <th className="px-4 py-3.5 text-center">Anggota</th>
                <th className="px-4 py-3.5">Komunitas (COOL)</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600 divide-y divide-slate-100">
              {filteredFamilies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-xs">Tidak ada data Kartu Keluarga Jemaat.</p>
                  </td>
                </tr>
              ) : (
                filteredFamilies.map(fam => {
                  const cool = coolGroups.find(c => c.id === fam.coolId);
                  const memberCount = fam.memberIds.length;

                  return (
                    <tr key={fam.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 block font-mono">{fam.kkjNumber}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{fam.familyCode}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 block">{fam.headName}</span>
                        <span className="text-[10px] text-slate-500">{fam.whatsappNumber || 'Tanpa No HP'}</span>
                      </td>
                      <td className="px-5 py-4 max-w-xs truncate">
                        <span className="text-slate-700 block truncate">{fam.address}</span>
                        <span className="text-[10px] text-slate-400">{fam.city || 'Tembilahan'}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {memberCount} Jiwa
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-slate-800 text-xs block">
                          {cool?.coolName || '-'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {cool ? `Ketua: ${cool.leaderName}` : 'Belum di COOL'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedFamilyForCard(fam)}
                            title="Buka / Cetak KKJ Resmi"
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-blue-300" />
                            <span>KKJ Digital</span>
                          </button>
                          <button
                            onClick={() => handleEdit(fam)}
                            title="Edit Data KKJ"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setFamilyToDelete(fam)}
                            title="Hapus KKJ"
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

      {/* Digital KKJ Modal */}
      {selectedFamilyForCard && (
        <KKJDigitalCard
          family={selectedFamilyForCard}
          onClose={() => setSelectedFamilyForCard(null)}
        />
      )}

      {/* Create / Edit Form Modal */}
      <KKJFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editFamily={familyToEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!familyToDelete}
        title="Hapus Kartu Keluarga Jemaat"
        message={`Apakah Anda yakin ingin menghapus KKJ No. ${familyToDelete?.kkjNumber} (${familyToDelete?.headName})? Data anggota tidak akan terhapus dari Master Data, namun tautan keluarga akan dilepas.`}
        confirmLabel="Hapus KKJ"
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setFamilyToDelete(null)}
      />
    </div>
  );
};
