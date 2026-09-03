import React, { useState, useEffect } from 'react';
import { useChurch } from '../../context/ChurchContext';
import {
  HardDrive,
  FolderSync,
  Server,
  FileJson,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Link2,
  Unlink,
  Radio,
  FileCode,
  Copy,
  Check,
  ShieldCheck,
  Save,
  Play,
  HelpCircle,
  X,
  Smartphone,
  Laptop,
  ArrowRight,
  Database,
  Cloud
} from 'lucide-react';
import { RailwayDeployTab } from './RailwayDeployTab';
import {
  checkAndRequestPersistentStorage,
  generateLocalNodeServerScript,
  generateLaravelControllerScript,
  generateLaravelRoutesScript,
  generateLaravelCorsConfigScript,
  generateLaravelMigrationScript
} from '../../utils/pcSyncService';

interface PCSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PCSyncModal: React.FC<PCSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    isFileSystemSupported,
    isPCFileLinked,
    pcFileName,
    pcFileLastSaved,
    isAutoSaveToPC,
    setIsAutoSaveToPC,
    localApiUrl,
    setLocalApiUrl,
    isLocalApiConnected,
    localApiLastSync,
    isAutoSyncLocalApi,
    setIsAutoSyncLocalApi,
    linkPCFile,
    createAndLinkNewPCFile,
    unlinkPCFile,
    saveToLinkedPCFile,
    loadFromLinkedPCFile,
    testLocalApiConnection,
    pushToLocalApi,
    pullFromLocalApi,
    downloadDatabaseJSON,
    importFullDatabase,
    members,
    families,
    attendanceRecords,
    users,
    showToast
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'railway' | 'laravel' | 'file' | 'backup' | 'storage'>('railway');
  const [testingApi, setTestingApi] = useState(false);
  const [syncingApi, setSyncingApi] = useState(false);
  const [customApiUrl, setCustomApiUrl] = useState(localApiUrl);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [persistedInfo, setPersistedInfo] = useState<{ isPersisted: boolean; usage?: number; quota?: number }>({
    isPersisted: true
  });

  useEffect(() => {
    if (isOpen) {
      checkAndRequestPersistentStorage().then(info => setPersistedInfo(info));
      setCustomApiUrl(localApiUrl);
    }
  }, [isOpen, localApiUrl]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestingApi(true);
    setLocalApiUrl(customApiUrl);
    await testLocalApiConnection(customApiUrl);
    setTestingApi(false);
  };

  const handlePush = async () => {
    setSyncingApi(true);
    await pushToLocalApi();
    setSyncingApi(false);
  };

  const handlePull = async () => {
    setSyncingApi(true);
    await pullFromLocalApi();
    setSyncingApi(false);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importFullDatabase(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadLaravelFile = (type: 'controller' | 'routes' | 'cors' | 'migration') => {
    let script = '';
    let filename = '';

    if (type === 'controller') {
      script = generateLaravelControllerScript();
      filename = 'ChurchSyncController.php';
    } else if (type === 'routes') {
      script = generateLaravelRoutesScript();
      filename = 'api.php';
    } else if (type === 'cors') {
      script = generateLaravelCorsConfigScript();
      filename = 'cors.php';
    } else if (type === 'migration') {
      script = generateLaravelMigrationScript();
      filename = `${new Date().toISOString().slice(0, 10).replace(/-/g, '_')}_create_church_tables.php`;
    }

    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('success', 'File Laravel Terunduh', `File ${filename} siap dipasang di folder Laravel Anda.`);
  };

  const copyLaravelCode = (type: 'controller' | 'routes' | 'cors' | 'migration') => {
    let script = '';
    if (type === 'controller') script = generateLaravelControllerScript();
    else if (type === 'routes') script = generateLaravelRoutesScript();
    else if (type === 'cors') script = generateLaravelCorsConfigScript();
    else if (type === 'migration') script = generateLaravelMigrationScript();

    navigator.clipboard.writeText(script);
    setCopiedScript(type);
    showToast('success', 'Disalin', `Kode Laravel (${type}) berhasil disalin ke clipboard.`);
    setTimeout(() => setCopiedScript(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/30 border border-red-400/40 flex items-center justify-center text-red-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Sinkronisasi Server Laravel & Database PC
                </h2>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-400/30 text-[10px] font-bold rounded-full">
                  Laravel REST API
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Hubungkan web di PC dan HP ke backend Laravel terpusat agar seluruh data dan user selalu sinkron.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Status Koneksi:</span>
            {isLocalApiConnected ? (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Terhubung ke Laravel: {localApiUrl}</span>
              </span>
            ) : isPCFileLinked ? (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-full font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>File PC: {pcFileName}</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full font-bold">
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                <span>Storage Lokal Browser</span>
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center space-x-3 font-medium">
            <span>{users.length} Akun User</span>
            <span>•</span>
            <span>{members.length} Jemaat</span>
            <span>•</span>
            <span>{families.length} KKJ</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center space-x-2 pt-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('railway')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'railway'
                ? 'border-purple-600 text-purple-600 bg-purple-50/40 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <Cloud className="w-4 h-4 text-purple-600" />
            <span>Deploy Railway Cloud</span>
            <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 text-[9px] font-black rounded-full uppercase">
              Online PC & HP
            </span>
          </button>

          <button
            onClick={() => setActiveTab('laravel')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'laravel'
                ? 'border-red-600 text-red-600 bg-red-50/40 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <Server className="w-4 h-4 text-red-500" />
            <span>Backend Laravel (Lokal PC)</span>
            {isLocalApiConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'file'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <FolderSync className="w-4 h-4" />
            <span>Tautan File PC</span>
            {isPCFileLinked && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>Ekspor / Impor JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'storage'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40 rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Storage Browser</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* TAB 0: Railway Cloud Deployment */}
          {activeTab === 'railway' && <RailwayDeployTab />}

          {/* TAB 1: Laravel Integration */}
          {activeTab === 'laravel' && (
            <div className="space-y-6">
              {/* How it works Banner */}
              <div className="p-4.5 bg-red-50/70 border border-red-200 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-xs mt-0.5 shrink-0">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-950">
                      Integrasi Backend Laravel Terpusat (Multi-Device PC & HP)
                    </h3>
                    <p className="text-xs text-red-800 mt-1 leading-relaxed">
                      Dengan menjalankan backend Laravel di PC, Anda dapat menghubungkan web di PC dan browser di HP (ponsel) ke satu database terpusat yang sama. Data yang dimasukkan dari PC (seperti user baru, KKJ, jemaat) akan langsung tersedia dan bisa diakses saat login dari HP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Endpoint Input & Connection Box */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    URL Endpoint API Laravel PC
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Jika dibuka dari PC gunakan <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">http://localhost:8000/api</code>. Jika dibuka dari HP pada Wi-Fi yang sama, gunakan IP PC Anda misalnya <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">http://192.168.1.50:8000/api</code>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customApiUrl}
                    onChange={e => setCustomApiUrl(e.target.value)}
                    placeholder="http://localhost:8000/api"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-red-500"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={testingApi}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingApi ? 'animate-spin' : ''}`} />
                    <span>{testingApi ? 'Menguji...' : 'Uji Koneksi Laravel'}</span>
                  </button>
                </div>

                {isLocalApiConnected && (
                  <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <div className="flex items-center space-x-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Terhubung ke Server Laravel PC. Data siap disinkronkan!</span>
                    </div>
                    {localApiLastSync && (
                      <span className="text-[11px] text-emerald-700">Terakhir Sync: {localApiLastSync}</span>
                    )}
                  </div>
                )}

                {/* Push / Pull Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handlePush}
                    disabled={syncingApi}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center space-x-2 font-bold text-xs text-slate-900">
                      <Upload className="w-4 h-4 text-red-600" />
                      <span>Kirim Data ke Laravel (Push Data PC)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Kirim seluruh akun user, master jemaat & KKJ saat ini ke server Laravel.
                    </p>
                  </button>

                  <button
                    onClick={handlePull}
                    disabled={syncingApi}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center space-x-2 font-bold text-xs text-slate-900">
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span>Tarik Data dari Laravel (Pull ke HP/Web)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Ambil update data terbaru dari Laravel ke perangkat ini.
                    </p>
                  </button>
                </div>

                {/* Auto Sync Switch */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Auto-Sync Berkala ke Laravel (Setiap 30 Detik)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Menjaga data di HP dan PC selalu up-to-date secara otomatis.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAutoSyncLocalApi}
                      onChange={e => setIsAutoSyncLocalApi(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>

              {/* Laravel Source Code & Setup Guide */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-red-600" />
                    <span>File & Kode Sumber Laravel Siap Pakai (Download / Salin)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pasang 3 file berikut ke project Laravel Anda agar endpoint REST API langsung aktif:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Controller */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-mono">ChurchSyncController.php</span>
                      <button
                        onClick={() => copyLaravelCode('controller')}
                        className="text-[10px] text-slate-500 hover:text-red-600 flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedScript === 'controller' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'controller' ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Lokasi: app/Http/Controllers/Api/
                    </p>
                    <button
                      onClick={() => downloadLaravelFile('controller')}
                      className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh Controller (.php)</span>
                    </button>
                  </div>

                  {/* Routes */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-mono">routes/api.php</span>
                      <button
                        onClick={() => copyLaravelCode('routes')}
                        className="text-[10px] text-slate-500 hover:text-red-600 flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedScript === 'routes' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'routes' ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Lokasi: routes/api.php
                    </p>
                    <button
                      onClick={() => downloadLaravelFile('routes')}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh Routes (.php)</span>
                    </button>
                  </div>

                  {/* CORS Config */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-mono">config/cors.php</span>
                      <button
                        onClick={() => copyLaravelCode('cors')}
                        className="text-[10px] text-slate-500 hover:text-red-600 flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedScript === 'cors' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'cors' ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Lokasi: config/cors.php (Izin HP & Web)
                    </p>
                    <button
                      onClick={() => downloadLaravelFile('cors')}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh CORS Config (.php)</span>
                    </button>
                  </div>

                  {/* Migration MySQL */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-mono">Migration MySQL</span>
                      <button
                        onClick={() => copyLaravelCode('migration')}
                        className="text-[10px] text-slate-500 hover:text-red-600 flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedScript === 'migration' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript === 'migration' ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Lokasi: database/migrations/
                    </p>
                    <button
                      onClick={() => downloadLaravelFile('migration')}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Unduh Migration (.php)</span>
                    </button>
                  </div>
                </div>

                {/* 3 Steps Multi-device Guide */}
                <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-2 text-xs">
                  <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px]">
                    Panduan Menjalankan Laravel untuk PC & HP (Satu Jaringan Wi-Fi):
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                    <li>
                      Jalankan Laravel dengan perintah: <code className="text-amber-300 font-mono bg-slate-800 px-1 py-0.5 rounded">php artisan serve --host=0.0.0.0 --port=8000</code>
                    </li>
                    <li>
                      Cek IP lokal PC Anda di CMD/Terminal (<code className="text-amber-300 font-mono">ipconfig</code> di Windows, contoh IP: <code className="text-emerald-400 font-mono font-bold">192.168.1.50</code>).
                    </li>
                    <li>
                      Buka web di HP, klik <strong>Link Data PC $\rightarrow$ Konektor Laravel</strong>, masukkan <code className="text-emerald-400 font-mono font-bold">http://192.168.1.50:8000/api</code> lalu klik <strong>Tarik Data (Pull)</strong>.
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: File System Access API */}
          {activeTab === 'file' && (
            <div className="space-y-5">
              <div className="p-4.5 bg-blue-50/70 border border-blue-200 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs mt-0.5">
                    <FolderSync className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-950">
                      Sinkronisasi File Komputer Langsung (Native Live Link)
                    </h3>
                    <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                      Dengan menghubungkan file database di PC Anda, seluruh perubahan data jemaat, KKJ, absensi, sakramen, dan pengerja akan <strong>otomatis ditulis langsung ke file di hard drive komputer Anda</strong> tanpa perlu download ulang berulang kali.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              {isPCFileLinked ? (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-950">Status: File PC Terhubung Aktif</p>
                        <p className="text-sm font-black text-emerald-900 font-mono mt-0.5">
                          {pcFileName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={unlinkPCFile}
                      className="px-3 py-1.5 bg-white border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                      <span>Lepas Tautan</span>
                    </button>
                  </div>

                  {pcFileLastSaved && (
                    <p className="text-xs text-emerald-700 font-medium">
                      ✓ Terakhir tersimpan ke file PC: <strong>{pcFileLastSaved}</strong>
                    </p>
                  )}

                  {/* Auto-save Toggle */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Simpan Otomatis Realtime ke File PC (Auto-Save)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Setiap Anda menambah/mengubah data, file di PC langsung diperbarui.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAutoSaveToPC}
                        onChange={e => setIsAutoSaveToPC(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => saveToLinkedPCFile()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan ke File PC Sekarang</span>
                    </button>

                    <button
                      onClick={() => loadFromLinkedPCFile()}
                      className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Baca Ulang dari File PC</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <Link2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Belum Ada File PC yang Ditautkan</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Pilih file database JSON yang sudah ada di komputer Anda, atau buat file database baru untuk menghubungkan data secara langsung.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={() => linkPCFile()}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <HardDrive className="w-4 h-4" />
                      <span>Pilih & Tautkan File Database di PC (.json)</span>
                    </button>

                    <button
                      onClick={() => createAndLinkNewPCFile()}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Buat File Database Baru di PC</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Manual Export / Import Backup */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Ekspor File Cadangan Database JSON</h4>
                    <p className="text-[11px] text-slate-500">
                      Unduh arsip lengkap seluruh jemaat, KKJ, sakramen, COOL, presensi & pengaturan.
                    </p>
                  </div>
                  <button
                    onClick={downloadDatabaseJSON}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh File JSON</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Pulihkan Data dari File JSON di PC</h4>
                    <p className="text-[11px] text-slate-500">
                      Unggah file cadangan JSON dari hard disk PC Anda untuk mengganti atau memulihkan data.
                    </p>
                  </div>
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih File dari PC</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Browser Storage Protection */}
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="p-4.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-emerald-950">
                    Status Perlindungan Penyimpanan di Komputer Anda
                  </h4>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Data aplikasi ini disimpan secara permanen di storage browser komputer Anda (IndexedDB & LocalStorage) dengan proteksi anti-hapus otomatis.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-500 font-medium">Status Persistensi Browser:</span>
                  <p className="text-sm font-bold text-emerald-700 mt-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aktif & Terproteksi</span>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-500 font-medium">Kapasitas Tersedia:</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {persistedInfo.quota ? `${Math.round(persistedInfo.quota / (1024 * 1024))} MB` : 'Tidak Terbatas'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500">
            GBI LOVE INHIL • Backend Laravel & Multi-Device Sync
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
