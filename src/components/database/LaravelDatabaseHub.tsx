import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import {
  generateLaravelSQLDump,
  generateLaravelMigration,
  generateLaravelMemberModel,
  generateLaravelDatabaseSeeder,
  generateLaravelApiRoutes,
  LaravelExportData
} from '../../utils/laravelGenerator';
import {
  Database,
  Code2,
  Download,
  Copy,
  Check,
  FileCode,
  Layers,
  Terminal,
  Server,
  Sparkles,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const LaravelDatabaseHub: React.FC = () => {
  const {
    users,
    churchSettings,
    members,
    families,
    coolGroups,
    childDedications,
    waterBaptisms,
    holySpiritBaptisms,
    marriages,
    deathRecords,
    workers,
    attendanceRecords,
    waSettings,
    waTemplates,
    waLogs,
    activityLogs,
    showToast
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'sql' | 'migration' | 'model' | 'seeder' | 'routes' | 'guide'>('sql');
  const [copied, setCopied] = useState(false);

  const exportData: LaravelExportData = {
    users,
    churchSettings,
    members,
    families,
    coolGroups,
    childDedications,
    waterBaptisms,
    holySpiritBaptisms,
    marriages,
    deathRecords,
    workers,
    workerDepartments: [],
    worshipServices: [],
    worshipTypes: [],
    attendanceRecords,
    waSettings,
    waTemplates,
    waLogs,
    activityLogs
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case 'sql':
        return generateLaravelSQLDump(exportData);
      case 'migration':
        return generateLaravelMigration();
      case 'model':
        return generateLaravelMemberModel();
      case 'seeder':
        return generateLaravelDatabaseSeeder(exportData);
      case 'routes':
        return generateLaravelApiRoutes();
      case 'guide':
        return `# Panduan Implementasi Backend Laravel (GBI Love Inhil)

1. Buat Proyek Laravel Baru:
   composer create-project laravel/laravel gbi-love-inhil-backend
   cd gbi-love-inhil-backend

2. Konfigurasi .env Database (MySQL / PostgreSQL):
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=gbi_love_inhil
   DB_USERNAME=root
   DB_PASSWORD=

3. Pasang Migrasi Database:
   Salin file migrasi dari tab "Laravel Migration" ke folder:
   database/migrations/2026_01_01_000001_create_church_tables.php

4. Jalankan Migrasi:
   php artisan migrate

5. Isi Data Awal / Seeder:
   Salin file dari tab "Laravel Seeder" ke database/seeders/DatabaseSeeder.php, lalu jalankan:
   php artisan db:seed

6. Pasang API Routes & Model:
   Salin routes ke: routes/api.php
   Salin model ke: app/Models/ChurchMember.php

7. Jalankan Server Lokal:
   php artisan serve
   Aplikasi backend siap diakses pada http://127.0.0.1:8000
`;
      default:
        return '';
    }
  };

  const currentCode = getActiveCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    showToast('success', 'Berhasil Disalin', `Kode ${activeTab.toUpperCase()} berhasil disalin ke clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = 'gbi_love_inhil_dump.sql';
    let mimeType = 'text/plain';

    if (activeTab === 'sql') {
      filename = 'gbi_love_inhil_database.sql';
      mimeType = 'application/sql';
    } else if (activeTab === 'migration') {
      filename = '2026_01_01_000001_create_church_tables.php';
      mimeType = 'application/x-php';
    } else if (activeTab === 'model') {
      filename = 'ChurchMember.php';
      mimeType = 'application/x-php';
    } else if (activeTab === 'seeder') {
      filename = 'DatabaseSeeder.php';
      mimeType = 'application/x-php';
    } else if (activeTab === 'routes') {
      filename = 'api.php';
      mimeType = 'application/x-php';
    } else if (activeTab === 'guide') {
      filename = 'PANDUAN_LARAVEL.md';
      mimeType = 'text/markdown';
    }

    const blob = new Blob([currentCode], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'File Diunduh', `File "${filename}" berhasil diunduh.`);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-linear-to-r from-red-950/40 via-slate-900 to-blue-950/40 border border-slate-700/70 rounded-3xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-black uppercase tracking-wider">
                  Laravel 11 / 12 Architecture
                </span>
                <span className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Auto-Saved on Session Login</span>
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                Pusat Basis Data & Generator Arsitektur Laravel
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Seluruh data jemaat, KKJ, COOL, sakramen, dan presensi otomatis tersimpan permanen pada penyimpanan lokal dan siap diekspor ke format database SQL, skema migrasi Laravel, model Eloquent, dan seeder resmi.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 text-center shrink-0">
            <div>
              <span className="block text-base font-extrabold text-blue-400">{members.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">Jemaat</span>
            </div>
            <div className="border-x border-slate-700/60 px-2">
              <span className="block text-base font-extrabold text-amber-400">{families.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">KKJ</span>
            </div>
            <div>
              <span className="block text-base font-extrabold text-emerald-400">{coolGroups.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">COOL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Code Viewer */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Navigation Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'sql'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>SQL Dump (.sql)</span>
            </button>

            <button
              onClick={() => setActiveTab('migration')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'migration'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Laravel Migration</span>
            </button>

            <button
              onClick={() => setActiveTab('model')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'model'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Eloquent Model</span>
            </button>

            <button
              onClick={() => setActiveTab('seeder')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'seeder'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Database Seeder</span>
            </button>

            <button
              onClick={() => setActiveTab('routes')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'routes'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>API Routes</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'guide'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Panduan Setup</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
              title="Salin Kode ke Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
              title="Unduh File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File</span>
            </button>
          </div>
        </div>

        {/* Code Content Container */}
        <div className="relative bg-slate-950 p-4 sm:p-6 overflow-x-auto max-h-[550px]">
          <pre className="text-xs font-mono text-slate-200 leading-relaxed whitespace-pre font-normal">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Format: <strong>PHP 8.2+ / Laravel 11 & 12 / MySQL 8.0+</strong></span>
          </div>
          <p className="text-[11px] text-slate-400">
            Dihasilkan secara dinamis berdasarkan kondisi data aktual sistem.
          </p>
        </div>
      </div>
    </div>
  );
};
