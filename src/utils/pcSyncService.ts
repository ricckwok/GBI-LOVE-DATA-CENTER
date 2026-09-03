import { FullDatabaseBackup } from '../types/sync';

// Global variable in browser memory for active FileSystemFileHandle
let linkedPCFileHandle: any = null;

/**
 * Check if the browser supports Native File System Access API
 */
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showOpenFilePicker' in window;
}

/**
 * Request user to pick or create a JSON database file on their PC
 */
export async function openAndLinkPCFile(): Promise<{ handle: any; fileName: string; data?: FullDatabaseBackup } | null> {
  if (!isFileSystemAccessSupported()) {
    throw new Error('Browser Anda tidak mendukung File System Access API langsung. Harap gunakan Google Chrome, Microsoft Edge, atau Opera terbaru di PC.');
  }

  try {
    const [handle] = await (window as any).showOpenFilePicker({
      types: [
        {
          description: 'Database JSON GBI Love Inhil',
          accept: {
            'application/json': ['.json']
          }
        }
      ],
      multiple: false
    });

    linkedPCFileHandle = handle;
    const file = await handle.getFile();
    const text = await file.text();

    let data: FullDatabaseBackup | undefined;
    if (text && text.trim()) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn('File contains invalid JSON, will be initialized on first save.', e);
      }
    }

    return {
      handle,
      fileName: file.name,
      data
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return null; // User cancelled the picker dialog
    }
    throw err;
  }
}

/**
 * Create a new linked JSON database file on PC
 */
export async function createAndLinkNewPCFile(initialData: FullDatabaseBackup): Promise<{ handle: any; fileName: string } | null> {
  if (!isFileSystemAccessSupported()) {
    throw new Error('Browser Anda tidak mendukung File System Access API langsung.');
  }

  try {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: `gbi_love_inhil_db_${new Date().toISOString().split('T')[0]}.json`,
      types: [
        {
          description: 'Database JSON GBI Love Inhil',
          accept: {
            'application/json': ['.json']
          }
        }
      ]
    });

    linkedPCFileHandle = handle;
    const jsonStr = JSON.stringify(initialData, null, 2);
    
    // Write initial data to the newly created file
    const writable = await handle.createWritable();
    await writable.write(jsonStr);
    await writable.close();

    const file = await handle.getFile();
    return {
      handle,
      fileName: file.name
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return null;
    }
    throw err;
  }
}

/**
 * Write current database snapshot directly to the linked PC file
 */
export async function writeToLinkedPCFile(data: FullDatabaseBackup): Promise<boolean> {
  if (!linkedPCFileHandle) {
    return false;
  }

  try {
    // Verify permission if needed
    if (linkedPCFileHandle.queryPermission) {
      const permission = await linkedPCFileHandle.queryPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        const req = await linkedPCFileHandle.requestPermission({ mode: 'readwrite' });
        if (req !== 'granted') {
          return false;
        }
      }
    }

    const jsonStr = JSON.stringify(data, null, 2);
    const writable = await linkedPCFileHandle.createWritable();
    await writable.write(jsonStr);
    await writable.close();
    return true;
  } catch (err) {
    console.error('Error writing to linked PC file:', err);
    return false;
  }
}

/**
 * Read the current database snapshot directly from the linked PC file
 */
export async function readFromLinkedPCFile(): Promise<FullDatabaseBackup | null> {
  if (!linkedPCFileHandle) {
    return null;
  }

  try {
    const file = await linkedPCFileHandle.getFile();
    const text = await file.text();
    if (!text || !text.trim()) return null;
    return JSON.parse(text) as FullDatabaseBackup;
  } catch (err) {
    console.error('Error reading from linked PC file:', err);
    return null;
  }
}

/**
 * Disconnect/Unlink active PC file handle
 */
export function unlinkPCFileHandle() {
  linkedPCFileHandle = null;
}

/**
 * Get active handle
 */
export function getActivePCFileHandle() {
  return linkedPCFileHandle;
}

/**
 * Test connection to a local server API running on the PC
 */
export async function testLocalServerConnection(apiUrl: string): Promise<{ success: boolean; message: string; version?: string }> {
  const cleanUrl = apiUrl.replace(/\/+$/, '');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${cleanUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: true,
        message: `Terhubung ke server lokal (${res.status} OK)`,
        version: data.version || '1.0'
      };
    } else {
      return {
        success: false,
        message: `Server merespon dengan status ${res.status}: ${res.statusText}`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.name === 'AbortError' ? 'Koneksi timeout (server tidak merespon dalam 4 detik)' : 'Tidak dapat terhubung ke server localhost. Pastikan server lokal sudah berjalan.'
    };
  }
}

/**
 * Push full church database to local PC server
 */
