/* =========================================================
   Latihan Soal Kelas 4 — 30 soal, 8 jenis
   Setiap soal diperiksa sekali (langsung ada pembahasan).
   Setelah 30 soal terjawab, muncul nilai akhir.
   ========================================================= */
(function () {
  "use strict";
  const root = document.querySelector("[data-latihan]");
  if (!root || !window.RV) return;
  const RV = window.RV;
  const KKM = Number(root.dataset.kkm || 85);

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

  /* ---------------- STATUS ---------------- */
  let state;          // { [no]: true/false } untuk soal yang sudah diperiksa
  let finished = false;
  const finishBtn = root.querySelector("[data-lat-finish]");
  let TOTAL = 0;
  GROUPS.forEach(function (g) { TOTAL += g.items.length; });

  const progText = root.querySelector("[data-lat-prog]");
  const progBar = root.querySelector("[data-lat-bar]");
  const body = root.querySelector("[data-lat-body]");
  const resultBox = root.querySelector("[data-lat-result]");

  function mark(no, ok) {
    if (no in state) return;
    state[no] = ok;
    RV.beep(ok ? "ok" : "bad");
    updateProgress();
  }
  const scoreEl = root.querySelector("[data-lat-score]");
  const pointsEl = root.querySelector("[data-lat-points]");
  let lastScore = 0;
  function counts() {
    const done = Object.keys(state).length;
    const right = Object.keys(state).filter(function (k) { return state[k]; }).length;
    return { done: done, right: right, score: Math.round(right / TOTAL * 100) };
  }
  function updateProgress() {
    const c = counts();
    scoreEl.textContent = c.score;
    pointsEl.textContent = c.right + "/" + TOTAL + " benar";
    if (c.score !== lastScore) {
      scoreEl.parentNode.classList.remove("pop"); void scoreEl.offsetWidth; scoreEl.parentNode.classList.add("pop");
      lastScore = c.score;
    }
    progText.innerHTML = "<b>" + c.done + "/" + TOTAL + "</b> dikerjakan" +
      (finished ? ' · <a href="#lat-hasil">Lihat skor ↓</a>' : "");
    progBar.style.width = (c.done / TOTAL * 100) + "%";
    finishBtn.hidden = finished;
    if (c.done === TOTAL && !finished) showResult(false);
  }
  function fbHTML(ok, html, pts) {
    const p = pts !== undefined ? pts : (ok ? 1 : 0);
    return '<div class="lat-fb ' + (ok ? "ok" : "bad") + '"><span class="pt-chip ' + (p ? "plus" : "zero") + '">+' + p + " poin</span><b>" + (ok ? "✅ Benar! " : "❌ Belum tepat. ") + "</b>" + html + "</div>";
  }
  function norm(s) { return String(s).toLowerCase().replace(/\s+/g, " ").trim(); }
  function cmdHTML(c, cls) { return RV.stepHTML(c[0], [c[1], c[2]], undefined, cls); }
  function asButton(html, attrs) { return html.replace(/^<div/, '<button type="button" ' + attrs).replace(/<\/div>$/, "</button>"); }

  /* ---------------- PENGGAMBAR TIAP JENIS ---------------- */
  function card(no, inner) {
    return '<div class="lat-q" data-no="' + no + '"><div class="lat-head"><span class="lat-num">' + no + "</span>" + inner + "</div></div>";
  }

  const R = {
    pg: function (it, no) {
      const opts = RV.shuffle(it.o.map(function (t, i) { return { t: t, ok: i === it.a }; }));
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="q-opts">' +
        opts.map(function (o, j) { return '<button type="button" class="q-opt"' + (o.ok ? ' data-ok="1"' : "") + '><span class="q-key">' + "ABCD"[j] + "</span><span>" + o.t + "</span></button>"; }).join("") +
        '</div><div class="lat-slot"></div></div>');
    },
    bs: function (it, no) {
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="bs-row">' +
        '<button type="button" class="bs-btn" data-v="1">✔ BENAR</button><button type="button" class="bs-btn" data-v="0">✘ SALAH</button>' +
        '</div><div class="lat-slot"></div></div>');
    },
    isian: function (it, no) {
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="isian-row">' +
        '<input type="text" class="lat-input' + (it.mono ? " mono" : "") + '" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ketik jawaban…" aria-label="Jawaban soal ' + no + '">' +
        '<button type="button" class="btn btn-primary" data-check>Periksa</button></div><div class="lat-slot"></div></div>');
    },
    hitung: function (it, no) {
      return card(no, '<div class="lat-main">' + (it.story ? '<p class="lat-text">' + it.story + "</p>" : "") +
        '<p class="lat-text">Berapa isi variabel <b>' + it.v + "</b> di akhir program?</p>" +
        '<div class="steps-box inline">' + RV.renderSteps(it.k) + "</div>" +
        '<div class="isian-row"><label class="hitung-label"><span class="vbox-label static">' + it.v + "</span> =</label>" +
        '<input type="text" inputmode="numeric" class="lat-input num" autocomplete="off" placeholder="?" aria-label="Isi variabel ' + it.v + '">' +
        '<button type="button" class="btn btn-primary" data-check>Periksa</button></div><div class="lat-slot"></div></div>');
    },
    urut: function (it, no) {
      const order = RV.shuffle(it.cards.map(function (c, i) { return i; }));
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="urut-wrap">' +
        '<div><p class="lat-sub">Kartu (ketuk sesuai urutan)</p><div class="steps urut-pool">' +
        order.map(function (i) { return asButton(cmdHTML(it.cards[i]), 'data-c="' + i + '"'); }).join("") + "</div></div>" +
        '<div><p class="lat-sub">Programmu</p><div class="steps-box urut-ws"><div class="steps" data-ws>' + RV.stepHTML("mulai", []) + "</div></div>" +
        '<div class="btn-row"><button type="button" class="btn" data-undo>↶ Batalkan</button><button type="button" class="btn btn-primary" data-check>Periksa</button></div></div>' +
        '</div><div class="lat-slot"></div></div>');
    },
    multi: function (it, no) {
      const opts = RV.shuffle(it.o);
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="chip-row">' +
        opts.map(function (o) { return '<button type="button" class="chip-opt" aria-pressed="false" data-o="' + RV.esc(o) + '">' + RV.esc(o) + "</button>"; }).join("") +
        '</div><div class="btn-row"><button type="button" class="btn btn-primary" data-check>Periksa</button></div><div class="lat-slot"></div></div>');
    },
    salah: function (it, no) {
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="steps-box inline salah-box">' + RV.renderSteps(it.k) + '</div><div class="lat-slot"></div></div>');
    }
  };

  function renderMatch(g, startNo) {
    const opts = '<option value="">— pilih nama —</option>' + g.options.map(function (o) { return '<option value="' + o + '">' + o + "</option>"; }).join("");
    let rows = "";
    g.items.forEach(function (it, i) {
      rows += '<div class="match-row" data-no="' + (startNo + i) + '"><span class="lat-num">' + (startNo + i) + "</span>" +
        '<div class="item-card mini"><span class="emo">' + it.emo + '</span><div><div class="val">' + RV.esc(it.val) + '</div><div class="desc">' + it.desc + "</div></div></div>" +
        '<span class="match-arrow">→</span><select class="match-sel" aria-label="Nama variabel untuk soal ' + (startNo + i) + '">' + opts + '</select><span class="match-mark"></span></div>';
    });
    return '<div class="lat-q match-card" data-match="' + g.key + '"><div class="match-rows">' + rows + "</div>" +
      '<div class="btn-row"><button type="button" class="btn btn-primary" data-check>Periksa ' + g.items.length + " jawaban</button></div><div class=\"lat-slot\"></div></div>";
  }

  /* ---------------- PEMASANG PERILAKU ---------------- */
  function bind(el, it, no) {
    const slot = el.querySelector(".lat-slot");
    const say = function (ok, html) { slot.innerHTML = fbHTML(ok, html); mark(no, ok); el.classList.add(ok ? "is-ok" : "is-bad"); };

    if (it.type === "pg") {
      el.querySelectorAll(".q-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          if (no in state) return;
          const ok = !!b.dataset.ok;
          el.querySelectorAll(".q-opt").forEach(function (x) {
            x.disabled = true;
            if (x.dataset.ok) x.classList.add("is-correct"); else if (x === b) x.classList.add("is-wrong");
          });
          say(ok, it.e);
        });
      });
    }
    if (it.type === "bs") {
      el.querySelectorAll(".bs-btn").forEach(function (b) {
        b.addEventListener("click", function () {
          if (no in state) return;
          const ok = (b.dataset.v === "1") === it.a;
          el.querySelectorAll(".bs-btn").forEach(function (x) {
            x.disabled = true;
            if ((x.dataset.v === "1") === it.a) x.classList.add("is-correct"); else if (x === b) x.classList.add("is-wrong");
          });
          say(ok, it.e);
        });
      });
    }
    if (it.type === "isian" || it.type === "hitung") {
      const input = el.querySelector(".lat-input");
      const btn = el.querySelector("[data-check]");
      const check = function () {
        if (no in state) return;
        const v = input.value.trim();
        if (!v) { slot.innerHTML = '<div class="lat-fb info">Ketik jawabanmu dulu, ya.</div>'; input.focus(); return; }
        let ok;
        if (it.type === "hitung") ok = Number(v.replace(",", ".")) === it.a;
        else ok = it.accept.some(function (a) { return norm(a) === norm(v); });
        input.disabled = true; btn.disabled = true;
        input.classList.add(ok ? "is-correct" : "is-wrong");
        say(ok, (ok ? "" : "Jawaban yang benar: <b>" + (it.type === "hitung" ? it.a : it.show) + "</b>. ") + it.e);
      };
      btn.addEventListener("click", check);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
    }
    if (it.type === "urut") {
      const ws = el.querySelector("[data-ws]");
      const pool = el.querySelectorAll("[data-c]");
      const undo = el.querySelector("[data-undo]");
      const btn = el.querySelector("[data-check]");
      let chosen = [];
      const draw = function () {
        ws.innerHTML = RV.stepHTML("mulai", []) + chosen.map(function (i) { return cmdHTML(it.cards[i]); }).join("");
        pool.forEach(function (p) { p.disabled = (no in state) || chosen.indexOf(Number(p.dataset.c)) !== -1; });
        undo.disabled = (no in state) || !chosen.length;
      };
      pool.forEach(function (p) {
        p.addEventListener("click", function () { if (no in state) return; chosen.push(Number(p.dataset.c)); RV.beep("tick"); slot.innerHTML = ""; draw(); });
      });
      undo.addEventListener("click", function () { chosen.pop(); draw(); });
      btn.addEventListener("click", function () {
        if (no in state) return;
        if (chosen.length < it.cards.length) { slot.innerHTML = '<div class="lat-fb info">Pakai semua ' + it.cards.length + " kartu dulu, ya. Sekarang baru " + chosen.length + ".</div>"; return; }
        const ok = chosen.every(function (c, i) { return c === i; });
        btn.disabled = true;
        const right = '<div class="steps-box" style="margin-top:10px"><div class="steps">' + RV.stepHTML("mulai", []) + it.cards.map(function (c) { return cmdHTML(c); }).join("") + "</div></div>";
        say(ok, it.e + (ok ? "" : " Urutan yang benar:" + right));
        draw();
      });
      draw();
    }
    if (it.type === "multi") {
      const chips = el.querySelectorAll(".chip-opt");
      chips.forEach(function (c) {
        c.addEventListener("click", function () {
          if (no in state) return;
          const on = c.getAttribute("aria-pressed") !== "true";
          c.setAttribute("aria-pressed", on ? "true" : "false");
          RV.beep("tick");
        });
      });
      el.querySelector("[data-check]").addEventListener("click", function () {
        if (no in state) return;
        const picked = Array.from(chips).filter(function (c) { return c.getAttribute("aria-pressed") === "true"; }).map(function (c) { return c.dataset.o; });
        if (!picked.length) { slot.innerHTML = '<div class="lat-fb info">Ketuk minimal satu pilihan dulu, ya.</div>'; return; }
        const ok = picked.length === it.a.length && it.a.every(function (a) { return picked.indexOf(a) !== -1; });
        chips.forEach(function (c) {
          c.disabled = true;
          const should = it.a.indexOf(c.dataset.o) !== -1, sel = picked.indexOf(c.dataset.o) !== -1;
          if (should) c.classList.add(sel ? "is-correct" : "is-missed");
          else if (sel) c.classList.add("is-wrong");
        });
        el.querySelector("[data-check]").disabled = true;
        say(ok, it.e);
      });
    }
    if (it.type === "salah") {
      const cards = el.querySelectorAll(".step-cmd[data-id]");
      cards.forEach(function (c) {
        if (c.classList.contains("k-mulai")) return;
        c.classList.add("pickable");
        c.setAttribute("role", "button");
        c.setAttribute("tabindex", "0");
        const pick = function () {
          if (no in state) return;
          const ok = Number(c.dataset.id) === it.a;
          cards.forEach(function (x) {
            x.classList.remove("pickable"); x.removeAttribute("tabindex");
            if (Number(x.dataset.id) === it.a) x.classList.add("is-correct"); else if (x === c) x.classList.add("is-wrong");
          });
          say(ok, it.e);
        };
        c.addEventListener("click", pick);
        c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      });
    }
  }

  function bindMatch(el, g, startNo) {
    const slot = el.querySelector(".lat-slot");
    const sels = el.querySelectorAll(".match-sel");
    const btn = el.querySelector("[data-check]");
    btn.addEventListener("click", function () {
      if (startNo in state) return;
      const vals = Array.from(sels).map(function (s) { return s.value; });
      const empty = vals.filter(function (v) { return !v; }).length;
      if (empty) { slot.innerHTML = '<div class="lat-fb info">Masih ada ' + empty + " isi yang belum dipasangkan.</div>"; return; }
      let right = 0;
      g.items.forEach(function (it, i) {
        const ok = vals[i] === it.a;
        const row = sels[i].closest(".match-row");
        row.classList.add(ok ? "is-ok" : "is-bad");
        row.querySelector(".match-mark").innerHTML = ok ? "✅" : "❌ <small>" + it.a + "</small>";
        sels[i].disabled = true;
        if (ok) right++;
        state[startNo + i] = ok;
      });
      btn.disabled = true;
      RV.beep(right === g.items.length ? "ok" : "bad");
      slot.innerHTML = '<div class="lat-fb ' + (right === g.items.length ? "ok" : "bad") + '"><span class="pt-chip ' + (right ? "plus" : "zero") + '">+' + right + ' poin</span><b>' + right + " dari " + g.items.length + " pasangan benar.</b> " +
        (right === g.items.length ? "Hebat, semuanya tepat!" : "Lihat tanda ❌ untuk nama yang benar.") + "</div>";
      updateProgress();
    });
  }

  /* ---------------- GAMBAR SEMUA ---------------- */
  function build() {
    state = {};
    finished = false;
    lastScore = 0;
    resultBox.hidden = true;
    resultBox.innerHTML = "";
    let no = 1, html = "";
    const groupStart = {};
    GROUPS.forEach(function (g) {
      groupStart[g.key] = no;
      const from = no, to = no + g.items.length - 1;
      html += '<div class="lat-group" id="lat-' + g.key + '"><div class="lat-group-head"><span class="lat-badge">' + g.icon + " Bagian " + g.key + "</span>" +
        "<h3>" + g.title + ' <span class="muted">· soal ' + from + (to > from ? "–" + to : "") + "</span></h3><p>" + g.help + "</p></div>";
      if (g.match) { html += renderMatch(g, no); no += g.items.length; }
      else g.items.forEach(function (it) { html += R[it.type](it, no); no++; });
      html += "</div>";
    });
    body.innerHTML = html;
    GROUPS.forEach(function (g) {
      const start = groupStart[g.key];
      if (g.match) { bindMatch(body.querySelector('[data-match="' + g.key + '"]'), g, start); return; }
      g.items.forEach(function (it, i) { bind(body.querySelector('.lat-q[data-no="' + (start + i) + '"]'), it, start + i); });
    });
    updateProgress();
  }

  function showResult(early) {
    if (finished) return;
    finished = true;
    const answered = Object.keys(state).map(Number);
    const skipped = [];
    for (let n = 1; n <= TOTAL; n++) if (answered.indexOf(n) === -1) skipped.push(n);
    if (early) {
      // kunci soal yang belum dijawab; dihitung 0 poin
      body.querySelectorAll("button, input, select").forEach(function (el) { el.disabled = true; });
      body.querySelectorAll(".pickable").forEach(function (el) { el.classList.remove("pickable"); el.removeAttribute("tabindex"); });
      skipped.forEach(function (n) {
        const q = body.querySelector('.lat-q[data-no="' + n + '"], .match-row[data-no="' + n + '"]');
        if (q) q.classList.add("is-skip");
      });
    }
    const c = counts();
    const pass = c.score >= KKM;
    let no = 1;
    const rows = GROUPS.map(function (g) {
      let r = 0;
      g.items.forEach(function () { if (state[no]) r++; no++; });
      return '<div class="rapor-row"><span>' + g.icon + "</span><span>Bagian " + g.key + " · " + g.title + "</span><b>" + r + "/" + g.items.length + "</b>" +
        '<div class="bar"><span style="width:' + (r / g.items.length * 100) + '%"></span></div></div>';
    }).join("");
    const wrongNos = Object.keys(state).filter(function (k) { return !state[k]; }).map(Number).sort(function (a, b) { return a - b; });
    resultBox.innerHTML =
      '<div class="result-card">' +
        '<p class="mb-0">Skor latihanmu</p><div class="big">' + c.score + "</div>" +
        '<div class="score-calc"><span>Poin: <b>' + c.right + "</b> dari " + TOTAL + '</span><span>Skor = ' + c.right + " ÷ " + TOTAL + " × 100 = <b>" + c.score + "</b></span></div>" +
        '<span class="status-pill ' + (pass ? "pass" : "fail") + '">' + (pass ? "LULUS ✓" : "BELUM LULUS") + "</span>" +
        "<p>Skor minimal untuk lulus: <b>" + KKM + "</b></p>" +
        "<p>" + (c.score === 100 ? "Sempurna! Semua soal latihan benar." : pass ? "Hebat! Lihat lagi soal yang masih salah supaya makin paham." : "Baca lagi materinya, lalu ulangi latihan. Kamu pasti bisa!") + "</p>" +
        (wrongNos.length ? '<p class="mb-0">Soal yang salah: <b>' + wrongNos.join(", ") + "</b></p>" : "") +
        (skipped.length ? '<p class="mb-0">Soal yang belum dijawab (0 poin): <b>' + skipped.join(", ") + "</b></p>" : "") +
        '<div class="review"><h4>Poin per bagian</h4><div class="rapor-rows" style="margin:0">' + rows + "</div></div>" +
        '<div class="gs-actions"><button class="btn btn-primary" type="button" data-lat-reset>↺ Ulangi latihan</button><a class="btn" href="#coba">Lanjut ke game →</a></div>' +
      "</div>";
    resultBox.hidden = false;
    updateProgress();
    RV.beep(pass ? "win" : "ok");
    if (early) resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    resultBox.querySelector("[data-lat-reset]").addEventListener("click", function () {
      build();
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  finishBtn.addEventListener("click", function () {
    const c = counts();
    if (c.done < TOTAL && !window.confirm("Masih ada " + (TOTAL - c.done) + " soal yang belum dijawab. Soal itu akan mendapat 0 poin. Selesai sekarang?")) return;
    showResult(c.done < TOTAL);
  });

  root.querySelector("[data-lat-restart]").addEventListener("click", function () {
    if (Object.keys(state).length && !window.confirm("Hapus semua jawaban dan mulai latihan dari awal?")) return;
    build();
  });

  build();
})();
