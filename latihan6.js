/* =========================================================
   Latihan Soal Kelas 6 — 30 soal, 9 jenis (data soal)
   Variabel + flowchart, tingkat lanjut.
   Mesin latihan ada di latihan-engine.js
   ========================================================= */
(function () {
  "use strict";
  const root = document.querySelector('[data-latihan="k6"]');
  if (!root || !window.RV || !window.RVLatihan) return;

  /* Pembuat simbol flowchart */
  function S() { return { t: "start", x: "Mulai" }; }
  function E() { return { t: "end", x: "Selesai" }; }
  function P(x, o) { return Object.assign({ t: "proc", x: x }, o || {}); }
  function IO(x, o) { return Object.assign({ t: "io", x: x }, o || {}); }
  function D(x, o) { return Object.assign({ t: "dec", x: x }, o || {}); }
  const SEL = ["Ya", "Tidak"];
  const LULUS = function (cond) {
    return [S(), IO("Masukkan nilai"), D(cond || "nilai ≥ 75?", { side: { t: "io", x: 'Tampilkan\n"Lulus"', label: "Ya", join: 1 } }), IO('Tampilkan\n"Belajar lagi"'), E()];
  };

  const GROUPS = [
    {
      key: "A", title: "Pilihan ganda", icon: "🔘",
      help: "Ketuk satu jawaban yang paling tepat.",
      items: [
        { type: "pg", q: "Dalam flowchart, tulisan <code>total ← total + harga</code> artinya …",
          o: ["Isi total diganti dengan hasil total + harga", "Periksa apakah total sama dengan total + harga", "Tampilkan total dan harga di layar", "Pengguna memasukkan nilai total"], a: 0,
          e: "Tanda ← artinya “diisi”. Hitung dulu bagian kanan (total + harga), lalu hasilnya disimpan ke variabel total." },
        { type: "pg", q: "Simbol mana yang hanya <b>memeriksa</b> isi variabel tanpa mengubahnya?",
          o: ["Keputusan (belah ketupat)", "Proses (persegi panjang)", "Input “Masukkan …” (jajar genjang)", "Semua simbol selalu mengubah isi variabel"], a: 0,
          e: "Keputusan hanya membandingkan isi variabel untuk memilih jalur Ya atau Tidak. Proses dan input mengubah isi variabel." },
        { type: "pg", q: "Mengapa <code>jumlah ← 0</code> perlu ditulis <b>sebelum</b> perulangan yang menambah jumlah?",
          o: ["Agar penjumlahan dimulai dari angka yang jelas", "Agar perulangan berhenti lebih cepat", "Agar flowchart terlihat lebih panjang", "Karena setiap flowchart wajib berisi angka 0"], a: 0,
          e: "Ini disebut inisialisasi. Tanpa nilai awal, isi jumlah sebelum ditambah tidak diketahui, sehingga hasilnya bisa salah." },
        { type: "pg", q: "Variabel <code>a</code> berisi 3 dan <code>b</code> berisi 8. Urutan langkah mana yang <b>menukar</b> isi a dan b dengan benar?",
          o: ["temp ← a, lalu a ← b, lalu b ← temp", "a ← b, lalu b ← a", "b ← a, lalu a ← b", "temp ← a, lalu b ← temp, lalu a ← b"], a: 0,
          e: "temp menyimpan 3, a menjadi 8, lalu b diisi dari temp (3). Tanpa temp, salah satu nilai hilang sehingga a dan b menjadi sama." }
      ]
    },
    {
      key: "B", title: "Benar atau salah", icon: "⚖️",
      help: "Baca pernyataannya dengan teliti, lalu ketuk BENAR atau SALAH.",
      items: [
        { type: "bs", q: "Jika isi variabel <code>nilai</code> adalah 75, maka kondisi <code>nilai &gt; 75?</code> bernilai Ya.", a: false,
          e: "Salah. Tanda &gt; artinya “lebih dari”. 75 tidak lebih dari 75, jadi Tidak. Kalau kondisinya ≥ (lebih dari atau sama dengan), barulah Ya." },
        { type: "bs", q: "Jika variabel penghitung di dalam perulangan tidak pernah berubah, perulangan bisa tidak pernah berhenti.", a: true,
          e: "Benar. Kondisi berhenti tidak akan pernah terpenuhi kalau isi variabelnya tetap sama." },
        { type: "bs", q: "Kotak keputusan <code>skor ≥ 10?</code> mengubah isi variabel skor menjadi 10.", a: false,
          e: "Salah. Keputusan hanya memeriksa. Isi skor tetap seperti sebelumnya." }
      ]
    },
    {
      key: "C", title: "Telusuri flowchart", icon: "🔍",
      help: "Jalankan flowchart dari Mulai sampai Selesai sambil mencatat isi setiap variabel. Ketik apa yang ditampilkan.",
      items: [
        { type: "telusur", num: true, q: "Flowchart dengan dua variabel.",
          f: [S(), P("a ← 4"), P("b ← a + 3"), P("a ← a × b"), IO("Tampilkan a"), E()], a: ["28"],
          e: "a = 4, b = 4 + 3 = 7, lalu a = 4 × 7 = <b>28</b>. Perhatikan: a memakai isi b yang baru." },
        { type: "telusur", num: true, q: "Perulangan dengan langkah 2.",
          f: [S(), P("total ← 0"), P("i ← 1"), P("total ← total + i"), P("i ← i + 2"), D("i > 7?", { back: { to: 3, label: "Tidak" } }), IO("Tampilkan total"), E()], a: ["16"],
          e: "i bernilai 1, 3, 5, 7 (setelah 7 menjadi 9 dan perulangan berhenti). total = 1 + 3 + 5 + 7 = <b>16</b>." },
        { type: "telusur", num: true, q: "Tiket museum berbeda untuk anak dan dewasa.", input: "umur = 12",
          f: [S(), IO("Masukkan umur"), D("umur ≥ 13?", { side: { t: "proc", x: "harga ← 15000", label: "Ya", join: 1 } }), P("harga ← 8000"), IO("Tampilkan harga"), E()],
          a: ["8000", "8.000", "rp8000", "rp8.000", "rp 8000", "rp 8.000"],
          e: "12 ≥ 13 bernilai Tidak, jadi jalur ke bawah: harga ← <b>8000</b>." },
        { type: "telusur", num: true, q: "Hitung mundur dengan pengurangan 3.",
          f: [S(), P("waktu ← 20"), P("waktu ← waktu − 3"), D("waktu < 5?", { back: { to: 2, label: "Tidak" } }), IO("Tampilkan waktu"), E()], a: ["2"],
          e: "20 → 17 → 14 → 11 → 8 → 5 → 2. Saat waktu = 5, kondisi 5 &lt; 5 masih Tidak. Baru saat waktu = 2 kondisinya Ya. Tampil <b>2</b>." },
        { type: "telusur", num: true, q: "Tantangan: tiga variabel yang saling bergantung.",
          f: [S(), P("a ← 1"), P("b ← 1"), P("c ← a + b"), P("a ← b"), P("b ← c"), D("c > 10?", { back: { to: 3, label: "Tidak" } }), IO("Tampilkan c"), E()], a: ["13"],
          e: "c bernilai 2, 3, 5, 8, lalu 13. Setelah c = 13, kondisi c &gt; 10 bernilai Ya. Tampil <b>13</b>. Deret ini disebut deret Fibonacci." }
      ]
    },
    {
      key: "D", title: "Lengkapi tabel penelusuran", icon: "📋",
      help: "Isi semua kotak kosong di tabel. Satu tabel bernilai 1 poin jika semua kotaknya benar.",
      items: [
        { type: "tabel", q: "Telusuri perulangan ini. Kolom “Ke-” adalah putaran ke berapa. Baris putaran 1 sudah diisi sebagai contoh.",
          f: [S(), P("uang ← 5000"), P("hari ← 1"), P("uang ← uang + 2000"), P("hari ← hari + 1"), D("hari > 3?", { back: { to: 3, label: "Tidak" } }), IO("Tampilkan uang"), E()],
          cols: ["Ke-", "uang", "hari", "hari &gt; 3?"],
          rows: [["1", "7000", "2", "Tidak"], ["2", { a: 9000 }, { a: 3 }, { a: "Tidak", sel: SEL }], ["3", { a: 11000 }, { a: 4 }, { a: "Ya", sel: SEL }]],
          e: "Setiap putaran: uang bertambah 2000, hari bertambah 1. Di putaran 3, hari = 4 sehingga 4 &gt; 3 bernilai Ya dan perulangan berhenti. Output: 11000." },
        { type: "tabel", q: "Flowchart ini dijalankan 4 kali dengan input berbeda. Tentukan output setiap input.",
          f: [S(), IO("Masukkan suhu"), D("suhu > 30?", { side: { t: "io", x: 'Tampilkan\n"Panas"', label: "Ya", join: 1 } }), IO('Tampilkan\n"Sejuk"'), E()],
          cols: ["Input suhu", "Output"],
          rows: [["35", { a: "Panas", sel: ["Panas", "Sejuk"] }], ["30", { a: "Sejuk", sel: ["Panas", "Sejuk"] }], ["31", { a: "Panas", sel: ["Panas", "Sejuk"] }], ["18", { a: "Sejuk", sel: ["Panas", "Sejuk"] }]],
          e: "Perhatikan suhu 30: 30 &gt; 30 bernilai Tidak, sehingga output “Sejuk”. Hanya suhu di atas 30 yang “Panas”." }
      ]
    },
    {
      key: "E", title: "Jodohkan peran variabel", icon: "🔗",
      help: "Tentukan peran variabel di setiap kotak flowchart. Ada satu peran yang tidak dipakai.",
      match: true, placeholder: "— pilih peran —", unit: "pasangan",
      options: ["Penghitung", "Penjumlah", "Hitung mundur", "Penyimpan input", "Penentu jalur", "Penyimpan hasil hitung"],
      items: [
        { type: "jodoh", shape: "proc", x: "langkah ← langkah + 1", a: "Penghitung" },
        { type: "jodoh", shape: "proc", x: "total ← total + harga", a: "Penjumlah" },
        { type: "jodoh", shape: "proc", x: "waktu ← waktu − 1", a: "Hitung mundur" },
        { type: "jodoh", shape: "io", x: "Masukkan nama", a: "Penyimpan input" },
        { type: "jodoh", shape: "dec", x: "nilai ≥ 75?", a: "Penentu jalur" }
      ]
    },
    {
      key: "F", title: "Lengkapi flowchart", icon: "🧩",
      help: "Ada kotak “?” di setiap flowchart. Pilih isi yang membuat flowchart bekerja dengan benar.",
      items: [
        { type: "lengkapi", q: "Flowchart menghitung <b>rata-rata tiga nilai</b>.",
          f: [S(), IO("Masukkan a, b, c"), P("jumlah ← a + b + c"), P("rata ← jumlah ÷ 3", { blank: true }), IO("Tampilkan rata"), E()],
          o: ["rata ← jumlah ÷ 3", "rata ← jumlah × 3", "rata ← a + b + c"],
          e: "Rata-rata = jumlah dibagi banyaknya nilai, yaitu 3." },
        { type: "lengkapi", q: "Flowchart menjumlahkan <b>1 + 2 + 3 + … + 10</b>. Apa isi kotak keputusan?",
          f: [S(), P("total ← 0"), P("i ← 1"), P("total ← total + i"), P("i ← i + 1"), D("i > 10?", { blank: true, back: { to: 3, label: "Tidak" } }), IO("Tampilkan total"), E()],
          o: ["i > 10?", "i > 1?", "total > 10?"],
          e: "Perulangan harus berhenti setelah i melewati 10. “i > 1?” berhenti terlalu cepat, sedangkan “total > 10?” berhenti saat total = 15 (baru 1 sampai 5)." },
        { type: "lengkapi", q: "Toko memberi potongan Rp10.000 jika belanja <b>minimal Rp100.000</b>. Apa isi kotak di jalur Ya?",
          f: [S(), IO("Masukkan total"), D("total ≥ 100000?", { side: { t: "proc", x: "total ←\ntotal − 10000", label: "Ya", join: 0, blank: true } }), IO("Tampilkan total"), E()],
          o: ["total ← total − 10000", "total ← 10000", "total ← total + 10000"],
          e: "Potongan berarti total dikurangi 10000 dari isi sebelumnya. “total ← 10000” justru mengganti total menjadi 10000." }
      ]
    },
    {
      key: "G", title: "Susun flowchart", icon: "🏗️",
      help: "Ketuk kartu satu per satu sesuai urutan. Ada 1 kartu pengecoh yang tidak boleh dipakai.",
      items: [
        { type: "susun", q: "Susun flowchart untuk menghitung harga setelah <b>diskon 10%</b>.",
          steps: [IO("Masukkan harga"), P("diskon ← harga × 10 ÷ 100"), P("bayar ← harga − diskon"), IO("Tampilkan bayar")],
          extra: P("bayar ← diskon − harga"),
          e: "Diskon harus dihitung dulu sebelum dipakai untuk menghitung bayar." },
        { type: "susun", q: "Susun flowchart untuk mengubah <b>jam menjadi detik</b> (1 jam = 60 menit, 1 menit = 60 detik).",
          steps: [IO("Masukkan jam"), P("menit ← jam × 60"), P("detik ← menit × 60"), IO("Tampilkan detik")],
          extra: P("detik ← jam × 60"),
          e: "Jam diubah ke menit dulu, lalu menit diubah ke detik. 1 jam = 3600 detik." },
        { type: "susun", q: "Susun flowchart untuk <b>menukar isi</b> variabel a dan b.",
          steps: [IO("Masukkan a dan b"), P("temp ← a"), P("a ← b"), P("b ← temp"), IO("Tampilkan a dan b")],
          extra: P("b ← a"),
          e: "Isi a disimpan dulu di temp sebelum a ditimpa. Kartu “b ← a” adalah pengecoh, karena saat itu a sudah berisi nilai b." }
      ]
    },
    {
      key: "H", title: "Temukan kesalahan", icon: "🐞",
      help: "Setiap flowchart punya satu kotak yang salah. Ketuk kotak itu di gambar.",
      items: [
        { type: "salahflow", q: "Flowchart ini seharusnya menghitung harga <b>3 buku</b> yang sama. Kotak mana yang salah?",
          f: [S(), IO("Masukkan harga"), P("total ← harga + 3"), IO("Tampilkan total"), E()], a: 2,
          e: "Harga 3 buku = harga × 3, bukan harga + 3." },
        { type: "salahflow", q: "Flowchart ini seharusnya menampilkan angka 1 sampai 5, tetapi <b>tidak pernah berhenti</b>. Kotak mana yang salah?",
          f: [S(), P("angka ← 1"), IO("Tampilkan angka"), P("angka ← angka − 1"), D("angka > 5?", { back: { to: 2, label: "Tidak" } }), E()], a: 3,
          e: "angka terus berkurang (0, −1, −2, …) sehingga tidak pernah lebih dari 5. Seharusnya angka ← angka + 1." },
        { type: "salahflow", q: "Siswa lulus jika nilainya <b>minimal 75</b>. Tetapi siswa dengan nilai 75 justru mendapat “Belajar lagi”. Kotak mana yang salah?",
          f: LULUS("nilai > 75?"), a: 2,
          e: "“Minimal 75” artinya 75 juga lulus. Kondisinya harus nilai ≥ 75, bukan nilai &gt; 75." }
      ]
    },
    {
      key: "I", title: "Pilih semua yang tepat", icon: "☑️",
      help: "Jawaban benar bisa lebih dari satu. Ketuk semua yang tepat, lalu tekan Periksa.",
      items: [
        { type: "multi", q: "Pilih <b>semua</b> input nilai yang membuat flowchart ini menampilkan “Lulus”.",
          f: LULUS(), o: ["74", "75", "80", "70", "100"], a: ["75", "80", "100"],
          e: "Nilai yang ≥ 75 adalah 75, 80, dan 100. Ingat, 75 termasuk karena tandanya ≥." },
        { type: "multi", q: "Pilih <b>semua</b> kotak flowchart yang <b>mengubah</b> isi variabel skor.",
          o: ["skor ← 0", "skor ← skor + 5", "skor ≥ 10?", "Tampilkan skor", "Masukkan skor"], a: ["skor ← 0", "skor ← skor + 5", "Masukkan skor"],
          e: "Proses (←) dan input (Masukkan) mengubah isi skor. Keputusan hanya memeriksa, output hanya menampilkan." }
      ]
    }
  ];

  window.RVLatihan.create(root, GROUPS, { next: "#main", nextLabel: "Lanjut ke game →" });
})();
