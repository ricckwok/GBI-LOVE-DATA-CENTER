import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Railway and modern cloud providers inject the PORT environment variable.
// In Railway, process.env.PORT is automatically set and routed to public domains.
// In local dev/fallback, use 3000.
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';

app.use(express.json({ limit: '50mb' }));

// Request logging in development/production
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// CORS headers for API requests (enables external calls from mobile apps/web instances)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 1. Health Check Endpoint (Required by Railway for zero-downtime health checking)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'GBI LOVE INHIL Web App',
    version: '1.0.0',
    platform: process.env.RAILWAY_ENVIRONMENT ? 'Railway Cloud' : 'Production Node.js',
    environment: process.env.NODE_ENV || 'production',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 2. Central Cloud Sync Endpoint
// This allows the Railway deployment to serve as a central sync hub for PC and Mobile devices!
const cloudDbPath = path.join(__dirname, 'railway_cloud_db.json');

app.get('/api/sync', (req, res) => {
  try {
    if (fs.existsSync(cloudDbPath)) {
      const raw = fs.readFileSync(cloudDbPath, 'utf8');
      const parsed = JSON.parse(raw);
      return res.json({
        success: true,
        data: parsed,
        lastUpdated: fs.statSync(cloudDbPath).mtime.toISOString()
      });
    }
    return res.status(404).json({
      success: false,
      message: 'Belum ada data tersimpan di server cloud Railway. Lakukan Push data terlebih dahulu.'
    });
  } catch (err) {
    console.error('Error reading cloud database:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal membaca database di server Railway: ' + (err instanceof Error ? err.message : String(err))
    });
  }
});

app.post('/api/sync', (req, res) => {
  try {
    const payload = req.body && req.body.data ? req.body.data : req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Payload data tidak valid.'
      });
    }

    fs.writeFileSync(cloudDbPath, JSON.stringify(payload, null, 2), 'utf8');
    const memberCount = Array.isArray(payload.members) ? payload.members.length : 0;
    const userCount = Array.isArray(payload.users) ? payload.users.length : 0;

    return res.json({
      success: true,
      message: 'Data berhasil disinkronkan dan disimpan di Railway Cloud.',
      records: {
        members: memberCount,
        users: userCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error saving to cloud database:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal menyimpan data ke Railway: ' + (err instanceof Error ? err.message : String(err))
    });
  }
});

// 3. Static Files Serving (Built by Vite into /dist)
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, {
    maxAge: '1h',
    etag: true
  }));
}

// 4. SPA Client-Side Routing Fallback
app.get('*', (req, res) => {
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GBI LOVE INHIL - Menyiapkan Aplikasi</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
            .card { background: #1e293b; padding: 2rem; border-radius: 1rem; max-width: 480px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid #334155; }
            h1 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #38bdf8; }
            p { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; }
            code { background: #0f172a; padding: 0.25rem 0.5rem; border-radius: 0.25rem; color: #f59e0b; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>GBI LOVE INHIL Cloud Server Active</h1>
            <p>Aplikasi web sedang disiapkan di Railway. Jika Anda baru pertama kali deploy, pastikan build command <code>npm run build</code> telah selesai dijalankan.</p>
          </div>
        </body>
      </html>
    `);
  }
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`=======================================================`);
  console.log(`🚀 GBI LOVE INHIL Web App is running on port ${PORT}`);
  console.log(`🌐 Accessible on http://${HOST}:${PORT}`);
  console.log(`🩺 Health check endpoint: http://${HOST}:${PORT}/api/health`);
  console.log(`☁️ Cloud Sync endpoint: http://${HOST}:${PORT}/api/sync`);
  console.log(`=======================================================`);
});
