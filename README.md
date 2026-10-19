# Ruang Variabel

Website materi **variabel** untuk SD kelas 4 dan kelas 6, berbasis **Scratch**.

- `index.html` — beranda, pilih kelas
- `kelas-4.html` — materi pemula, game **Misi Kotak Ajaib** (± 30 menit, nilai minimal 85), kuis 25 soal
- `kelas-6.html` — materi lanjut Scratch: membuat variabel, blok variabel, operator, jika & ulangi, untuk semua sprite, kesalahan umum, penelusur blok, kuis 25 soal, 3 proyek
- `style.css` — tampilan
- `script.js` — gambar blok Scratch, kuis, penelusur blok, dadu
- `game.js` — game kelas 4

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
- **Soal kuis kelas 6 & program penelusur:** bagian bawah `kelas-6.html` (`window.QUIZ_K6`, `window.TRACE_K6`).
- **Nilai minimal lulus kuis:** atribut `data-kkm="85"` pada elemen kuis.
- **Nilai minimal lulus game:** `const KKM = 85;` di `game.js`.
- **Soal-soal game:** daftar `M1` sampai `M5` di `game.js`.

### Menulis blok Scratch

Blok ditulis sebagai teks di dalam elemen `data-script`, satu baris satu blok:

```
event: ketika 🏁 diklik
var: atur [skor] ke (0)
ctrl: ulangi (3) kali
  var: ubah [skor] sebesar (2)
look: katakan {skor}
```

Jenis: `event`, `var`, `ctrl`, `look`, `sense`, `op`, `else`. Baris menjorok 2 spasi masuk ke dalam blok di atasnya.
`(isi)` kotak isian, `[nama]` pilihan, `{nama}` variabel, `{s:jawaban}` penginderaan, `{o:…}` operator, `«…»` kondisi.

Catatan: progres game tersimpan di browser masing-masing perangkat setiap satu misi selesai.
