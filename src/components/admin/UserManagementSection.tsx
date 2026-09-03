import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { User, UserRole, ROLE_DEFINITIONS } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import {
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
  Search,
  Edit2,
  Trash2,
  KeyRound,
  CheckCircle2,
  XCircle,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const UserManagementSection: React.FC = () => {
  const {
    users,
    currentUser,
    addUser,
    updateUser,
    deleteUser,
    switchRole,
    showToast
  } = useChurch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  // Modal states for Create / Edit
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Form states for Add/Edit
  const [formFullName, setFormFullName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('ADMINISTRATOR');
  const [formIsActive, setFormIsActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'ALL' || user.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAddModal = () => {
    setFormFullName('');
    setFormUsername('');
    setFormEmail('');
    setFormPassword('admin123');
    setFormRole('ADMINISTRATOR');
    setFormIsActive(true);
    setShowPassword(false);
    setFormError(null);
    setIsAddUserModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormFullName(user.fullName);
    setFormUsername(user.username);
    setFormEmail(user.email);
    setFormPassword(user.password || '');
    setFormRole(user.role);
    setFormIsActive(user.isActive);
    setShowPassword(false);
    setFormError(null);
  };

  const handleSaveAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formFullName.trim()) {
      setFormError('Nama lengkap harus diisi.');
      return;
    }
    if (!formUsername.trim()) {
      setFormError('Username harus diisi.');
      return;
    }
    const cleanUsername = formUsername.trim().toLowerCase();
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      setFormError(`Username "${cleanUsername}" sudah digunakan oleh akun lain.`);
      return;
    }

    addUser({
      fullName: formFullName.trim(),
      username: cleanUsername,
      email: formEmail.trim().toLowerCase() || `${cleanUsername}@gbiloveinhil.org`,
      password: formPassword || 'admin123',
      role: formRole,
      isActive: formIsActive
    });

    setIsAddUserModalOpen(false);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError(null);

    if (!formFullName.trim()) {
      setFormError('Nama lengkap harus diisi.');
      return;
    }
    if (!formUsername.trim()) {
      setFormError('Username harus diisi.');
      return;
    }

    const cleanUsername = formUsername.trim().toLowerCase();
    const isDuplicate = users.some(
      u => u.id !== editingUser.id && u.username.toLowerCase() === cleanUsername
    );
    if (isDuplicate) {
      setFormError(`Username "${cleanUsername}" sudah digunakan akun lain.`);
      return;
    }

    updateUser(editingUser.id, {
      fullName: formFullName.trim(),
      username: cleanUsername,
      email: formEmail.trim().toLowerCase(),
      role: formRole,
      isActive: formIsActive,
      ...(formPassword ? { password: formPassword } : {})
    });

    setEditingUser(null);
  };

  const handleRoleQuickChange = (userId: string, newRole: UserRole) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.id === currentUser.id && newRole !== 'SUPER_ADMIN') {
      if (!confirm('Anda sedang mengubah role akun Anda sendiri. Lanjutkan?')) {
        return;
      }
    }
    updateUser(userId, { role: newRole });
    showToast('info', 'Role Diperbarui', `Role ${target.fullName} diubah menjadi ${newRole}.`);
  };

  const handleToggleStatus = (user: User) => {
    if (user.id === currentUser.id) {
      showToast('error', 'Tindakan Dilarang', 'Tidak dapat menonaktifkan akun yang sedang aktif digunakan.');
      return;
    }
    updateUser(user.id, { isActive: !user.isActive });
    showToast(
      'info',
      'Status Akun',
      `Akun ${user.fullName} sekarang ${!user.isActive ? 'AKTIF' : 'NONAKTIF'}.`
    );
  };

  const handleDeleteUser = () => {
    if (!deletingUserId) return;
    deleteUser(deletingUserId);
    setDeletingUserId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Super Admin Badge */}
      <div className="p-5 rounded-2xl bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md border border-purple-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 backdrop-blur-md flex items-center justify-center text-purple-200 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/30">
                Otoritas Super Admin
              </span>
              <span className="text-xs text-purple-200">•</span>
              <span className="text-xs text-purple-200">Hak Akses Penuh (RBAC)</span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              Manajemen Role & Akun Pengguna Gereja
            </h3>
            <p className="text-xs text-purple-200/80 mt-0.5 max-w-2xl">
              Sebagai Super Admin, Anda memiliki wewenang untuk menetapkan role, membuat akun staf, mengubah nama pengguna, mereset password, serta mengatur izin akses operasional.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-900/50 flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Role Cards / Overview Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Struktur 4 Tingkatan Role (Hak Akses)
          </h4>
          <span className="text-xs text-slate-500 font-medium">
            Total {users.length} Akun Terdaftar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map(roleKey => {
            const roleData = ROLE_DEFINITIONS[roleKey];
            const userCount = users.filter(u => u.role === roleKey).length;
            const isCurrentActiveRole = currentUser.role === roleKey;

            return (
              <div
                key={roleKey}
                className={`p-4 rounded-2xl border transition-all bg-white shadow-xs ${
                  isCurrentActiveRole
                    ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border uppercase ${roleData.badge}`}>
                    {roleKey.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {userCount} User
                  </span>
                </div>

                <h5 className="font-bold text-slate-900 text-xs truncate" title={roleData.title}>
                  {roleData.title}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {roleData.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {roleData.allowedTabs.length} Modul Diizinkan
                  </span>
                  {roleKey !== currentUser.role && (
                    <button
                      onClick={() => switchRole(roleKey)}
                      className="text-[10px] font-bold text-purple-600 hover:text-purple-800 flex items-center space-x-1 cursor-pointer"
                      title={`Simulasi tampilan role ${roleKey}`}
                    >
                      <span>Uji Role</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Daftar Akun & Penugasan Role</h4>
              <p className="text-[11px] text-slate-500">Kelola kredensial dan hak akses setiap pengerja/staf.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama/username..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-purple-500 w-44 sm:w-56"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRoleFilter}
              onChange={e => setSelectedRoleFilter(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">Semua Role</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMINISTRATOR">Administrator</option>
              <option value="OPERATOR">Operator</option>
              <option value="PEMIMPIN_COOL">Pemimpin COOL</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="px-4 py-3">Pengguna / Akun</th>
                <th className="px-4 py-3">Username & Email</th>
                <th className="px-4 py-3">Role Ditugaskan</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs">
                    Tidak ditemukan data pengguna yang cocok.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const roleMeta = ROLE_DEFINITIONS[user.role];
                  const isCurrent = user.id === currentUser.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-3">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.fullName}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {user.fullName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-bold text-slate-900 text-xs">{user.fullName}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[9px] font-black rounded-sm">
                                  Akun Anda
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {user.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Username & Email */}
                      <td className="px-4 py-3.5">
                        <p className="font-mono font-bold text-slate-800 text-xs">@{user.username}</p>
                        <p className="text-slate-400 text-[11px] truncate max-w-[160px]">{user.email}</p>
                      </td>

                      {/* Role Dropdown / Badge */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center space-x-2">
                          <select
                            value={user.role}
                            onChange={e => handleRoleQuickChange(user.id, e.target.value as UserRole)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:outline-hidden ${roleMeta?.badge || 'bg-slate-100 text-slate-800'}`}
                            title="Ubah Role Langsung"
                          >
                            <option value="SUPER_ADMIN">SUPER ADMIN</option>
                            <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                            <option value="OPERATOR">OPERATOR</option>
                            <option value="PEMIMPIN_COOL">PEMIMPIN COOL</option>
                          </select>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={isCurrent}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center space-x-1 transition-all ${
                            user.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          } ${isCurrent ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                          title={isCurrent ? 'Akun aktif Anda' : 'Klik untuk mengubah status aktif/nonaktif'}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>Nonaktif</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Data & Role Akun"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingUserId(user.id)}
                            disabled={isCurrent || user.username === 'superadmin'}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                            title={isCurrent ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Akun'}
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

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-linear-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Tambah Pengguna Baru</h3>
                  <p className="text-xs text-purple-100">Buat akun staf/pengerja dan tentukan rolenya.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddUser} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Akun *</label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={e => setFormFullName(e.target.value)}
                  placeholder="Contoh: Sdri. Rachel Novita"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={e => setFormUsername(e.target.value)}
                    placeholder="Contoh: rachel_operator"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Hak Akses *</label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                    <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                    <option value="OPERATOR">OPERATOR</option>
                    <option value="PEMIMPIN_COOL">PEMIMPIN COOL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="nama@gbiloveinhil.org"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi Default *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveNew"
                  checked={formIsActive}
                  onChange={e => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label htmlFor="isActiveNew" className="font-semibold text-slate-700 cursor-pointer">
                  Aktifkan akun ini sekarang
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Akun Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-linear-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Edit Akun & Role Pengguna</h3>
                  <p className="text-xs text-blue-100">Sesuaikan nama, role, dan kata sandi {editingUser.fullName}.</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Akun *</label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={e => setFormFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={e => setFormUsername(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Hak Akses *</label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as UserRole)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="SUPER_ADMIN">SUPER ADMIN</option>
                    <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                    <option value="OPERATOR">OPERATOR</option>
                    <option value="PEMIMPIN_COOL">PEMIMPIN COOL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ubah Kata Sandi (Kosongkan jika tidak diubah)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder="Masukkan sandi baru..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={formIsActive}
                  disabled={editingUser.id === currentUser.id}
                  onChange={e => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="isActiveEdit" className="font-semibold text-slate-700 cursor-pointer">
                  Status Akun Aktif
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingUserId}
        title="Hapus Akun Pengguna"
        message="Apakah Anda yakin ingin menghapus akun pengguna ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus Akun"
        isDanger={true}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeletingUserId(null)}
      />
    </div>
  );
};
