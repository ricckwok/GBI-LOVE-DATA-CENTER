import React, { useState, useEffect } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { UserRole, ROLE_DEFINITIONS } from '../../types';
import { UserManagementSection } from '../admin/UserManagementSection';
import { LaravelDatabaseHub } from '../database/LaravelDatabaseHub';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { GBILogo, GBI_LOGO_SVG_DATA_URL } from '../common/GBILogo';
import {
  Settings,
  Building,
  Shield,
  ShieldCheck,
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Lock,
  UserCheck,
  User as UserIcon,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Users,
  Camera,
  Layers
} from 'lucide-react';

const AVATAR_PRESETS = [
  { id: '1', label: 'Pdt. Andreas', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: '2', label: 'Ibu Maria', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { id: '3', label: 'Bpk. Daniel', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: '4', label: 'Sdri. Jessica', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: '5', label: 'Bpk. Markus', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: '6', label: 'Sdri. Debora', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' }
];

export const SettingsView: React.FC = () => {
  const {
    churchSettings,
    updateChurchSettings,
    currentUser,
    updateUser,
    resetToDemoData,
    exportDatabaseJSON,
    importDatabaseJSON,
    showToast
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'account' | 'users_rbac' | 'laravel' | 'profile' | 'database'>('account');

  // Account Profile fields
  const [accountFullName, setAccountFullName] = useState(currentUser.fullName);
  const [accountUsername, setAccountUsername] = useState(currentUser.username);
  const [accountEmail, setAccountEmail] = useState(currentUser.email);
  const [accountAvatarUrl, setAccountAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [accountPassword, setAccountPassword] = useState(currentUser.password || '');
  const [accountConfirmPassword, setAccountConfirmPassword] = useState(currentUser.password || '');
  const [showAccountPassword, setShowAccountPassword] = useState(false);

  // Sync state when currentUser changes
  useEffect(() => {
    setAccountFullName(currentUser.fullName);
    setAccountUsername(currentUser.username);
    setAccountEmail(currentUser.email);
    setAccountAvatarUrl(currentUser.avatarUrl || '');
    setAccountPassword(currentUser.password || '');
    setAccountConfirmPassword(currentUser.password || '');
  }, [currentUser]);

  // Church Profile fields
  const [churchName, setChurchName] = useState(churchSettings.churchName);
  const [synod, setSynod] = useState(churchSettings.synod);
  const [address, setAddress] = useState(churchSettings.address);
  const [city, setCity] = useState(churchSettings.city);
  const [phone, setPhone] = useState(churchSettings.phone);
  const [email, setEmail] = useState(churchSettings.email);
  const [seniorPastor, setSeniorPastor] = useState(churchSettings.seniorPastor);
  const [churchLogoUrl, setChurchLogoUrl] = useState(churchSettings.logoUrl || GBI_LOGO_SVG_DATA_URL);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveAccountProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountFullName.trim()) {
      showToast('error', 'Validasi Gagal', 'Nama Lengkap Akun tidak boleh kosong.');
      return;
    }
    if (!accountUsername.trim()) {
      showToast('error', 'Validasi Gagal', 'Username tidak boleh kosong.');
      return;
    }
    if (accountPassword && accountConfirmPassword && accountPassword !== accountConfirmPassword) {
      showToast('error', 'Validasi Gagal', 'Konfirmasi kata sandi tidak sesuai.');
      return;
    }

    updateUser(currentUser.id, {
      fullName: accountFullName.trim(),
      username: accountUsername.trim().toLowerCase(),
      email: accountEmail.trim().toLowerCase(),
      avatarUrl: accountAvatarUrl.trim() || undefined,
      ...(accountPassword ? { password: accountPassword } : {})
    });

    showToast('success', 'Akun Diperbarui', `Nama akun berhasil diubah menjadi "${accountFullName}".`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateChurchSettings({
      churchName,
      synod,
      address,
      city,
      phone,
      email,
      seniorPastor,
      logoUrl: churchLogoUrl
    });
    showToast('success', 'Profil Tersimpan', 'Profil dan logo resmi gereja berhasil diperbarui.');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Format Tidak Didukung', 'Harap unggah file gambar (PNG, JPG, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const base64 = event.target?.result as string;
      if (base64) {
        setChurchLogoUrl(base64);
        showToast('success', 'Logo Diperbarui', 'Pratinjau logo baru siap disimpan.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Sistem & Administrasi</span>
            <span>•</span>
            <span className="text-blue-600">Pengaturan Aplikasi</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Pengaturan Sistem & Manajemen Akun
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola nama akun Anda, manajemen role & pengguna (khusus Super Admin), profil gereja, dan backup database.
          </p>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'account' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profil & Nama Akun Saya</span>
        </button>

        <button
          onClick={() => setActiveTab('users_rbac')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'users_rbac'
              ? 'bg-purple-700 text-white shadow-xs'
              : isSuperAdmin
              ? 'text-purple-700 hover:bg-purple-50 bg-purple-50/50'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Manajemen Role & User</span>
          {isSuperAdmin && (
            <span className="px-1.5 py-0.2 bg-purple-200 text-purple-900 text-[9px] font-black rounded-sm uppercase">
              Super Admin
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('laravel')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'laravel' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Arsitektur Laravel & Database</span>
          <span className="px-1.5 py-0.2 bg-red-100 text-red-800 text-[9px] font-black rounded-sm uppercase">
            PHP / SQL
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'profile' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Profil & Surat Resmi Gereja</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeTab === 'database' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database JSON Backup & Reset</span>
        </button>
      </div>

      {/* Tab 1: Akun Saya & Edit Profil */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Account Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Ubah Nama Akun & Informasi Profil</h3>
                <p className="text-xs text-slate-500">Perbarui identitas nama tampilan dan kata sandi akun login Anda.</p>
              </div>
            </div>

            <form onSubmit={handleSaveAccountProfile} className="space-y-4 text-xs">
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap / Nama Tampilan Akun *</label>
                  <input
                    type="text"
                    required
                    value={accountFullName}
                    onChange={e => setAccountFullName(e.target.value)}
                    placeholder="Contoh: Pdt. Andreas Jonathan, M.Th"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-blue-500 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Nama ini muncul pada seluruh antarmuka dan laporan.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    value={accountUsername}
                    onChange={e => setAccountUsername(e.target.value)}
                    placeholder="Contoh: superadmin"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-blue-500 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Digunakan saat masuk ke aplikasi.</p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={accountEmail}
                  onChange={e => setAccountEmail(e.target.value)}
                  placeholder="nama@gbiloveinhil.org"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 transition-all"
                />
              </div>

              {/* Avatar Preset & Custom URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Foto Profil / Avatar</label>
                <div className="flex items-center space-x-3 mb-2">
                  {accountAvatarUrl ? (
                    <img
                      src={accountAvatarUrl}
                      alt={accountFullName}
                      className="w-12 h-12 rounded-xl object-cover border border-blue-500 shadow-xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {accountFullName.slice(0, 2).toUpperCase() || 'US'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-600">Pilih Preset Cepat:</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {AVATAR_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setAccountAvatarUrl(preset.url)}
                          className={`p-0.5 rounded-lg border transition-all cursor-pointer ${
                            accountAvatarUrl === preset.url ? 'border-blue-600 scale-105 shadow-xs' : 'border-transparent hover:border-slate-300'
                          }`}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} className="w-6 h-6 rounded-md object-cover" />
                        </button>
                      ))}
                      {accountAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAccountAvatarUrl('')}
                          className="px-2 py-0.5 text-[10px] text-slate-500 hover:text-slate-800 bg-slate-100 rounded-md cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <input
                  type="url"
                  value={accountAvatarUrl}
                  onChange={e => setAccountAvatarUrl(e.target.value)}
                  placeholder="Tautan URL foto profil kustom..."
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Password change */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-800">Ganti Kata Sandi (Opsional)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAccountPassword(p => !p)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                  >
                    {showAccountPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAccountPassword ? 'Sembunyikan' : 'Lihat Sandi'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kata Sandi Baru</label>
                    <input
                      type={showAccountPassword ? 'text' : 'password'}
                      value={accountPassword}
                      onChange={e => setAccountPassword(e.target.value)}
                      placeholder="Masukkan sandi baru"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Konfirmasi Kata Sandi</label>
                    <input
                      type={showAccountPassword ? 'text' : 'password'}
                      value={accountConfirmPassword}
                      onChange={e => setAccountConfirmPassword(e.target.value)}
                      placeholder="Ulangi sandi baru"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Akun</span>
                </button>
              </div>
            </form>
          </div>

          {/* User Account Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Kartu Informasi Akun
            </h3>

            <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md mb-3"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-md mb-3">
                  {currentUser.fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <h4 className="font-bold text-slate-900 text-base">{currentUser.fullName}</h4>
              <p className="text-xs text-slate-500 font-mono">@{currentUser.username}</p>

              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase ${ROLE_DEFINITIONS[currentUser.role]?.badge || 'bg-slate-100 text-slate-800'}`}>
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">ID Pengguna:</span>
                <span className="font-mono font-bold text-slate-900">{currentUser.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-900">{currentUser.email || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status Akun:</span>
                <span className="font-bold text-emerald-600 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aktif (Terotentikasi)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manajemen Role & User (Super Admin) */}
      {activeTab === 'users_rbac' && (
        <UserManagementSection />
      )}

      {/* Tab 3: Arsitektur Basis Data Laravel (SQL, Migration, Model, Seeder, API) */}
      {activeTab === 'laravel' && (
        <LaravelDatabaseHub />
      )}

      {/* Tab 4: Church Profile Form */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Official Church Logo */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <label className="block font-bold text-slate-700 mb-2">Logo Resmi Gereja</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-300 p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                  {churchLogoUrl && churchLogoUrl.startsWith('data:') ? (
                    <img
                      src={churchLogoUrl}
                      alt="Logo Gereja"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <GBILogo className="w-14 h-14" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <p className="text-xs font-bold text-slate-800">Logo GBI (Gereja Bethel Indonesia)</p>
                  <p className="text-[11px] text-slate-500">
                    Digunakan pada Kop Surat KKJ Resmi, Sertifikat Sakramen, Kartu Digital Jemaat, dan Header Aplikasi.
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <label className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] cursor-pointer inline-flex items-center space-x-1.5 transition-colors shadow-xs">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Ganti Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setChurchLogoUrl(GBI_LOGO_SVG_DATA_URL);
                        showToast('info', 'Logo Direset', 'Logo dikembalikan ke Logo Resmi GBI.');
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer inline-flex items-center space-x-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset ke Logo GBI</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Gereja Resmi *</label>
              <input
                type="text"
                required
                value={churchName}
                onChange={e => setChurchName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sinode Gereja</label>
                <input
                  type="text"
                  value={synod}
                  onChange={e => setSynod(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Gembala Sidang / Senior Pastor *</label>
              <input
                type="text"
                required
                value={seniorPastor}
                onChange={e => setSeniorPastor(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat Gedung Gereja</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor Telepon / Hotline</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Sekretariat</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Simpan Profil Gereja
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Database Backup / Restore */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Manajemen Cadangan & Pemulihan Data (Database Storage)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Simpan seluruh database lokal (KKJ, Master Jemaat, COOL, Sakramen, Pengerja, Presensi, WA Logs) dalam format JSON terenkripsi.
            </p>
          </div>

          <div className="space-y-4">
            {/* Export */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Ekspor Backup Database JSON</h4>
                <p className="text-[11px] text-slate-500">Unduh snapshot lengkap sistem saat ini.</p>
              </div>
              <button
                onClick={exportDatabaseJSON}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh JSON</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Pulihkan Database dari File JSON</h4>
                <p className="text-[11px] text-slate-500">Restore snapshot data yang telah dicadangkan sebelumnya.</p>
              </div>
              <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih File Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset to Seed */}
            <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-red-900 text-xs">Muat Ulang Data Sampel Default</h4>
                <p className="text-[11px] text-red-600">Reset database kembali ke contoh data awal GBI Love Inhil.</p>
              </div>
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data Demo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Konfirmasi Reset Data Demo"
        message="Tindakan ini akan mengembalikan seluruh data jemaat, KKJ, COOL, dan presensi ke kondisi awal percontohan GBI Love Inhil. Lanjutkan?"
        confirmLabel="Ya, Reset Sekarang"
        isDanger={true}
        onConfirm={() => {
          resetToDemoData();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
