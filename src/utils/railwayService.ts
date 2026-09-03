/**
 * Railway Cloud Deployment Service & Generator
 * GBI LOVE INHIL
 */

export function generateRailwayJson(): string {
  return JSON.stringify(
    {
      "$schema": "https://railway.com/railway.schema.json",
      "build": {
        "builder": "NIXPACKS",
        "buildCommand": "npm run build"
      },
      "deploy": {
        "startCommand": "node server.js",
        "healthcheckPath": "/api/health",
        "healthcheckTimeout": 180,
        "restartPolicyType": "ON_FAILURE",
        "restartPolicyMaxRetries": 10
      }
    },
    null,
    2
  );
}

export function generateNixpacksToml(): string {
  return `[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm install --include=dev"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "node server.js"
`;
}

export function generateProcfile(): string {
  return `web: node server.js\n`;
}

export function generateDockerfile(): string {
  return `# Multi-stage Docker build for Railway deployment
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci || npm install

# Copy source files and build
COPY . .
RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copy compiled assets and production server
COPY --from=builder /app/dist ./dist
COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]
`;
}

export function generateServerJsCode(): string {
  return `import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';

app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'GBI LOVE INHIL Web App',
    platform: process.env.RAILWAY_ENVIRONMENT ? 'Railway Cloud' : 'Production Node.js',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Cloud Sync endpoints
const cloudDbPath = path.join(__dirname, 'railway_cloud_db.json');

app.get('/api/sync', (req, res) => {
  try {
    if (fs.existsSync(cloudDbPath)) {
      const data = JSON.parse(fs.readFileSync(cloudDbPath, 'utf8'));
      return res.json({ success: true, data });
    }
    return res.status(404).json({ success: false, message: 'Belum ada data tersimpan di server cloud.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sync', (req, res) => {
  try {
    const payload = req.body && req.body.data ? req.body.data : req.body;
    fs.writeFileSync(cloudDbPath, JSON.stringify(payload, null, 2), 'utf8');
    return res.json({ success: true, message: 'Data berhasil disinkronkan ke Railway Cloud.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Serve Vite dist directory
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: '1h', etag: true }));
}

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('<h1>GBI LOVE INHIL Server Aktif</h1><p>Jalankan npm run build untuk mengompilasi frontend.</p>');
  }
});

app.listen(PORT, HOST, () => {
  console.log(\`Server running on http://\${HOST}:\${PORT}\`);
});
`;
}
