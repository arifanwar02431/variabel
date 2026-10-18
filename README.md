# Ruang Variabel

Website materi **variabel dalam pemrograman** untuk SD kelas 4 dan kelas 6.

- `index.html` — beranda, pilih kelas
- `kelas-4.html` — materi pemula: kotak berlabel, blok kode ala Scratch, game skor & nyawa, kuis 6 soal
- `kelas-6.html` — materi lanjut: memori, tipe data, penamaan, operasi, konstanta, scope, kesalahan umum, penelusur kode, kuis 8 soal, tantangan
- `style.css`, `script.js` — tampilan dan interaksi (tanpa library, tanpa build)

## Menjalankan di komputer

Cukup buka `index.html` di browser. Tidak perlu instalasi apa pun.

## Deploy ke Vercel lewat GitHub

1. Buat repository baru di GitHub (misalnya `belajar-variabel`).
2. Upload semua file di folder ini ke repository tersebut
   (lewat tombol **Add file → Upload files**, atau dengan git:
   `git init`, `git add .`, `git commit -m "Website materi variabel"`, lalu `git push`).
3. Buka [vercel.com](https://vercel.com), masuk dengan akun GitHub.
4. Klik **Add New… → Project**, pilih repository `belajar-variabel`, lalu **Import**.
5. Pengaturan:
   - **Framework Preset:** `Other`
   - **Build Command:** kosongkan
   - **Output Directory:** kosongkan (atau `.`)
6. Klik **Deploy**. Selesai — setiap kali kamu push perubahan ke GitHub, Vercel otomatis memperbarui website.

`vercel.json` mengaktifkan URL bersih, jadi halaman bisa dibuka sebagai `/kelas-4` dan `/kelas-6`.

## Mengubah isi

- Soal kuis kelas 4 ada di bagian bawah `kelas-4.html` (`window.QUIZ_K4`).
- Soal kuis kelas 6 dan program penelusur kode ada di bagian bawah `kelas-6.html` (`window.QUIZ_K6` dan `window.TRACE_PROGRAMS`).
- Warna tema ada di bagian atas `style.css` (`--k4` untuk kelas 4, `--k6` untuk kelas 6).
