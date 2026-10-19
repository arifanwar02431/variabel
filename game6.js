/* =========================================================
   Game Kelas 6 — "Detektif Flowchart"  (memakai game-engine.js)
   Variabel + flowchart. 5 misi, ± 30 menit, nilai minimal 85.
   ========================================================= */
(function () {
  "use strict";
  const root = document.querySelector("[data-game='k6']");
  if (!root || !window.RVGame) return;
  const RV = window.RV;

  /* Pembuat simbol flowchart */
  function S() { return { t: "start", x: "Mulai" }; }
  function E() { return { t: "end", x: "Selesai" }; }
  function P(x, o) { return Object.assign({ t: "proc", x: x }, o || {}); }
  function IO(x, o) { return Object.assign({ t: "io", x: x }, o || {}); }
  function D(x, o) { return Object.assign({ t: "dec", x: x }, o || {}); }

  const SHAPES = [
    { t: "start", name: "Terminal" },
    { t: "io", name: "Input / Output" },
    { t: "proc", name: "Proses" },
    { t: "dec", name: "Keputusan" }
  ];

  /* ---------- Misi 1: kenali simbol ---------- */
  const M1 = [
    { x: "Mulai", ans: "start", ex: "Mulai dan Selesai memakai simbol <b>terminal</b> (bentuk oval)." },
    { x: "Selesai", ans: "start", ex: "Setiap flowchart diakhiri simbol <b>terminal</b> “Selesai”." },
    { x: "Masukkan nilai ujian", ans: "io", ex: "Memasukkan data memakai simbol <b>input/output</b> (jajar genjang)." },
    { x: "Tampilkan total", ans: "io", ex: "Menampilkan hasil juga memakai simbol <b>input/output</b> (jajar genjang)." },
    { x: "Masukkan nama", ans: "io", ex: "Pengguna memasukkan data, jadi memakai simbol <b>input/output</b>." },
    { x: "total ← harga × jumlah", ans: "proc", ex: "Menghitung lalu menyimpan ke variabel memakai simbol <b>proses</b> (persegi panjang)." },
    { x: "skor ← 0", ans: "proc", ex: "Memberi nilai awal variabel adalah <b>proses</b>." },
    { x: "angka ← angka + 1", ans: "proc", ex: "Mengubah isi variabel adalah <b>proses</b>." },
    { x: "nilai ≥ 75?", ans: "dec", ex: "Pertanyaan yang jawabannya Ya/Tidak memakai simbol <b>keputusan</b> (belah ketupat)." },
    { x: "waktu = 0?", ans: "dec", ex: "Memeriksa isi variabel (Ya/Tidak) memakai simbol <b>keputusan</b>." }
  ];

  function roundSymbol(r, done, G) {
    G.show(G.head("Kotak ini sebaiknya memakai <b>simbol</b> apa?") +
      '<div style="text-align:center"><div class="stmt-card">' + RV.esc(r.x) + "</div></div>" +
      '<div class="shape-choices">' + SHAPES.map(function (s) {
        return '<button type="button" class="shape-opt" data-t="' + s.t + '">' + RV.flowShape(s.t, "", 110) + "<span>" + s.name + "</span></button>";
      }).join("") + '</div><div class="feedback-slot"></div>');
    G.screen.querySelectorAll(".shape-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        const ok = b.dataset.t === r.ans;
        G.screen.querySelectorAll(".shape-opt").forEach(function (x) {
          x.disabled = true;
          if (x.dataset.t === r.ans) x.classList.add("is-correct");
          else if (x === b) x.classList.add("is-wrong");
        });
        G.feedback(ok, r.ex, function () { done(ok ? 1 : 0); });
      });
    });
  }

  /* ---------- Misi 2: telusuri flowchart ---------- */
  const IFELSE = function () {
    return [S(), IO("Masukkan nilai"), D("nilai ≥ 75?", { side: { t: "io", x: 'Tampilkan\n"Lulus"', label: "Ya", join: 1 } }), IO('Tampilkan\n"Belajar lagi"'), E()];
  };
  const M2 = [
    { f: [S(), P("a ← 5"), P("b ← 3"), P("c ← a + b"), IO("Tampilkan c"), E()],
      q: "Telusuri flowchart ini. Apa yang ditampilkan?", opts: ["8", "53", "5", "3"], ans: "8",
      ex: "a berisi 5 dan b berisi 3, jadi c ← 5 + 3 = <b>8</b>." },
    { f: [S(), P("skor ← 10"), P("skor ← skor + 5"), IO("Tampilkan skor"), E()],
      q: "Berapa nilai skor yang ditampilkan?", opts: ["15", "10", "5", "105"], ans: "15",
      ex: "skor mula-mula 10, lalu ditambah 5 → <b>15</b>." },
    { f: [S(), P("x ← 4"), P("x ← x × 3"), P("x ← x − 2"), IO("Tampilkan x"), E()],
      q: "Berapa nilai x yang ditampilkan?", opts: ["10", "12", "2", "14"], ans: "10",
      ex: "4 → 4 × 3 = 12 → 12 − 2 = <b>10</b>." },
    { f: [S(), P("harga ← 2000"), P("jumlah ← 3"), P("total ← harga × jumlah"), IO("Tampilkan total"), E()],
      q: "Berapa total yang ditampilkan?", opts: ["6000", "2003", "5000", "2000"], ans: "6000",
      ex: "2000 × 3 = <b>6000</b>." },
    { f: IFELSE(), input: "nilai = 60",
      q: "Pengguna memasukkan nilai <b>60</b>. Apa yang ditampilkan?", opts: ["Belajar lagi", "Lulus", "60", "75"], ans: "Belajar lagi",
      ex: "60 ≥ 75 salah (<b>Tidak</b>), jadi jalur ke bawah dijalankan: <b>Belajar lagi</b>." },
    { f: IFELSE(), input: "nilai = 75",
      q: "Pengguna memasukkan nilai <b>75</b>. Apa yang ditampilkan?", opts: ["Lulus", "Belajar lagi", "75", "Tidak ada"], ans: "Lulus",
      ex: "Tanda ≥ artinya “lebih dari <b>atau sama dengan</b>”. 75 ≥ 75 benar (Ya), jadi tampil <b>Lulus</b>." },
    { f: [S(), P("angka ← 1"), IO("Tampilkan angka"), P("angka ← angka + 1"), D("angka > 3?", { back: { to: 2, label: "Tidak" } }), E()],
      q: "Apa saja yang ditampilkan, berurutan?", opts: ["1 2 3", "1 2 3 4", "1 2", "2 3 4"], ans: "1 2 3",
      ex: "Tampil 1, 2, 3. Setelah angka menjadi 4, “angka > 3?” bernilai Ya sehingga perulangan berhenti." },
    { f: [S(), P("total ← 0"), P("i ← 1"), P("total ← total + i"), P("i ← i + 1"), D("i > 4?", { back: { to: 3, label: "Tidak" } }), IO("Tampilkan total"), E()],
      q: "Berapa total yang ditampilkan?", opts: ["10", "4", "15", "6"], ans: "10",
      ex: "total ditambah i untuk i = 1, 2, 3, 4: 1 + 2 + 3 + 4 = <b>10</b>." }
  ];

  function roundTrace(r, done, G) {
    const opts = RV.shuffle(r.opts);
    G.show(G.head("Telusuri flowchart dari Mulai sampai Selesai. Catat isi variabel di setiap langkah.") +
      '<div class="trace-q"><div class="flow-box">' + RV.renderFlow({ nodes: r.f }) + "</div><div>" +
      (r.input ? '<div class="input-note">⌨️ Input: <b>' + RV.esc(r.input) + "</b></div>" : "") +
      '<p class="q-text">' + r.q + '</p><div class="q-opts">' + opts.map(function (o, j) {
        return '<button type="button" class="q-opt" data-o="' + RV.esc(o) + '"><span class="q-key">' + "ABCD"[j] + "</span><span>" + RV.esc(o) + "</span></button>";
      }).join("") + '</div></div></div><div class="feedback-slot"></div>');
    G.screen.querySelectorAll(".q-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        const ok = b.dataset.o === r.ans;
        G.screen.querySelectorAll(".q-opt").forEach(function (x) {
          x.disabled = true;
          if (x.dataset.o === r.ans) x.classList.add("is-correct");
          else if (x === b) x.classList.add("is-wrong");
        });
        G.feedback(ok, r.ex, function () { done(ok ? 1 : 0); });
      });
    });
  }

  /* ---------- Misi 3: lengkapi flowchart ---------- */
  const M3 = [
    { say: "Flowchart menghitung <b>luas persegi panjang</b>. Apa isi kotak yang hilang?",
      f: [S(), IO("Masukkan panjang\ndan lebar"), P("luas ←\npanjang × lebar", { blank: true }), IO("Tampilkan luas"), E()],
      opts: ["luas ← panjang × lebar", "luas ← panjang + lebar", "Tampilkan panjang"],
      ex: "Luas persegi panjang = panjang × lebar. Hasilnya disimpan di variabel <b>luas</b>." },
    { say: "Robi lupa memberi <b>nilai awal</b> pada skor. Apa isi kotak yang hilang?",
      f: [S(), P("skor ← 0", { blank: true }), P("skor ← skor + 10"), IO("Tampilkan skor"), E()],
      opts: ["skor ← 0", "skor ← skor + 10", "Tampilkan skor"],
      ex: "Variabel perlu diberi <b>nilai awal</b> sebelum ditambah. Ini disebut inisialisasi." },
    { say: "Wahana hanya boleh dinaiki anak berumur <b>10 tahun ke atas</b>. Apa isi kotak keputusan?",
      f: [S(), IO("Masukkan umur"), D("umur ≥ 10?", { blank: true, side: { t: "io", x: 'Tampilkan\n"Boleh naik"', label: "Ya", join: 1 } }), IO('Tampilkan\n"Belum boleh"'), E()],
      opts: ["umur ≥ 10?", "umur ← 10", "umur < 5?"],
      ex: "“10 tahun ke atas” berarti lebih dari atau sama dengan 10: <b>umur ≥ 10?</b>" },
    { say: "Flowchart <b>hitung mundur</b> dari 5 sampai 0. Apa isi kotak yang hilang?",
      f: [S(), P("waktu ← 5"), IO("Tampilkan waktu"), P("waktu ← waktu − 1", { blank: true }), D("waktu = 0?", { back: { to: 2, label: "Tidak" } }), E()],
      opts: ["waktu ← waktu − 1", "waktu ← waktu + 1", "waktu ← 5"],
      ex: "Hitung mundur berarti waktu <b>berkurang</b> 1. Kalau ditambah, waktu tidak pernah 0 dan perulangan tidak akan berhenti!" },
    { say: "Program ini menyapa pengguna dengan namanya. Apa isi kotak yang hilang?",
      f: [S(), IO("Masukkan nama"), IO('Tampilkan\n"Halo, " + nama', { blank: true }), E()],
      opts: ['Tampilkan "Halo, " + nama', "nama ← 0", 'nama = "Halo"?'],
      ex: "Hasil ditampilkan dengan simbol <b>output</b>, memakai isi variabel nama." },
    { say: "Rina menabung <b>2000</b> setiap hari selama 7 hari. Apa isi kotak yang hilang?",
      f: [S(), P("tabungan ← 0"), P("hari ← 1"), P("tabungan ←\ntabungan + 2000", { blank: true }), P("hari ← hari + 1"), D("hari > 7?", { back: { to: 3, label: "Tidak" } }), IO("Tampilkan tabungan"), E()],
      opts: ["tabungan ← tabungan + 2000", "tabungan ← 2000", "hari ← hari + 2000"],
      ex: "Setiap hari tabungan <b>bertambah</b> 2000 dari isi sebelumnya. Kalau “tabungan ← 2000”, isinya selalu 2000." }
  ];

  function roundFill(r, done, G) {
    const correct = r.opts[0];
    const opts = RV.shuffle(r.opts);
    const blankIdx = r.f.findIndex(function (n) { return n.blank; });
    G.show(G.head(r.say) +
      '<div class="trace-q"><div class="flow-box" data-fb>' + RV.renderFlow({ nodes: r.f }) + "</div><div>" +
      '<p class="q-text">Pilih isi kotak “?”:</p><div class="q-opts">' + opts.map(function (o, j) {
        return '<button type="button" class="q-opt" data-o="' + RV.esc(o) + '"><span class="q-key">' + "ABC"[j] + '</span><span style="font-family:\'JetBrains Mono\',monospace;font-weight:700">' + RV.esc(o) + "</span></button>";
      }).join("") + '</div></div></div><div class="feedback-slot"></div>');
    G.screen.querySelectorAll(".q-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        const ok = b.dataset.o === correct;
        G.screen.querySelectorAll(".q-opt").forEach(function (x) {
          x.disabled = true;
          if (x.dataset.o === correct) x.classList.add("is-correct");
          else if (x === b) x.classList.add("is-wrong");
        });
        const filled = r.f.map(function (n, i) { return i === blankIdx ? Object.assign({}, n, { blank: false }) : n; });
        const fb = G.screen.querySelector("[data-fb]");
        fb.innerHTML = RV.renderFlow({ nodes: filled });
        const g = fb.querySelector('.fn[data-n="' + blankIdx + '"]');
        if (g) g.classList.add("filled");
        G.feedback(ok, r.ex, function () { done(ok ? 1 : 0); });
      });
    });
  }

  /* ---------- Misi 4: kilat keputusan ---------- */
  const M4 = [
    { cond: "nilai ≥ 75?", v: "nilai", test: function (x) { return x >= 75; }, values: [80, 60, 75, 92, 74, 45, 100, 76], time: 30 },
    { cond: "suhu > 30?", v: "suhu", test: function (x) { return x > 30; }, values: [35, 30, 28, 31, 40, 22, 30, 33], time: 30 },
    { cond: "skor = 10?", v: "skor", test: function (x) { return x === 10; }, values: [10, 9, 11, 10, 1, 100, 10, 0], time: 30 }
  ];

  function roundQuick(r, done, G) {
    const vals = RV.shuffle(r.values);
    G.show(G.head("Nilai variabel <b>" + r.v + "</b> muncul satu per satu. Ketuk <b>YA</b> jika kondisinya benar, <b>TIDAK</b> jika salah. Cepat tapi teliti!") +
      '<div class="quick">' + RV.flowShape("dec", r.cond, 190) +
      '<div class="quick-meta"><span data-c>Soal 0/' + vals.length + "</span><span>·</span><span data-ok>Benar 0</span></div>" +
      '<div class="timebar"><span></span></div>' +
      '<div class="quick-val" data-val></div>' +
      '<div class="quick-start" data-sb><p class="mb-0">' + vals.length + " nilai akan muncul. Waktumu " + r.time + ' detik.</p><div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-start>▶ Mulai!</button></div></div>' +
      '<div class="yn" data-yn hidden><button class="btn btn-yes" type="button" data-a="1">YA</button><button class="btn btn-no" type="button" data-a="0">TIDAK</button></div>' +
      '</div><div class="feedback-slot"></div>');
    const scr = G.screen;
    const valEl = scr.querySelector("[data-val]");
    const cEl = scr.querySelector("[data-c]");
    const okEl = scr.querySelector("[data-ok]");
    const bar = scr.querySelector(".timebar span");
    const yn = scr.querySelector("[data-yn]");
    let i = 0, correct = 0, running = false, finished = false, timer = 0, left = r.time * 1000, mistakes = [];

    function showVal() {
      valEl.className = "quick-val";
      valEl.textContent = r.v + " = " + vals[i];
      cEl.textContent = "Soal " + (i + 1) + "/" + vals.length;
    }
    function answer(a) {
      if (!running) return;
      const truth = r.test(vals[i]);
      const ok = a === truth;
      if (ok) { correct++; G.beep("tick"); } else { mistakes.push(vals[i]); G.beep("bad"); }
      okEl.textContent = "Benar " + correct;
      valEl.classList.add(ok ? "flash-ok" : "flash-bad");
      i++;
      if (i >= vals.length) { end(); return; }
      running = false;
      setTimeout(function () { if (!finished) { running = true; showVal(); } }, 260);
    }
    function end() {
      if (finished) return;
      finished = true;
      running = false;
      clearInterval(timer);
      yn.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
      for (let k = i; k < vals.length; k++) mistakes.push(vals[k]);
      const pts = correct >= 7 ? 2 : correct >= 5 ? 1 : 0;
      valEl.className = "quick-val";
      valEl.textContent = correct + " dari " + vals.length + " benar";
      let ex = "Kamu menjawab benar <b>" + correct + "</b> dari " + vals.length + " → <b>" + pts + " poin</b>.";
      if (mistakes.length) {
        ex += " Perhatikan: " + mistakes.map(function (v) { return r.v + " = " + v + " → " + (r.test(v) ? "Ya" : "Tidak"); }).join("; ") + ".";
      }
      G.feedback(pts >= 1, ex, function () { done(pts); });
    }
    yn.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () { answer(b.dataset.a === "1"); });
    });
    scr.querySelector("[data-start]").addEventListener("click", function () {
      scr.querySelector("[data-sb]").hidden = true;
      yn.hidden = false;
      running = true;
      showVal();
      const t0 = Date.now();
      timer = setInterval(function () {
        const p = Math.max(0, 1 - (Date.now() - t0) / left);
        bar.style.width = (p * 100) + "%";
        bar.classList.toggle("low", p < 0.25);
        if (p <= 0) end();
      }, 100);
    });
  }

  /* ---------- Misi 5: susun flowchart ---------- */
  const M5 = [
    { say: "Susun flowchart untuk menghitung <b>keliling persegi</b>.",
      steps: [IO("Masukkan sisi"), P("keliling ← 4 × sisi"), IO("Tampilkan keliling")], extra: P("keliling ← sisi + 4") },
    { say: "Susun flowchart untuk menghitung <b>rata-rata dua nilai</b>.",
      steps: [IO("Masukkan nilai1, nilai2"), P("jumlah ← nilai1 + nilai2"), P("rata ← jumlah ÷ 2"), IO("Tampilkan rata")], extra: P("rata ← nilai1 ÷ 2") },
    { say: "Susun flowchart untuk menghitung <b>uang kembalian</b> di toko.",
      steps: [IO("Masukkan harga, bayar"), P("kembalian ← bayar − harga"), IO("Tampilkan kembalian")], extra: P("kembalian ← harga − bayar") },
    { say: "Pemain mulai dengan 3 nyawa, lalu terkena musuh sekali. Susun flowchart-nya.",
      steps: [P("nyawa ← 3"), P("nyawa ← nyawa − 1"), IO("Tampilkan nyawa")], extra: P("nyawa ← nyawa + 1") },
    { say: "Susun flowchart untuk mengubah <b>menit menjadi detik</b>.",
      steps: [IO("Masukkan menit"), P("detik ← menit × 60"), IO("Tampilkan detik")], extra: IO("Tampilkan menit") },
    { say: "Susun flowchart untuk menghitung <b>uang saku seminggu</b> (7 hari).",
      steps: [IO("Masukkan uang_harian"), P("total ← uang_harian × 7"), IO("Tampilkan total")], extra: P("total ← uang_harian + 7") }
  ];

  function roundOrder(r, done, G) {
    const cards = RV.shuffle(r.steps.concat([r.extra]));
    const need = r.steps.length;
    let chosen = [], attempts = 0;
    G.show(G.head(r.say + " Ketuk kartu sesuai urutan. Hati-hati, ada <b>1 kartu pengecoh</b>!") +
      '<div class="order-wrap"><div><h4>Kartu langkah</h4><div class="cards">' + cards.map(function (c, i) {
        return '<button type="button" class="step-card" data-c="' + i + '"><span class="ico">' + RV.flowShape(c.t, "", 60) + "</span><span>" + RV.esc(c.x) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="btn-row" style="margin-top:14px"><button class="btn" type="button" data-undo>↶ Batalkan</button><button class="btn btn-primary" type="button" data-check>✔ Periksa</button></div>' +
      '<p class="limit">Pilih <b>' + need + "</b> kartu · Kesempatan: <b data-left>3</b></p></div>" +
      '<div><h4>Flowchart-mu</h4><div class="flow-box" data-fb></div></div></div><div class="feedback-slot"></div>');
    const scr = G.screen;
    const fb = scr.querySelector("[data-fb]");
    const btns = scr.querySelectorAll(".step-card");
    const undo = scr.querySelector("[data-undo]");
    const check = scr.querySelector("[data-check]");
    const leftEl = scr.querySelector("[data-left]");
    function draw() {
      fb.innerHTML = RV.renderFlow({ nodes: [S()].concat(chosen.map(function (i) { return cards[i]; })).concat(chosen.length === need ? [E()] : []) });
      btns.forEach(function (b) { b.disabled = chosen.indexOf(Number(b.dataset.c)) !== -1 || chosen.length >= need; });
      undo.disabled = !chosen.length;
    }
    function lock() { btns.forEach(function (b) { b.disabled = true; }); undo.disabled = true; check.disabled = true; }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        if (chosen.length >= need) return;
        chosen.push(Number(b.dataset.c));
        G.beep("tick"); G.info("");
        draw();
      });
    });
    undo.addEventListener("click", function () { chosen.pop(); draw(); });
    check.addEventListener("click", function () {
      if (chosen.length < need) { G.info("Pilih " + need + " kartu dulu, ya. Sekarang baru " + chosen.length + "."); return; }
      attempts++;
      const ok = chosen.every(function (ci, k) { return cards[ci].x === r.steps[k].x; });
      const leftTries = 3 - attempts;
      leftEl.textContent = Math.max(0, leftTries);
      if (ok) {
        lock();
        const pts = attempts === 1 ? 1 : 0.5;
        G.feedback(true, "Urutannya tepat. " + (pts === 1 ? "Langsung berhasil, <b>1 poin</b>!" : "Berhasil, <b>½ poin</b>."), function () { done(pts); });
        return;
      }
      const usedExtra = chosen.some(function (ci) { return cards[ci].x === r.extra.x; });
      const why = usedExtra ? "Ada kartu pengecoh di flowchart-mu (“" + RV.esc(r.extra.x) + "”)." : "Urutannya belum tepat. Ingat: masukkan data dulu, lalu proses, baru tampilkan hasil.";
      if (leftTries > 0) {
        G.beep("bad"); G.resetCombo();
        scr.querySelector(".feedback-slot").innerHTML = '<div class="feedback-bar bad"><div class="fb-text">❌ ' + why + " Kesempatan tersisa: <b>" + leftTries + "</b>.</div></div>";
      } else {
        lock();
        G.feedback(false, why + ' Contoh jawaban:<div class="flow-box" style="margin-top:10px">' + RV.renderFlow({ nodes: [S()].concat(r.steps).concat([E()]) }) + "</div>", function () { done(0); });
      }
    });
    draw();
  }

  window.RVGame.create({
    root: root,
    saveKey: "rv-k6-detektif-flowchart-v1",
    title: "Detektif Flowchart",
    kicker: "Game Variabel & Flowchart · Kelas 6",
    story: "Robi menemukan banyak flowchart misterius! Bantu Robi mengenali simbol, menelusuri isi variabel, dan menyusun flowchart sendiri dalam 5 misi.",
    color: "#4053CC",
    kkm: 85,
    missions: [
      { title: "Kenali Simbol", icon: "🔷", max: 6, play: roundSymbol,
        rounds: function () { return RV.shuffle(M1).slice(0, 6); },
        desc: "Setiap langkah dalam flowchart punya simbol sendiri. Pilih simbol yang tepat untuk setiap langkah.",
        how: ["Terminal (oval) untuk Mulai/Selesai, Input/Output (jajar genjang) untuk memasukkan dan menampilkan data.", "Proses (persegi panjang) untuk menghitung, Keputusan (belah ketupat) untuk pertanyaan Ya/Tidak."] },
      { title: "Telusuri Flowchart", icon: "🔍", max: 8, play: roundTrace,
        rounds: function () { return M2.slice(); },
        desc: "Ikuti panah dari Mulai sampai Selesai. Catat perubahan isi variabel, lalu tebak hasilnya.",
        how: ["“skor ← 0” artinya variabel skor diisi 0.", "Di simbol keputusan, ikuti panah Ya atau Tidak sesuai isi variabel."] },
      { title: "Lengkapi Flowchart", icon: "🧩", max: 6, play: roundFill,
        rounds: function () { return M3.slice(); },
        desc: "Ada kotak yang hilang di setiap flowchart. Pilih isi yang tepat supaya flowchart-nya benar.",
        how: ["Baca tujuan flowchart terlebih dahulu.", "Perhatikan bentuk simbol kotak yang hilang."] },
      { title: "Kilat Keputusan", icon: "⚡", max: 6, play: roundQuick, label: "Ronde ",
        rounds: function () { return M4.slice(); },
        desc: "Isi variabel muncul cepat sekali! Tentukan jalur Ya atau Tidak di simbol keputusan sebelum waktu habis.",
        how: ["≥ artinya lebih dari atau sama dengan. > artinya lebih dari saja.", "Benar 7–8 = 2 poin, benar 5–6 = 1 poin per ronde."] },
      { title: "Susun Flowchart", icon: "🏗️", max: 6, play: roundOrder,
        rounds: function () { return M5.slice(); },
        desc: "Sekarang kamu yang membuat flowchart! Susun kartu langkah dengan urutan yang benar.",
        how: ["Ketuk kartu satu per satu sesuai urutan.", "Ada satu kartu pengecoh yang tidak boleh dipakai."] }
    ]
  });
})();
