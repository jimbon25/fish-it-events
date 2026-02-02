# 🐟 Fish It Roblox - Discord Server Landing Page

Landing page modern untuk server Discord "Fish It Roblox" dengan admin dashboard untuk manajemen event mingguan.

## ✨ Fitur Utama

### 1. **Landing Page Public**
- Hero section yang eye-catching dengan gradient modern
- Daftar event mingguan dalam format card yang responsif
- Event di-load dari file JSON online (GitHub)
- Desain dark mode yang modern dan clean
- Fully responsive (mobile & desktop)
- Smooth scrolling dan animasi

### 2. **Admin Dashboard**
- Login sederhana dengan password hardcoded
- Form untuk membuat event baru:
  - Judul event
  - Deskripsi detail
  - Informasi hadiah/prize
  - Tanggal event
- Daftar event aktif dengan opsi hapus
- Update real-time ke GitHub

### 3. **Penyimpanan Data (GitHub Integration)**
- Event disimpan di file `events.json` di GitHub repository
- Update otomatis menggunakan GitHub REST API v3
- GitHub token disimpan sebagai environment variable
- Format JSON rapi dan mudah dibaca
- Backup otomatis setiap update

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3 (Dark Mode), Vanilla JavaScript
- **Data Storage**: JSON + GitHub REST API
- **Deployment**: Vercel (siap untuk production)
- **Kompatibilitas**: All modern browsers

## 📁 Struktur Folder

```
/
├── index.html          # Landing page utama
├── admin.html          # Dashboard admin
├── styles.css          # CSS global (dark mode)
├── script.js           # Script landing page (fetch & render events)
├── admin.js            # Script admin dashboard (login & API)
├── events.json         # Contoh data events
├── README.md           # Documentation
├── vercel.json         # Konfigurasi Vercel
└── .env.example        # Template environment variables
```

## 🔧 Setup & Installation

### 1. Clone atau Download Project

```bash
git clone https://github.com/YOUR_USERNAME/fish-it-events.git
cd fish-it-events
```

### 2. Setup GitHub Repository untuk Events

Buat repository baru di GitHub untuk menyimpan `events.json`:

```bash
# Inisialisasi git
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fish-it-events.git
git push -u origin main
```

### 3. Setup GitHub Personal Access Token

1. Pergi ke [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Buat token baru dengan permission `repo` (full control)
3. Copy token (jangan share!)

### 4. Update Konfigurasi

Di file `script.js` dan `admin.js`, update konfigurasi:

```javascript
// script.js - Line 13
EVENTS_URL: 'https://raw.githubusercontent.com/YOUR_USERNAME/fish-it-events/main/events.json'

// admin.js - Line 6-8
GITHUB_USERNAME: 'YOUR_USERNAME',
GITHUB_REPO: 'fish-it-events',
```

## 🌐 Deployment ke Vercel

### 1. Connect ke Vercel

```bash
npm i -g vercel
vercel
```

### 2. Set Environment Variable

Di Vercel Dashboard:
1. Pilih project
2. Pergi ke Settings > Environment Variables
3. Tambahkan:
   - Key: `GITHUB_TOKEN`
   - Value: [Paste token GitHub Anda]

Atau via CLI:
```bash
vercel env add GITHUB_TOKEN
```

### 3. Deploy

```bash
vercel --prod
```

### 4. Update Discord Link

Di `index.html`, update link Discord server:

```html
<!-- Line 30 -->
<a href="https://discord.gg/YOUR_SERVER_ID" target="_blank" class="btn btn-primary">
    Join Discord Server
</a>
```

## 🔐 Security & Best Practices

### Admin Password
Password admin tersimpan hardcoded di `admin.js` (untuk demo). Untuk production:
- Gunakan backend dengan hashing password
- Jangan simpan password di client-side

### GitHub Token
- **JANGAN** commit token ke repository
- Gunakan environment variables di hosting
- Rotate token secara berkala
- Batasi permission token ke `repo` saja

### Data Validation
- Input form sudah ter-validate
- HTML escaping untuk prevent XSS
- Check GitHub response sebelum update

## 📝 Cara Menggunakan Admin Dashboard

1. Akses `/admin.html`
2. Login dengan password: `fishit2026`
3. Isi form event dengan detail lengkap
4. Klik "Simpan Event"
5. Data otomatis tersimpan di GitHub
6. Landing page akan memuat event terbaru

## 🎨 Kustomisasi

### Warna & Theme

Edit CSS variables di `styles.css`:

```css
:root {
    --bg-primary: #0a0e27;      /* Background utama */
    --accent-primary: #6366f1;  /* Warna accent */
    --success: #10b981;         /* Warna success */
}
```

### Discord Link

Update di `index.html` dengan invite link server Anda

### Admin Password

Update di `admin.js`:

```javascript
ADMIN_PASSWORD: 'fishit2026'  // Ganti dengan password Anda
```

## 🐛 Troubleshooting

### Events tidak muncul

1. Check console untuk error messages
2. Verify GitHub URL di `script.js`
3. Pastikan `events.json` sudah di-push ke GitHub
4. Cek rate limiting GitHub (60 req/jam untuk unauthenticated)

### Admin tidak bisa save event

1. Verify GitHub token di environment variable
2. Check GitHub API permissions
3. Pastikan repository accessibility
4. Check browser console untuk error details

### CORS Error

Jika terjadi CORS error saat fetch dari GitHub:
- GitHub raw content URL support CORS
- Verify URL format: `https://raw.githubusercontent.com/...`
- Tidak perlu setup CORS di server

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

Semua elements fully responsive dari mobile hingga desktop.

## 🎯 Features Roadmap

- [ ] Multiple admin accounts dengan role-based access
- [ ] Event categories/filtering
- [ ] Event cancellation & notifications
- [ ] User comments & reactions
- [ ] Event leaderboard
- [ ] Analytics & statistics
- [ ] Email notifications
- [ ] Dark/Light mode toggle

## 📞 Support

Untuk issue atau pertanyaan:
1. Check dokumentasi ini
2. Check browser console
3. Verify GitHub configuration
4. Check Vercel logs

## 📄 License

MIT License - Bebas digunakan dan dimodifikasi

## 🙏 Credits

Dibuat dengan ❤️ untuk komunitas Fish It Roblox

---

**Happy Gaming! 🎮🐟**
