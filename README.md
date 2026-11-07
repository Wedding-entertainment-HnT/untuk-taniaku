# Kartu Ucapan untuk Tania Renata

Kartu ucapan romantis dengan animasi sinematik (seperti video pendek), partikel yang membentuk hati, dan musik lembut. Situs statis murni: tanpa build, tanpa dependensi.

## Isi folder
- `index.html` - struktur halaman
- `style.css` - tampilan dan animasi
- `script.js` - adegan, partikel, musik, dan teks (ubah di bagian `CONFIG`)

## Cara upload ke GitHub dan online lewat GitHub Pages
1. Buat repository baru di GitHub, misalnya `kartu-tania`.
2. Klik **Add file > Upload files**, lalu seret ketiga file di atas (`index.html`, `style.css`, `script.js`) beserta `README.md`. Klik **Commit changes**.
3. Buka **Settings > Pages**. Pada **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu 1-2 menit. Link kartunya: `https://USERNAME.github.io/kartu-tania/`
5. Kirim link itu ke Tania.

## Kustomisasi cepat
Buka `script.js`, ubah bagian `CONFIG` di paling atas:
- `from` - namamu atau panggilan sayang
- `scenes` - teks tiap adegan dan durasinya (milidetik)
- `finalTitle` dan `finalText` - pesan di kartu penutup

## Catatan
- Musik baru berbunyi setelah Tania menekan tombol **Buka kartunya** (aturan browser).
- Font memakai Google Fonts, jadi perlu internet saat dibuka.
