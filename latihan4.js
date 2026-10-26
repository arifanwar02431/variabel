/* =========================================================
   Latihan Soal Kelas 4 — 30 soal, 8 jenis (data soal)
   Mesin latihan ada di latihan-engine.js
   ========================================================= */
(function () {
  "use strict";
  const root = document.querySelector("[data-latihan]");
  if (!root || !window.RV || !window.RVLatihan) return;

  /* ---------------- DATA SOAL ----------------
     Kartu perintah memakai format yang sama dengan materi:
       isi: skor | 0   tambah: skor | 2   kurangi: skor | 1
       ulangi: 3 (baris di bawahnya menjorok 2 spasi)   tampilkan: skor   mulai */
  const GROUPS = [
    {
      key: "A", title: "Pilihan ganda", icon: "🔘",
      help: "Ketuk satu jawaban yang paling tepat.",
      items: [
        { type: "pg", q: "Bagian variabel yang dipakai untuk <b>memanggil</b> kotaknya adalah …",
          o: ["Nama", "Isi", "Warna", "Ukuran"], a: 0,
          e: "Nama variabel seperti label di luar kotak. Komputer memakai nama itu untuk menemukan kotaknya." },
        { type: "pg", q: "Rina ingin menyimpan <b>jumlah buku di tasnya</b>. Nama variabel yang paling tepat adalah …",
          o: ["<code>jumlah_buku</code>", "<code>buku saya</code>", "<code>1buku</code>", "<code>bbb</code>"], a: 0,
          e: "<code>jumlah_buku</code> jelas dan benar. <code>buku saya</code> memakai spasi, <code>1buku</code> diawali angka, <code>bbb</code> tidak jelas." },
        { type: "pg", q: "Variabel mana yang isinya berupa <b>tulisan</b>?",
          o: ["<code>nama_kucing</code> berisi Mimi", "<code>umur</code> berisi 10", "<code>skor</code> berisi 25", "<code>suhu</code> berisi 31"], a: 0,
          e: "Mimi adalah tulisan (nama). Isi variabel lainnya berupa angka." },
        { type: "pg", q: "Perintah yang membuat isi lama variabel <b>hilang dan diganti</b> adalah …",
          o: ["Isi", "Tambah", "Kurangi", "Tampilkan"], a: 0,
          e: "Perintah “isi” mengganti isi lama dengan isi baru. “Tambah” dan “kurangi” mengubah isi yang lama." },
        { type: "pg", q: "Manakah yang <b>bukan</b> kegunaan variabel?",
          o: ["Membersihkan layar komputer dari debu", "Menyimpan skor game", "Menyimpan total belanja", "Menyimpan nama pemain"], a: 0,
          e: "Variabel dipakai untuk menyimpan data di dalam program, bukan untuk membersihkan benda." }
      ]
    },
    {
      key: "B", title: "Benar atau salah", icon: "⚖️",
      help: "Baca pernyataannya, lalu ketuk BENAR atau SALAH.",
      items: [
        { type: "bs", q: "Isi variabel bisa berubah saat program berjalan.", a: true,
          e: "Benar. Itulah arti kata variabel: dapat berubah." },
        { type: "bs", q: "Satu variabel bisa menyimpan dua isi sekaligus.", a: false,
          e: "Salah. Satu variabel hanya menyimpan satu isi pada satu waktu." },
        { type: "bs", q: "Nama variabel boleh diawali angka, misalnya <code>2skor</code>.", a: false,
          e: "Salah. Angka boleh dipakai, tetapi di belakang, misalnya <code>skor2</code>." },
        { type: "bs", q: "Perintah “tambah isi skor dengan 1” membuat isi skor bertambah 1.", a: true,
          e: "Benar. Jika skor 4, setelah perintah itu skor menjadi 5." },
        { type: "bs", q: "Perintah “tampilkan isi skor” akan menampilkan tulisan <b>skor</b> di layar.", a: false,
          e: "Salah. Yang muncul adalah <b>isinya</b>, misalnya 12, bukan tulisan “skor”." }
      ]
    },
    {
      key: "C", title: "Isian singkat", icon: "✏️",
      help: "Ketik jawabanmu di kotak, lalu tekan Periksa.",
      items: [
        { type: "isian", q: "Setiap variabel punya dua bagian, yaitu <b>nama</b> dan ……",
          accept: ["isi", "nilai", "isinya", "nilainya", "isi (nilai)", "nilai (isi)"], show: "isi (nilai)",
          e: "Variabel punya nama (label) dan isi atau nilai (barang di dalam kotak)." },
        { type: "isian", q: "Kata “variabel” berasal dari bahasa Inggris <em>variable</em> yang artinya dapat ……",
          accept: ["berubah", "diubah", "di ubah", "berganti", "diganti"], show: "berubah",
          e: "Variable artinya dapat berubah, karena isi variabel bisa diganti." },
        { type: "isian", q: "Tulis ulang nama <b>warna favorit</b> supaya tidak memakai spasi.", mono: true,
          accept: ["warna_favorit"], show: "warna_favorit",
          e: "Spasi diganti dengan garis bawah (_), sehingga menjadi <code>warna_favorit</code>." }
      ]
    },
    {
      key: "D", title: "Menjodohkan", icon: "🔗",
      help: "Pilih nama variabel yang cocok untuk setiap isi. Satu nama hanya dipakai sekali. Ada satu nama yang tidak dipakai.",
      match: true,
      options: ["nama_hewan", "suhu", "tabungan", "hari", "nyawa", "tinggi_badan"],
      items: [
        { type: "jodoh", emo: "🐱", val: "Oyen", desc: "nama kucing peliharaan", a: "nama_hewan" },
        { type: "jodoh", emo: "🌡️", val: "29", desc: "panas udara hari ini", a: "suhu" },
        { type: "jodoh", emo: "🐷", val: "20000", desc: "uang di celengan", a: "tabungan" },
        { type: "jodoh", emo: "📅", val: "Rabu", desc: "nama hari ini", a: "hari" },
        { type: "jodoh", emo: "❤️", val: "3", desc: "sisa kesempatan di game", a: "nyawa" }
      ]
    },
    {
      key: "E", title: "Hitung isi variabel", icon: "🧮",
      help: "Jalankan kartu perintah dari atas ke bawah. Ketik isi variabel di akhir program.",
      items: [
        { type: "hitung", v: "koin", k: "mulai\nisi: koin | 4\ntambah: koin | 3", a: 7,
          e: "4 + 3 = <b>7</b>." },
        { type: "hitung", v: "nyawa", k: "mulai\nisi: nyawa | 5\nkurangi: nyawa | 2\nkurangi: nyawa | 1", a: 2,
          e: "5 → 3 → <b>2</b>." },
        { type: "hitung", v: "skor", k: "mulai\nisi: skor | 10\nisi: skor | 3\ntambah: skor | 2", a: 5,
          e: "Isi 10 diganti menjadi 3 oleh perintah “isi”, lalu ditambah 2 → <b>5</b>." },
        { type: "hitung", v: "bintang", k: "mulai\nisi: bintang | 0\nulangi: 4\n  tambah: bintang | 3", a: 12,
          e: "Ditambah 3 sebanyak 4 kali: 0 → 3 → 6 → 9 → <b>12</b>." },
        { type: "hitung", v: "air", story: "Ember berisi 10 liter air. Dipakai menyiram tanaman 4 liter, lalu diisi lagi 6 liter.",
          k: "mulai\nisi: air | 10\nkurangi: air | 4\ntambah: air | 6", a: 12,
          e: "10 → 6 → <b>12</b> liter." }
      ]
    },
    {
      key: "F", title: "Mengurutkan perintah", icon: "🔢",
      help: "Ketuk kartu satu per satu sesuai urutan yang benar, lalu tekan Periksa.",
      items: [
        { type: "urut", q: "Susun program supaya layar menampilkan angka <b>8</b>.",
          cards: [["isi", "skor", "5"], ["tambah", "skor", "3"], ["tampilkan", "skor"]],
          e: "Isi dulu skor dengan 5, tambah 3 menjadi 8, baru ditampilkan." },
        { type: "urut", q: "Dina punya <b>2</b> permen. Ibu memberinya <b>5</b> permen, lalu Dina memakan <b>1</b> permen. Tampilkan sisa permennya. Susun sesuai urutan cerita!",
          cards: [["isi", "permen", "2"], ["tambah", "permen", "5"], ["kurangi", "permen", "1"], ["tampilkan", "permen"]],
          e: "2 → 7 → 6. Layar menampilkan <b>6</b> permen." },
        { type: "urut", q: "Susun program hitung mundur supaya layar menampilkan angka <b>0</b>.",
          cards: [["isi", "waktu", "10"], ["kurangi", "waktu", "10"], ["tampilkan", "waktu"]],
          e: "Waktu harus diisi 10 dulu. Setelah dikurangi 10 menjadi 0, barulah ditampilkan." }
      ]
    },
    {
      key: "G", title: "Pilih semua yang tepat", icon: "☑️",
      help: "Jawaban benar bisa lebih dari satu. Ketuk semua yang tepat, lalu tekan Periksa.",
      items: [
        { type: "multi", q: "Pilih <b>semua</b> nama variabel yang <b>salah</b> (tidak boleh dipakai).",
          o: ["1skor", "nama pemain", "skor1", "jumlah_koin"], a: ["1skor", "nama pemain"],
          e: "<code>1skor</code> diawali angka dan <code>nama pemain</code> memakai spasi. <code>skor1</code> dan <code>jumlah_koin</code> boleh dipakai." },
        { type: "multi", q: "Pilih <b>semua</b> nama yang benar <b>dan</b> jelas untuk menyimpan jumlah siswa di kelas.",
          o: ["jumlah_siswa", "banyak_siswa", "x", "jumlah siswa"], a: ["jumlah_siswa", "banyak_siswa"],
          e: "<code>jumlah_siswa</code> dan <code>banyak_siswa</code> jelas dan benar. <code>x</code> tidak jelas, <code>jumlah siswa</code> memakai spasi." }
      ]
    },
    {
      key: "H", title: "Temukan kesalahan", icon: "🔍",
      help: "Ada satu kartu perintah yang salah. Ketuk kartu itu.",
      items: [
        { type: "salah", q: "Program ini seharusnya membuat skor menjadi <b>7</b>, tetapi hasilnya 2. Kartu mana yang salah?",
          k: "mulai\nisi: skor | 5\nisi: skor | 2\ntampilkan: skor", a: 2,
          e: "Kartu “isi skor dengan 2” mengganti isi 5 menjadi 2. Seharusnya “tambah isi skor dengan 2”, sehingga 5 + 2 = 7." },
        { type: "salah", q: "Program ini seharusnya menghitung mundur dari <b>3</b> sampai <b>0</b>, tetapi hasilnya 6. Kartu mana yang salah?",
          k: "mulai\nisi: waktu | 3\nulangi: 3\n  tambah: waktu | 1\ntampilkan: waktu", a: 3,
          e: "Hitung mundur berarti waktu berkurang. Kartu “tambah” harus diganti “kurangi isi waktu dengan 1”: 3 → 2 → 1 → 0." }
      ]
    }
  ];

  window.RVLatihan.create(root, GROUPS, { next: "#coba", nextLabel: "Lanjut ke game →" });
})();