export async function pushToLocalServer(apiUrl: string, data: FullDatabaseBackup): Promise<{ success: boolean; message: string }> {
  const cleanUrl = apiUrl.replace(/\/+$/, '');
  try {
    const res = await fetch(`${cleanUrl}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        source: 'GBI_LOVE_INHIL_WEB',
        timestamp: new Date().toISOString(),
        data
      })
    });

    if (res.ok) {
      return { success: true, message: 'Data berhasil disinkronkan dan disimpan ke server PC.' };
    } else {
      const errJson = await res.json().catch(() => ({}));
      return { success: false, message: errJson.message || `Gagal sinkronisasi (Status ${res.status})` };
    }
  } catch (err: any) {
    return { success: false, message: `Gagal mengirim data ke server: ${err.message}` };
  }
}

/**
 * Pull full church database from local PC server
 */
export async function pullFromLocalServer(apiUrl: string): Promise<{ success: boolean; data?: FullDatabaseBackup; message: string }> {
  const cleanUrl = apiUrl.replace(/\/+$/, '');
  try {
    const res = await fetch(`${cleanUrl}/sync`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const responseData = await res.json();
      const dbData: FullDatabaseBackup = responseData.data || responseData;
      return { success: true, data: dbData, message: 'Data berhasil ditarik dari server PC.' };
    } else {
      return { success: false, message: `Server mengembalikan status ${res.status}` };
    }
  } catch (err: any) {
    return { success: false, message: `Gagal mengambil data dari server: ${err.message}` };
  }
}

/**
 * Check and request persistent storage from browser
 */
export async function checkAndRequestPersistentStorage(): Promise<{ isPersisted: boolean; usage?: number; quota?: number }> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    const isAlreadyPersisted = await navigator.storage.persisted();
    let isPersisted = isAlreadyPersisted;
    if (!isAlreadyPersisted) {
      isPersisted = await navigator.storage.persist();
    }

    let usage: number | undefined;
    let quota: number | undefined;
    if (navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      usage = estimate.usage;
      quota = estimate.quota;
    }

    return { isPersisted, usage, quota };
  }
  return { isPersisted: false };
}

/**
 * Generate Complete Laravel Controller for PC Backend (app/Http/Controllers/Api/ChurchSyncController.php)
 */
export function generateLaravelControllerScript(): string {
  return `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Storage;
use Illuminate\\Support\\Facades\\File;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Facades\\DB;

/**
 * GBI LOVE INHIL - Laravel API Controller
 * Mendukung penyimpanan data JSON dan MySQL terintegrasi
 */
class ChurchSyncController extends Controller
{
    private $storagePath;

    public function __construct()
    {
        $this->storagePath = storage_path('app/gbi_love_inhil_db.json');
    }

    /**
     * Cek status koneksi dan kesehatan server Laravel
     * GET /api/health
     */
    public function health()
    {
        $dbConnected = false;
        try {
            DB::connection()->getPdo();
            $dbConnected = true;
        } catch (\\Exception $e) {
            $dbConnected = false;
        }

        return response()->json([
            'status' => 'ok',
            'framework' => 'Laravel ' . app()->version(),
            'app' => 'GBI LOVE INHIL Backend API',
            'server_time' => now()->toIso8601String(),
            'database_connected' => $dbConnected,
            'storage_file_exists' => File::exists($this->storagePath),
            'storage_file_size' => File::exists($this->storagePath) ? File::size($this->storagePath) : 0
        ]);
    }

    /**
     * Sinkronisasi data utama (Tarik & Simpan)
     * GET /api/sync  -> Ambil data terbaru
     * POST /api/sync -> Simpan data dari Web/Mobile
     */
    public function sync(Request $request)
    {
        // 1. GET: Tarik data dari server Laravel
        if ($request->isMethod('get')) {
            if (!File::exists($this->storagePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Database di server Laravel belum ada data. Silakan lakukan Push terlebih dahulu.'
                ], 404);
            }

            $content = File::get($this->storagePath);
            $data = json_decode($content, true);

            return response()->json([
                'success' => true,
                'data' => $data,
                'last_updated' => date('c', File::lastModified($this->storagePath))
            ]);
        }

        // 2. POST: Simpan data dari Web/HP ke Laravel
        $payload = $request->input('data', $request->all());

        if (empty($payload) || !is_array($payload)) {
            return response()->json([
                'success' => false,
                'message' => 'Format payload data tidak valid.'
            ], 422);
        }

        // Pastikan direktori storage ada
        if (!File::exists(dirname($this->storagePath))) {
            File::makeDirectory(dirname($this->storagePath), 0755, true);
        }

        File::put($this->storagePath, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $memberCount = isset($payload['members']) ? count($payload['members']) : 0;
        $userCount = isset($payload['users']) ? count($payload['users']) : 0;

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan ke server Laravel.',
            'timestamp' => now()->toIso8601String(),
            'summary' => [
                'total_members' => $memberCount,
                'total_users' => $userCount
            ]
        ]);
    }

    /**
     * Endpoint Otentikasi User
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        if (File::exists($this->storagePath)) {
            $data = json_decode(File::get($this->storagePath), true);
            $users = $data['users'] ?? [];

            foreach ($users as $u) {
                if (strtolower($u['username']) === strtolower($username)) {
                    // Validasi password (mendukung password plain atau default universal)
                    if ($u['password'] === $password || in_array($password, ['admin123', 'operator123', 'cool123', 'gbi12345'])) {
                        return response()->json([
                            'success' => true,
                            'message' => 'Login berhasil',
                            'user' => $u,
                            'token' => bin2hex(random_bytes(32))
                        ]);
                    }
                }
            }
        }

        return response()->json([
            'success' => false,
            'message' => 'Username atau password tidak sesuai.'
        ], 401);
    }
}
`;
}

/**
 * Generate Laravel routes/api.php
 */
export function generateLaravelRoutesScript(): string {
  return `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\ChurchSyncController;

/*
|--------------------------------------------------------------------------
| GBI LOVE INHIL API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    Route::get('/health', [ChurchSyncController::class, 'health']);
    Route::match(['get', 'post'], '/sync', [ChurchSyncController::class, 'sync']);
    Route::post('/auth/login', [ChurchSyncController::class, 'login']);
});

// Direct alias routes
Route::get('/health', [ChurchSyncController::class, 'health']);
Route::match(['get', 'post'], '/sync', [ChurchSyncController::class, 'sync']);
Route::post('/login', [ChurchSyncController::class, 'login']);
`;
}

/**
 * Generate Laravel CORS Configuration (config/cors.php)
 */
export function generateLaravelCorsConfigScript(): string {
  return `<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    | Mengizinkan akses dari browser HP dan Web PC
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', '*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
`;
}

/**
 * Generate MySQL Migration for Laravel
 */
export function generateLaravelMigrationScript(): string {
  return `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Tabel Users
        Schema::create('church_users', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('username')->unique();
            $table->string('full_name');
            $table->string('email')->nullable();
            $table->string('password');
            $table->string('role');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Tabel Master Jemaat
        Schema::create('church_members', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('family_id')->nullable();
            $table->string('full_name');
            $table->string('gender', 10);
            $table->string('phone_number')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('birth_place')->nullable();
            $table->text('address')->nullable();
            $table->string('blood_type', 5)->nullable();
            $table->string('marital_status')->nullable();
            $table->string('family_role')->nullable();
            $table->string('age_category')->default('ADULT');
            $table->string('status')->default('ACTIVE');
            $table->string('cool_group_id')->nullable();
            $table->boolean('is_water_baptized')->default(false);
            $table->boolean('is_holy_spirit_baptized')->default(false);
            $table->timestamps();
        });

        // 3. Tabel Kartu Keluarga (KKJ)
        Schema::create('church_families', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('kkj_number')->unique();
            $table->string('head_name');
            $table->text('address')->nullable();
            $table->date('marriage_date')->nullable();
            $table->timestamps();
        });

        // 4. Tabel Presensi / Kehadiran
        Schema::create('church_attendances', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('service_id');
            $table->string('member_id')->nullable();
            $table->string('guest_name')->nullable();
            $table->string('category')->default('MEMBER');
            $table->string('method')->default('QR_CODE');
            $table->timestamp('scanned_at')->useCurrent();
        });
    }

    public function down()
    {
        Schema::dropIfExists('church_attendances');
        Schema::dropIfExists('church_families');
        Schema::dropIfExists('church_members');
        Schema::dropIfExists('church_users');
    }
};
`;
}


/**
 * Generate 1-File Node.js Server for PC
 */
export function generateLocalNodeServerScript(): string {
  return `/**
 * GBI LOVE INHIL - Local PC Data Sync Server (Node.js)
 * Jalankan di terminal PC Anda: node server.js
 * Pastikan port 8000 tidak terpakai.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const DB_FILE = path.join(__dirname, 'gbi_love_inhil_db.json');

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  // Health check
  if (url === '/api/health' || url === '/health') {
    const exists = fs.existsSync(DB_FILE);
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      app: 'GBI LOVE INHIL Node.js PC Server',
      version: '1.0',
      db_exists: exists,
      db_path: DB_FILE,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Sync Endpoint
  if (url === '/api/sync' || url === '/sync') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const dataToSave = parsed.data || parsed;
          fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
          
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Database berhasil disimpan di PC: ' + DB_FILE,
            timestamp: new Date().toISOString(),
            savedMembers: (dataToSave.members || []).length
          }));
        } catch (err) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, message: 'JSON tidak valid: ' + err.message }));
        }
      });
      return;
    } else if (req.method === 'GET') {
      if (!fs.existsSync(DB_FILE)) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, message: 'Database lokal belum tersedia.' }));
        return;
      }
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const dbData = JSON.parse(fileContent);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, data: dbData }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
      return;
    }
  }

  res.writeHead(200);
  res.end(JSON.stringify({
    app: 'GBI LOVE INHIL PC Connector',
    status: 'running',
    port: PORT
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(\`GBI LOVE INHIL Server PC berjalan di http://localhost:\${PORT}\`);
  console.log(\`File database disimpan di: \${DB_FILE}\`);
});
`;
}
