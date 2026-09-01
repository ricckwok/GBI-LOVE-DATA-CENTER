import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { UserRole, ROLE_DEFINITIONS } from '../../types';
import { GBILogo } from '../common/GBILogo';
import {
  Shield,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  Users,
  CalendarCheck,
  Building2,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLoginAsRole, users, churchSettings } = useChurch();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim()) {
      setErrorMessage('Silakan masukkan username atau email Anda.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await login(usernameOrEmail, password);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage('Terjadi kesalahan saat masuk. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    const roleDef = ROLE_DEFINITIONS[role];
    setUsernameOrEmail(roleDef.defaultUsername);
    setPassword(roleDef.defaultPass);
    setErrorMessage(null);
    quickLoginAsRole(role);
  };

  const roleList: UserRole[] = ['SUPER_ADMIN', 'ADMINISTRATOR', 'OPERATOR', 'PEMIMPIN_COOL'];

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col justify-between text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Banner Bar */}
      <header className="px-6 py-4 border-b border-slate-700/60 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <GBILogo className="w-10 h-10 drop-shadow-md" />
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block">
              {churchSettings.churchName || 'GBI LOVE INHIL'}
            </span>
            <span className="text-[11px] text-blue-300/80 font-medium tracking-wide">
              {churchSettings.synod || 'Gereja Bethel Indonesia'} • {churchSettings.city || 'Indragiri Hilir'}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistem Terhubung</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs font-semibold">
            v2.0.4-PROD
          </span>
        </div>
      </header>

      {/* Main Form Center Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Brand Story & Quick Role Switcher */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Integrated Church Management System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Sistem Administrasi & Informasi Jemaat
              </h1>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Platform terpadu GBI Love Inhil untuk pengelolaan Kartu Keluarga Jemaat (KKJ), Master Data Jemaat, Komunitas Kasih (COOL), Sakramen Gerejawi, Presensi Ibadah QR, dan Otomasi Ucapan Ulang Tahun.
              </p>
            </div>

            {/* Quick Role Selection Cards */}
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pilih Role untuk Masuk Instan (RBAC):</span>
                </p>
                <span className="text-[10px] text-blue-300/80 bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-700/40">
                  1-Click Login
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {roleList.map(role => {
                  const roleDef = ROLE_DEFINITIONS[role];
                  const userObj = users.find(u => u.role === role);

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleQuickRoleSelect(role)}
                      className="text-left p-3.5 rounded-2xl bg-slate-900/60 hover:bg-blue-900/30 border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-2.5">
                        {userObj?.avatarUrl ? (
                          <img
                            src={userObj.avatarUrl}
                            alt={userObj.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-600 group-hover:border-blue-400 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-950 border border-blue-700 flex items-center justify-center text-blue-300 font-bold text-xs shrink-0">
                            {role.slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                            {roleDef.title.split('/')[0].trim()}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {userObj?.fullName.split('(')[0].trim() || roleDef.defaultUsername}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded">
                          {roleDef.defaultUsername}
                        </span>
                        <span className="text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
                          Masuk →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feature Badges */}
            <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Basis Data Tersimpan Otomatis</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Multi-Role RBAC</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Arsitektur Laravel / SQL Ready</span>
              </span>
            </div>
          </div>

          {/* Right Column: Credential Form */}
          <div className="lg:col-span-6 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Masuk Akun</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gunakan kredensial resmi pengurus atau pengerja gereja.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
              </div>

              {/* Error Box */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-start space-x-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username or Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Username atau Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={usernameOrEmail}
                      onChange={e => setUsernameOrEmail(e.target.value)}
                      placeholder="Contoh: superadmin, admin, operator"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    *Password default untuk semua akun: <code className="text-blue-300 font-mono">admin123</code> / <code className="text-blue-300 font-mono">operator123</code> / <code className="text-blue-300 font-mono">cool123</code>
                  </p>
                </div>

                {/* Remember & Help */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded-md border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/30"
                    />
                    <span>Ingat sesi masuk</span>
                  </label>
                  <span className="text-blue-400 text-xs">
                    Single Sign-On Aktif
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk ke Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Security Notice Footer */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-500">
                Sistem Informasi Resmi Gereja Bethel Indonesia Love Inhil
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                © {new Date().getFullYear()} GBI Love Inhil. Hak Cipta Dilindungi Undang-Undang.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="px-6 py-3 border-t border-slate-800/60 bg-slate-950/40 text-center text-xs text-slate-500">
        Sekretariat: {churchSettings.address || 'Jl. M. Boya No. 45'}, {churchSettings.city || 'Tembilahan'}, Riau • Telp: {churchSettings.phone || '+62 768 21455'}
      </footer>
    </div>
  );
};
