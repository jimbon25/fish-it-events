# ⚡ Quick Start Guide - Fish It Roblox Landing Page

## 5 Menit Setup

### Step 1: Siapkan GitHub Repository (5 menit)

1. Buat repository baru di GitHub: `fish-it-events`
2. Clone project ini ke repository
3. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fish-it-events.git
git push -u origin main
```

### Step 2: Buat GitHub Personal Access Token (3 menit)

1. Buka: https://github.com/settings/tokens/new
2. Buat token baru
3. Pilih scope: `repo` (full control)
4. Generate & copy token
5. **Jangan share token ini!**

### Step 3: Update Konfigurasi (2 menit)

Edit file `script.js` dan `admin.js`:

**Di script.js (line ~13):**
```javascript
EVENTS_URL: 'https://raw.githubusercontent.com/YOUR_USERNAME/fish-it-events/main/events.json'
```

**Di admin.js (line ~6-8):**
```javascript
GITHUB_USERNAME: 'YOUR_USERNAME',
GITHUB_REPO: 'fish-it-events',
```

### Step 4: Deploy ke Vercel (3 menit)

1. Buka https://vercel.com
2. Sign up / Login
3. Klik "New Project"
4. Import GitHub repository `fish-it-events`
5. Add Environment Variable:
   - Key: `GITHUB_TOKEN`
   - Value: [Paste token GitHub Anda]
6. Deploy!

### Step 5: Test Landing Page (1 menit)

1. Akses URL Vercel (misal: fish-it-events.vercel.app)
2. Lihat events muncul
3. Klik "Admin" → Login dengan password: `fishit2026`
4. Coba tambah event baru
5. Refresh landing page - event baru muncul!

---

## ✅ Checklist Selesai

- [ ] Repository GitHub dibuat
- [ ] Project di-push ke GitHub
- [ ] GitHub token dibuat
- [ ] Konfigurasi `script.js` & `admin.js` diupdate
- [ ] Project di-deploy ke Vercel
- [ ] Environment variable set di Vercel
- [ ] Landing page bisa diakses
- [ ] Admin dashboard bisa login
- [ ] Bisa tambah event baru
- [ ] Events muncul di landing page

---

## 🎮 Default Admin Password

```
fishit2026
```

**PENTING:** Ganti password ini sebelum production!

---

## 📱 Test di Device Berbeda

- Desktop: ✅ Full responsive
- Tablet: ✅ Full responsive
- Mobile: ✅ Full responsive

---

## 🚀 Selesai!

Landing page Anda sudah live! 🎉

### Hal yang bisa dilakukan sekarang:

1. **Share link** landing page ke Discord community
2. **Update Discord link** di `index.html`
3. **Customize warna** di `styles.css`
4. **Tambah event** via admin dashboard
5. **Monitor** traffic di Vercel dashboard

---

## 🆘 Jika Ada Masalah

| Masalah | Solusi |
|---------|--------|
| Events tidak muncul | Check console, verify GitHub URL, check rate limit |
| Admin password error | Verify password di `admin.js` |
| CORS error | GitHub raw URL support CORS, verify format |
| Token error | Check environment variable di Vercel |
| Deploy gagal | Check Vercel logs, verify GitHub access |

---

## 📞 Need Help?

Check `README.md` untuk dokumentasi lengkap!

---

**Happy Gaming! 🎮🐟**
