import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { WATemplate, WAMessageLog } from '../../types';
import {
  MessageSquare,
  Send,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Edit2,
  Plus,
  Trash2,
  AlertTriangle,
  FileText,
  Key,
  X
} from 'lucide-react';

export const WhatsAppView: React.FC = () => {
  const {
    waSettings,
    updateWASettings,
    waTemplates,
    addWATemplate,
    updateWATemplate,
    deleteWATemplate,
    waLogs,
    resendWAMessage,
    runDailyBirthdayScheduler,
    churchSettings,
    showToast
  } = useChurch();

  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'templates' | 'apiConfig'>('logs');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WATemplate | undefined>(undefined);
  const [isResending, setIsResending] = useState<string | null>(null);

  // Template Form
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState<'BIRTHDAY' | 'WORSHIP_REMINDER' | 'PASTORAL_CARE' | 'GENERAL'>('BIRTHDAY');
  const [bodyText, setBodyText] = useState('');
  const [isActive, setIsActive] = useState(true);

  // API Config Form
  const [phoneNumberId, setPhoneNumberId] = useState(waSettings.phoneNumberId || '108492048593849');
  const [wabaId, setWabaId] = useState(waSettings.wabaId || '938492048593849');
  const [apiToken, setApiToken] = useState(waSettings.apiToken || 'EAAG93829482938492839482938492834');
  const [schedulerHour, setSchedulerHour] = useState(waSettings.dailySchedulerHour || 8);
  const [isAutoSendEnabled, setIsAutoSendEnabled] = useState(waSettings.isAutoSendEnabled ?? true);

  const openTemplateModal = (tmpl?: WATemplate) => {
    if (tmpl) {
      setEditingTemplate(tmpl);
      setTemplateName(tmpl.templateName);
      setTemplateType(tmpl.templateType);
      setBodyText(tmpl.bodyText);
      setIsActive(tmpl.isActive);
    } else {
      setEditingTemplate(undefined);
      setTemplateName('Template Ucapan Ulang Tahun Standard');
      setTemplateType('BIRTHDAY');
      setBodyText(`Shalom {NAMA_JEMAAT},\n\nSegenap Gembala Sidang {NAMA_GEMBALA} dan seluruh pelayan jemaat {NAMA_GEREJA} mengucapkan:\n\n🎂 Selamat Ulang Tahun ke-{USIA}! 🎂\n\nKiranya berkat, anugerah, damai sejahtera dan sukacita dari Tuhan Yesus Kristus senantiasa melimpah dalam kehidupan Saudara dan keluarga.\n\n"Tuhan memberkati engkau dan melindungi engkau; Tuhan menyinari engkau dengan wajah-Nya dan memberi engkau kasih karunia." (Bilangan 6:24-25)\n\nSalam Kasih,\n{NAMA_GEREJA} • {NAMA_COOL}`);
      setIsActive(true);
    }
    setIsTemplateModalOpen(true);
  };

  const handleTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || !bodyText.trim()) {
      showToast('error', 'Validasi', 'Nama template dan isi pesan wajib diisi.');
      return;
    }

    if (editingTemplate) {
      updateWATemplate(editingTemplate.id, {
        templateName,
        templateType,
        bodyText,
        isActive
      });
    } else {
      addWATemplate({
        templateName,
        templateType,
        bodyText,
        isActive
      });
    }
    setIsTemplateModalOpen(false);
  };

  const handleSaveAPIConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateWASettings({
      phoneNumberId,
      wabaId,
      apiToken,
      dailySchedulerHour: schedulerHour,
      isAutoSendEnabled
    });
  };

  const handleResend = async (logId: string) => {
    setIsResending(logId);
    try {
      await resendWAMessage(logId);
    } finally {
      setIsResending(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Pastoral & Otomasi</span>
            <span>•</span>
            <span className="text-blue-600">WhatsApp Cloud API & Scheduler</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Meta WhatsApp Cloud API & Otomasi Pesan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengiriman pesan ulang tahun otomatis dengan aturan pencegahan pesan duplikat (Anti-Duplicate Guard).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => openTemplateModal()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Template Baru</span>
          </button>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'logs' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Audit Log Pengiriman ({waLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('templates')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'templates' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Template Pesan ({waTemplates.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('apiConfig')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-2 ${
            activeSubTab === 'apiConfig' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Konfigurasi API & Scheduler</span>
        </button>
      </div>

      {/* Subtab 1: Logs */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                Riwayat Pengiriman & Pencegahan Duplikasi (Constraint: Member + Type + Year)
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Terakhir berjalan: {waSettings.lastSchedulerRun ? new Date(waSettings.lastSchedulerRun).toLocaleTimeString('id-ID') : '08:00 WIB'}
            </span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Penerima & No. WA</th>
                <th className="px-4 py-3.5">Tipe & Tahun</th>
                <th className="px-4 py-3.5">Isi Pesan Terkirim</th>
                <th className="px-4 py-3.5">Status Pengiriman</th>
                <th className="px-4 py-3.5">Waktu Eksekusi</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {waLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold">Belum ada log pengiriman pesan WhatsApp.</p>
                  </td>
                </tr>
              ) : (
                waLogs.map(log => {
                  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (log.status === 'TERKIRIM') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  else if (log.status === 'GAGAL') badgeColor = 'bg-red-50 text-red-700 border-red-200';
                  else if (log.status.startsWith('DILEWATI')) badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 block">{log.recipientName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{log.phoneNumber}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800 block">{log.messageType}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Tahun {log.sendYear}</span>
                      </td>
                      <td className="px-4 py-3.5 max-w-sm truncate">
                        <p className="text-[11px] text-slate-600 truncate">{log.messageBody}</p>
                        {log.providerMessageId && (
                          <span className="text-[9px] text-slate-400 font-mono block truncate">ID: {log.providerMessageId}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold border ${badgeColor}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                        {log.sentAt ? new Date(log.sentAt).toLocaleTimeString('id-ID') : new Date(log.scheduledAt).toLocaleTimeString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleResend(log.id)}
                          disabled={isResending === log.id}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Kirim Ulang</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Subtab 2: Templates */}
      {activeSubTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {waTemplates.map(tmpl => (
            <div key={tmpl.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{tmpl.templateName}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${tmpl.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                    {tmpl.isActive ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </div>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                  Tipe: {tmpl.templateType}
                </span>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {tmpl.bodyText}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">Variabel: {'{NAMA_JEMAAT}'}, {'{USIA}'}, {'{NAMA_GEREJA}'}</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openTemplateModal(tmpl)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteWATemplate(tmpl.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: API & Scheduler Configuration */}
      {activeSubTab === 'apiConfig' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-600" />
            <span>Kredensial Meta WhatsApp Cloud API</span>
          </h3>

          <form onSubmit={handleSaveAPIConfig} className="space-y-4 text-xs mt-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number ID *</label>
              <input
                type="text"
                value={phoneNumberId}
                onChange={e => setPhoneNumberId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Business Account ID (WABA ID) *</label>
              <input
                type="text"
                value={wabaId}
                onChange={e => setWabaId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Permanent System User Access Token *</label>
              <input
                type="password"
                value={apiToken}
                onChange={e => setApiToken(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jam Eksekusi Scheduler Harian (WIB)</label>
                <select
                  value={schedulerHour}
                  onChange={e => setSchedulerHour(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                >
                  <option value={7}>07:00 WIB</option>
                  <option value={8}>08:00 WIB (Direkomendasikan)</option>
                  <option value={9}>09:00 WIB</option>
                  <option value={10}>10:00 WIB</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block">Otomasi Aktif</span>
                  <span className="text-[10px] text-slate-500">Kirim otomatis harian</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAutoSendEnabled}
                  onChange={e => setIsAutoSendEnabled(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Simpan Konfigurasi WhatsApp API
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingTemplate ? 'Edit Template Pesan' : 'Buat Template Pesan Baru'}
              </h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 p-1"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleTemplateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Template *</label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipe Pesan</label>
                <select
                  value={templateType}
                  onChange={e => setTemplateType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg"
                >
                  <option value="BIRTHDAY">Ulang Tahun Jemaat (BIRTHDAY)</option>
                  <option value="WORSHIP_REMINDER">Pengingat Ibadah</option>
                  <option value="PASTORAL_CARE">Sapaan Pastoral</option>
                  <option value="GENERAL">Pesan Umum</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Pesan WhatsApp *</label>
                <textarea
                  rows={8}
                  required
                  value={bodyText}
                  onChange={e => setBodyText(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Variabel dinamis yang didukung: {'{NAMA_JEMAAT}'}, {'{USIA}'}, {'{NAMA_GEREJA}'}, {'{NAMA_COOL}'}, {'{NAMA_GEMBALA}'}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="tmplActive"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="tmplActive" className="font-bold text-slate-700">Jadikan Template Aktif</label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-semibold">Batal</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold">Simpan Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
