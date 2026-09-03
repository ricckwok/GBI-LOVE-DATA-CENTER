import React, { useState } from 'react';
import {
  Server,
  Download,
  Copy,
  Check,
  Globe,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Upload,
  Layers,
  FileCode,
  Terminal,
  ShieldCheck,
  Cloud,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useChurch } from '../../context/ChurchContext';
import {
  generateRailwayJson,
  generateNixpacksToml,
  generateProcfile,
  generateDockerfile,
  generateServerJsCode
} from '../../utils/railwayService';

export const RailwayDeployTab: React.FC = () => {
  const {
    localApiUrl,
    setLocalApiUrl,
    isLocalApiConnected,
    localApiLastSync,
    isAutoSyncLocalApi,
    setIsAutoSyncLocalApi,
    testLocalApiConnection,
    pushToLocalApi,
    pullFromLocalApi,
    members,
    families,
    users,
    showToast
  } = useChurch();

  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [railwayUrlInput, setRailwayUrlInput] = useState(
    localApiUrl.includes('railway.app') ? localApiUrl : 'https://your-app.up.railway.app/api'
  );
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('success', 'File Terunduh', `File ${filename} siap disertakan di repository Anda.`);
  };

  const copyCode = (name: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(name);
    showToast('success', 'Disalin ke Clipboard', `Isi file ${name} berhasil disalin.`);
    setTimeout(() => setCopiedFile(null), 3000);
  };

  const handleTestRailway = async () => {
    let cleanUrl = railwayUrlInput.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    // ensure /api suffix if not present
    if (!cleanUrl.endsWith('/api') && !cleanUrl.includes('/api/')) {
      cleanUrl = cleanUrl.replace(/\/+$/, '') + '/api';
    }
    setRailwayUrlInput(cleanUrl);
    setLocalApiUrl(cleanUrl);

    setIsTesting(true);
    const result = await testLocalApiConnection(cleanUrl);
    setIsTesting(false);

    if (result.success) {
      showToast('success', 'Railway Terhubung', result.message);
    } else {
      showToast('error', 'Koneksi Gagal', result.message);
    }
  };

  const handlePushCloud = async () => {
    setIsSyncing(true);
    const result = await pushToLocalApi();
    setIsSyncing(false);
    if (result.success) {
      showToast('success', 'Sinkronisasi Berhasil', result.message);
    } else {
      showToast('error', 'Sinkronisasi Gagal', result.message);
    }
  };

  const handlePullCloud = async () => {
    setIsSyncing(true);
    const result = await pullFromLocalApi();
    setIsSyncing(false);
    if (result.success) {
      showToast('success', 'Data Ditarik', result.message);
    } else {
      showToast('error', 'Gagal Menarik Data', result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white rounded-2xl border border-purple-500/20 shadow-md">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-purple-600/30 border border-purple-400/40 rounded-xl text-purple-300 mt-0.5 shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                Panduan & Konfigurasi Deploy Railway Cloud
              </h3>
              <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 border border-purple-400/30 text-[10px] font-bold rounded-full">
                Production Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Aplikasi ini telah disesuaikan agar dapat langsung di-deploy di <strong>Railway.app</strong>. 
              Frontend React/Vite di-build secara otomatis, dan disajikan oleh server Node.js Express terintegrasi yang mendukung 
              SPA routing, health check, serta endpoint sinkronisasi cloud terpusat.
            </p>
          </div>
        </div>
      </div>

      {/* Railway Online Domain & Sync Hub */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <span>Hubungkan Domain Railway Anda (Sync Cloud PC & HP)</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Setelah Anda membuat project di Railway dan mendapatkan domain publik (misal: <code>https://nama-web.up.railway.app</code>),
            masukkan URL tersebut di bawah ini agar PC dan HP dapat saling menyinkronkan data secara online.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={railwayUrlInput}
            onChange={e => setRailwayUrlInput(e.target.value)}
            placeholder="https://gbi-love-inhil.up.railway.app/api"
            className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-purple-600"
          />
          <button
            onClick={handleTestRailway}
            disabled={isTesting}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Menguji...' : 'Uji Koneksi Cloud'}</span>
          </button>
        </div>

        {isLocalApiConnected && (
          <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <div className="flex items-center space-x-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Terhubung ke Server Cloud Railway! ({localApiUrl})</span>
            </div>
            {localApiLastSync && (
              <span className="text-[11px] text-emerald-700">Terakhir Sync: {localApiLastSync}</span>
            )}
          </div>
        )}

        {/* Cloud Sync Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={handlePushCloud}
            disabled={isSyncing}
            className="p-3.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left cursor-pointer transition-all space-y-1"
          >
            <div className="flex items-center space-x-2 font-bold text-xs text-purple-950">
              <Upload className="w-4 h-4 text-purple-600" />
              <span>Upload / Push Data ke Cloud Railway</span>
            </div>
            <p className="text-[11px] text-purple-800">
              Kirim akun user, data jemaat ({members.length}), dan KKJ ({families.length}) saat ini ke server Railway.
            </p>
          </button>

          <button
            onClick={handlePullCloud}
            disabled={isSyncing}
            className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left cursor-pointer transition-all space-y-1"
          >
            <div className="flex items-center space-x-2 font-bold text-xs text-emerald-950">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download / Pull Data dari Cloud ke HP / PC</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Ambil update database terbaru yang tersimpan di Railway ke browser ini.
            </p>
          </button>
        </div>

        {/* Auto-Sync Toggle */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              Auto-Sync Otomatis ke Railway Cloud (Setiap 30 Detik)
            </span>
            <span className="text-[11px] text-slate-500">
              Data di HP dan PC akan otomatis sinkron melalui server Railway tanpa perlu transfer manual.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAutoSyncLocalApi}
              onChange={e => setIsAutoSyncLocalApi(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* 3 Step Deployment Guide */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-purple-600" />
          <span>3 Langkah Mudah Deploy ke Railway</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h5 className="text-xs font-bold text-slate-900">Push ke GitHub / Export</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Simpan dan push repository ini ke GitHub akun Anda, atau unduh ZIP melalui menu Settings aplikasi ini.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h5 className="text-xs font-bold text-slate-900">Buat Project di Railway</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Buka <a href="https://railway.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-bold hover:underline">railway.com</a>, klik <strong>New Project</strong> $\rightarrow$ <strong>Deploy from GitHub repo</strong> $\rightarrow$ pilih repo Anda.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h5 className="text-xs font-bold text-slate-900">Railway Otomatis Build & Aktif</h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Railway membaca <code>railway.json</code> dan menjalankan <code>npm run build</code> lalu <code>node server.js</code>. Generate domain di tab Networking!
            </p>
          </div>
        </div>
      </div>

      {/* Ready Config Files in Repo */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-purple-600" />
            <span>File Konfigurasi Railway yang Sudah Disediakan di Project Ini</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Semua file ini telah dibuat dan siap pakai di root repository:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* server.js */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 font-mono">server.js</span>
              <button
                onClick={() => copyCode('server.js', generateServerJsCode())}
                className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center space-x-1 cursor-pointer"
              >
                {copiedFile === 'server.js' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFile === 'server.js' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Server Node.js Express production untuk static files + SPA fallback + API sync.
            </p>
            <button
              onClick={() => downloadFile('server.js', generateServerJsCode())}
              className="w-full py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Unduh server.js</span>
            </button>
          </div>

          {/* railway.json */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 font-mono">railway.json</span>
              <button
                onClick={() => copyCode('railway.json', generateRailwayJson())}
                className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center space-x-1 cursor-pointer"
              >
                {copiedFile === 'railway.json' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFile === 'railway.json' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Konfigurasi Nixpacks, build command, start command, dan healthcheck path.
            </p>
            <button
              onClick={() => downloadFile('railway.json', generateRailwayJson())}
              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Unduh railway.json</span>
            </button>
          </div>

          {/* nixpacks.toml */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 font-mono">nixpacks.toml</span>
              <button
                onClick={() => copyCode('nixpacks.toml', generateNixpacksToml())}
                className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center space-x-1 cursor-pointer"
              >
                {copiedFile === 'nixpacks.toml' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFile === 'nixpacks.toml' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Menentukan Node.js 20 runtime environment untuk build engine Railway.
            </p>
            <button
              onClick={() => downloadFile('nixpacks.toml', generateNixpacksToml())}
              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Unduh nixpacks.toml</span>
            </button>
          </div>

          {/* Dockerfile */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 font-mono">Dockerfile & Procfile</span>
              <button
                onClick={() => copyCode('Dockerfile', generateDockerfile())}
                className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center space-x-1 cursor-pointer"
              >
                {copiedFile === 'Dockerfile' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFile === 'Dockerfile' ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Fallback Dockerfile multi-stage build dan Procfile untuk deployment container.
            </p>
            <button
              onClick={() => downloadFile('Dockerfile', generateDockerfile())}
              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Unduh Dockerfile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
