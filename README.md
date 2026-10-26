# Ruang Variabel

Website materi **variabel** untuk SD kelas 4 (kotak berlabel & kartu perintah) dan kelas 6 (variabel & flowchart). Praktik aplikasi (misalnya Scratch) dibahas guru secara terpisah.

- `index.html` — beranda, pilih kelas
- `kelas-4.html` — materi pemula, latihan 30 soal (8 jenis), game **Misi Kotak Ajaib** (± 30 menit, nilai minimal 85), kuis 25 soal
- `kelas-6.html` — variabel & flowchart: simbol, variabel di tiap simbol, urut/percabangan/perulangan, penelusur flowchart, game **Detektif Flowchart** (± 30 menit, nilai minimal 85), kuis 25 soal, latihan
- `style.css` — tampilan
- `script.js` — kartu perintah, gambar flowchart, kuis, penelusur flowchart
- `game-engine.js` — mesin game bersama (peta misi, poin, rapor)
- `game4.js` — game kelas 4
- `game6.js` — game kelas 6
- `latihan4.js` — 30 soal latihan kelas 4 (data soal ada di bagian atas file, `GROUPS`)

Tanpa library dan tanpa proses build.

## Menjalankan di komputer

Cukup buka `index.html` di browser.

## Deploy ke Vercel lewat GitHub

1. Unggah **semua file** di folder ini ke halaman utama repository GitHub (bukan di dalam subfolder).
2. Di vercel.com: **Add New… → Project** → pilih repository → **Import**.
3. Framework Preset: `Other`, Build Command: kosongkan → **Deploy**.

Setiap kali file di GitHub diperbarui, Vercel otomatis memperbarui website.

## Mengubah isi

- **Soal kuis kelas 4:** bagian bawah `kelas-4.html` (`window.QUIZ_K4`).
- **Soal latihan kelas 4:** bagian atas `latihan4.js` (`GROUPS`). Jenis soal: `pg`, `bs`, `isian`, `jodoh`, `hitung`, `urut`, `multi`, `salah`.
- **Soal kuis kelas 6, flowchart & penelusur:** bagian bawah `kelas-6.html` (`window.QUIZ_K6`, `window.FLOWS`, `window.TRACE_K6`).
- **Nilai minimal lulus kuis:** atribut `data-kkm="85"` pada elemen kuis.
- **Nilai minimal lulus game:** `kkm: 85` di bagian bawah `game4.js` / `game6.js`.
- **Soal-soal game:** daftar `M1` sampai `M5` di `game4.js` / `game6.js`.

### Menulis kartu perintah (kelas 4)

Kartu perintah ditulis sebagai teks di dalam elemen `data-steps` (atau `k:` pada soal kuis), satu baris satu perintah:

```
mulai
isi: skor | 0
ulangi: 3
  tambah: skor | 2
kurangi: skor | 1
tampilkan: skor
```

Baris menjorok 2 spasi masuk ke dalam “ulangi”.

### Menulis flowchart

```
{ nodes: [ S(), IO("Masukkan nilai"), D("nilai ≥ 75?", { side: { t: "io", x: "Tampilkan Lulus", label: "Ya", join: 1 } }), IO("Tampilkan Belajar lagi"), E() ] }
```

`side` = cabang ke kanan, `back: { to: nomor, label: "Tidak" }` = panah kembali (perulangan). Pakai `\n` untuk baris baru.

Catatan: progres game tersimpan di browser masing-masing perangkat setiap satu misi selesai.
