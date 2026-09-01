import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { Worker } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import {
  Briefcase,
  Plus,
  Search,
  Users,
  Edit2,
  Trash2,
  Calendar,
  X,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

export const WorkersView: React.FC = () => {
  const { workers, workerDepartments, members, addWorker, updateWorker, deleteWorker, showToast } = useChurch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | undefined>(undefined);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);

  // Form Fields
  const [memberId, setMemberId] = useState('');
  const [departmentId, setDepartmentId] = useState(workerDepartments[0]?.id || '');
  const [positionTitle, setPositionTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [skNumber, setSkNumber] = useState('');

  const openForm = (w?: Worker) => {
    if (w) {
      setEditingWorker(w);
      setMemberId(w.memberId);
      setDepartmentId(w.departmentId);
      setPositionTitle(w.positionTitle);
      setAppointmentDate(w.appointmentDate);
      setSkNumber(w.skNumber || '');
    } else {
      setEditingWorker(undefined);
      setMemberId('');
      setDepartmentId(workerDepartments[0]?.id || '');
      setPositionTitle('Anggota Pelayanan');
      setAppointmentDate(new Date().toISOString().split('T')[0]);
      setSkNumber(`SK-GBI/${new Date().getFullYear()}/${(workers.length + 1).toString().padStart(3, '0')}`);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === memberId);
    const dept = workerDepartments.find(d => d.id === departmentId);

    if (!mem || !dept || !positionTitle.trim()) {
      showToast('error', 'Validasi', 'Lengkapi seluruh data pengerja.');
      return;
    }

    const payload = {
      memberId: mem.id,
      memberName: mem.fullName,
      departmentId: dept.id,
      departmentName: dept.departmentName,
      positionTitle,
      appointmentDate,
      skNumber,
      isActive: true
    };

    if (editingWorker) {
      updateWorker(editingWorker.id, payload);
    } else {
      addWorker(payload);
    }

    setIsModalOpen(false);
  };

  const filteredWorkers = workers.filter(w => {
    const matchSearch =
      w.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.positionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.skNumber && w.skNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchDept = selectedDept === 'ALL' || w.departmentId === selectedDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Operasional</span>
            <span>•</span>
            <span className="text-blue-600">Data Pengerja & Pelayan</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Data Pengerja & Departemen Pelayanan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelayan Ibadah (Praise & Worship, Usher, Multimedia, Sekolah Minggu, Diakonia, Doa).
          </p>
        </div>

        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Penugasan Pengerja</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pengerja, posisi, no SK..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Departemen:</span>
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">Semua Departemen</option>
            {workerDepartments.map(d => (
              <option key={d.id} value={d.id}>{d.departmentName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Nama Pengerja</th>
              <th className="px-4 py-3.5">Departemen</th>
              <th className="px-4 py-3.5">Posisi / Jabatan</th>
              <th className="px-4 py-3.5">Tgl Penugasan</th>
              <th className="px-4 py-3.5">No. SK Tugas</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredWorkers.map(w => (
              <tr key={w.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-3.5 font-bold text-slate-900">{w.memberName}</td>
                <td className="px-4 py-3.5 font-semibold text-blue-700">{w.departmentName}</td>
                <td className="px-4 py-3.5 font-medium">{w.positionTitle}</td>
                <td className="px-4 py-3.5">{new Date(w.appointmentDate).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-3.5 font-mono text-slate-500">{w.skNumber || '-'}</td>
                <td className="px-4 py-3.5">
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold border ${w.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600'}`}>
                    {w.isActive ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-1.5">
                  <button
                    onClick={() => openForm(w)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setWorkerToDelete(w)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingWorker ? 'Edit Penugasan Pengerja' : 'Pendaftaran Pengerja Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Jemaat *</label>
                <select
                  required
                  value={memberId}
                  onChange={e => setMemberId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="">-- Pilih dari Master Data Jemaat --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.memberNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Departemen Pelayanan *</label>
                <select
                  required
                  value={departmentId}
                  onChange={e => setDepartmentId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                >
                  {workerDepartments.map(d => (
                    <option key={d.id} value={d.id}>{d.departmentName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Posisi / Jabatan Pelayanan *</label>
                <input
                  type="text"
                  required
                  value={positionTitle}
                  onChange={e => setPositionTitle(e.target.value)}
                  placeholder="Contoh: Worship Leader, Sound Engineer, Guru SM"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai Penugasan *</label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor SK / Surat Tugas</label>
                <input
                  type="text"
                  value={skNumber}
                  onChange={e => setSkNumber(e.target.value)}
                  placeholder="SK-GBI/2026/001"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold">Simpan Pengerja</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!workerToDelete}
        title="Hapus / Nonaktifkan Pengerja"
        message={`Hapus penugasan pelayanan untuk ${workerToDelete?.memberName} (${workerToDelete?.positionTitle})?`}
        confirmLabel="Hapus Pengerja"
        isDanger={true}
        onConfirm={() => {
          if (workerToDelete) {
            deleteWorker(workerToDelete.id);
            setWorkerToDelete(null);
          }
        }}
        onCancel={() => setWorkerToDelete(null)}
      />
    </div>
  );
};
