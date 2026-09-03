# Panduan Lengkap Deploy GBI Love Inhil ke Railway.app

Dokumen ini menjelaskan langkah demi langkah cara men-deploy aplikasi web **GBI Love Inhil** ke platform cloud **Railway** (https://railway.com) secara instan, gratis, dan otomatis.

---

## Mengapa Deploy di Railway Menyelesaikan Masalah Sinkronisasi PC & HP?
Ketika aplikasi web dideploy di Railway:
1. **Satu Domain Cloud Terpusat**: Anda mendapatkan alamat publik resmi seperti `https://gbi-love-inhil.up.railway.app`.
2. **PC & HP Mengakses Aplikasi yang Sama**: Browser di PC gereja dan browser di HP jemaat/pengerja membuka URL yang sama persis.
3. **Akun User Baru Langsung Sinkron**: Akun yang dibuat oleh Super Admin di PC dapat langsung digunakan untuk login di HP di mana pun berada.
4. **Zero-Configuration Server**: Project ini sudah dilengkapi dengan:
   - `server.js` (Express production server dengan SPA fallback & Cloud Sync endpoint `/api/sync`)
   - `railway.json` (Konfigurasi Nixpacks & Healthcheck `/api/health`)
   - `nixpacks.toml` (Build blueprint Node.js 20)
   - `Procfile` (Process runner `web: node server.js`)
   - `Dockerfile` (Container fallback opsional)

---

## Langkah 1: Siapkan Repository GitHub
1. Pastikan seluruh file project ini telah di-push ke repository GitHub Anda (bisa public atau private).
2. Jika Anda mengekspor file via ZIP dari AI Studio:
   - Ekstrak folder project.
   - Buka terminal/cmd di folder tersebut:
     ```bash
     git init
     git add .
     git commit -m "Deploy GBI Love Inhil to Railway"
     git branch -M main
     git remote add origin https://github.com/USERNAME-ANDA/NAMA-REPO.git
     git push -u origin main
     ```

---

## Langkah 2: Deploy di Railway
1. Buka [https://railway.com](https://railway.com) dan login dengan akun GitHub Anda.
2. Di dashboard Railway, klik tombol **+ New Project**.
3. Pilih opsi **Deploy from GitHub repo**.
4. Pilih repository project GBI Love Inhil Anda.
5. Klik **Deploy Now**.

Railway akan secara otomatis:
- Mendeteksi Node.js 20 melalui `nixpacks.toml`.
- Menjalankan `npm run build` untuk mengompilasi Vite & Tailwind ke folder `/dist`.
- Menjalankan `node server.js` pada port yang disediakan Railway (`process.env.PORT`).
- Melakukan verifikasi kesehatan server via `/api/health`.

---

## Langkah 3: Mengaktifkan Domain Publik di Railway
1. Setelah status deployment **Active** / **Success**, klik service project Anda di dashboard Railway.
2. Buka tab **Settings** $\rightarrow$ gulir ke bagian **Networking**.
3. Klik tombol **Generate Domain** (atau masukkan custom domain gereja Anda jika ada).
4. Anda akan mendapatkan URL seperti:
   ```
   https://gbi-love-inhil.up.railway.app
   ```
5. Buka URL tersebut di browser PC maupun HP Anda!

---

## Langkah 4: Sinkronisasi Cloud Antar-Perangkat
Aplikasi ini memiliki fitur **Railway Cloud Sync**:
1. Buka web di PC atau HP.
2. Klik tombol **Link Data PC** atau buka menu **Pengaturan $\rightarrow$ Deploy Railway Cloud**.
3. Masukkan domain Railway Anda (misal `https://gbi-love-inhil.up.railway.app/api`).
4. Klik **Uji Koneksi Cloud** $\rightarrow$ klik **Upload / Push Data ke Cloud Railway**.
5. Di HP, buka web yang sama dan aktifkan **Auto-Sync Otomatis ke Railway Cloud**.

Semua data jemaat, pengerja, KKJ, absensi, dan akun user kini terpusat dan dapat diakses dari mana saja!
