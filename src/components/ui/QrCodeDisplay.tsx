import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode as QrIcon } from 'lucide-react';

interface QrCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
  showDownload?: boolean;
  className?: string;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  value,
  size = 140,
  label,
  showDownload = true,
  className = ''
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setDataUrl(url))
      .catch(err => console.error('Failed to generate QR code', err));
  }, [value, size]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `QR_${label ? label.replace(/[^a-zA-Z0-9]/g, '_') : 'CODE'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`flex flex-col items-center p-3 bg-white rounded-xl border border-slate-200 shadow-xs ${className}`}>
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={label || 'QR Code'}
          className="rounded-lg object-contain"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="flex items-center justify-center bg-slate-100 rounded-lg text-slate-400"
          style={{ width: size, height: size }}
        >
          <QrIcon className="w-8 h-8 animate-pulse" />
        </div>
      )}

      {label && <p className="text-[11px] font-semibold text-slate-700 mt-2 text-center truncate max-w-full">{label}</p>}

      {showDownload && dataUrl && (
        <button
          onClick={handleDownload}
          className="mt-2 text-[10px] text-blue-600 font-bold hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Download PNG</span>
        </button>
      )}
    </div>
  );
};
