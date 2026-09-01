import React, { useState, useEffect } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { User, ROLE_DEFINITIONS } from '../../types';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  Camera,
  Save,
  KeyRound,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  { id: '1', label: 'Pdt. Andreas', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: '2', label: 'Ibu Maria', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { id: '3', label: 'Bpk. Daniel', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: '4', label: 'Sdri. Jessica', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: '5', label: 'Bpk. Markus', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: '6', label: 'Sdri. Debora', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80' }
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUser, showToast } = useChurch();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [password, setPassword] = useState(currentUser.password || '');
  const [confirmPassword, setConfirmPassword] = useState(currentUser.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName(currentUser.fullName);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setAvatarUrl(currentUser.avatarUrl || '');
      setPassword(currentUser.password || '');
      setConfirmPassword(currentUser.password || '');
      setErrorMessage(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const roleInfo = ROLE_DEFINITIONS[currentUser.role];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Nama Lengkap / Nama Akun tidak boleh kosong.');
      return;
    }

    if (!username.trim()) {
      setErrorMessage('Username tidak boleh kosong.');
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.');
      return;
    }

    setIsSaving(true);

    try {
      updateUser(currentUser.id, {
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        avatarUrl: avatarUrl.trim() || undefined,
        ...(password ? { password } : {})
      });

      showToast('success', 'Profil Diperbarui', `Nama akun berhasil diubah menjadi "${fullName}".`);
      onClose();
    } catch (err: any) {
      setErrorMessage('Terjadi kesalahan saat menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-linear-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-200">
                <span>Pengaturan Akun Pribadi</span>
                <span>•</span>
                <span>GBI Love Inhil</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Edit Nama & Profil Akun
              </h2>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                Sesuaikan nama tampilan, username, foto profil, dan kata sandi akun Anda.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current Role Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Peran Akun (Role)</p>
                <p className="text-[11px] text-slate-500">{roleInfo?.title || currentUser.role}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${roleInfo?.badge || 'bg-blue-100 text-blue-800 border-blue-200'}`}>
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          {/* Avatar Section & Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Foto Profil / Avatar
            </label>
            <div className="flex items-center space-x-4 mb-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
                  {fullName.slice(0, 2).toUpperCase() || 'US'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700">Pilih Preset Avatar:</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {AVATAR_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`p-0.5 rounded-xl border-2 transition-all cursor-pointer ${
                        avatarUrl === preset.url ? 'border-blue-600 scale-105 shadow-xs' : 'border-transparent hover:border-slate-300'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-7 h-7 rounded-lg object-cover"
                      />
                    </button>
                  ))}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <input
                type="url"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                placeholder="Atau tempelkan tautan URL gambar foto profil kustom..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap / Nama Akun *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Contoh: Pdt. Andreas Jonathan, M.Th"
                  className="w-full px-3.5 py-2.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Nama ini akan ditampilkan pada header, sidebar, dan log aktivitas.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username Akun *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Contoh: superadmin"
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Digunakan untuk login ke dalam sistem.</p>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@gbiloveinhil.org"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">Ubah Kata Sandi (Opsional)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Akun'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
