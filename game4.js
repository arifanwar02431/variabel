/* =========================================================
   Game Kelas 4 — "Misi Kotak Ajaib"  (memakai game-engine.js)
   ========================================================= */
(function () {
  "use strict";
  const root = document.querySelector("[data-game='k4']");
  if (!root || !window.RVGame) return;
  const RV = window.RV;

  /* ---------- Data ---------- */
  const M1 = [
    { emo: "👦", val: "Budi", desc: "nama pemain game", ok: "nama_pemain", no: ["umur", "skor"] },
    { emo: "🎂", val: "10", desc: "umur Budi", ok: "umur", no: ["nama_pemain", "warna_favorit"] },
    { emo: "🎨", val: "merah", desc: "warna kesukaan Sinta", ok: "warna_favorit", no: ["suhu", "nyawa"] },
    { emo: "🌡️", val: "31", desc: "suhu udara hari ini", ok: "suhu", no: ["skor", "kelas"] },
    { emo: "❤️", val: "3", desc: "sisa nyawa di game", ok: "nyawa", no: ["umur", "tabungan"] },
    { emo: "🐷", val: "15000", desc: "uang di celengan", ok: "tabungan", no: ["suhu", "nama_hewan"] },
    { emo: "🐹", val: "Mimi", desc: "nama hamster peliharaan", ok: "nama_hewan", no: ["warna_favorit", "skor"] },
    { emo: "⭐", val: "120", desc: "poin yang dikumpulkan di game", ok: "skor", no: ["nyawa", "hari"] },
    { emo: "📅", val: "Senin", desc: "nama hari ini", ok: "hari", no: ["nama_pemain", "kelas"] },
    { emo: "🏫", val: "4", desc: "kelas Budi sekarang", ok: "kelas", no: ["suhu", "tabungan"] }
  ];

  const HAT = "event: ketika 🏁 diklik\n";
  const M2 = [
    { v: "skor", s: HAT + "var: atur [skor] ke (5)", ans: 5, opts: [5, 0, 6, 1], ex: "Blok “atur” langsung mengisi skor dengan <b>5</b>." },
    { v: "skor", s: HAT + "var: atur [skor] ke (0)\nvar: ubah [skor] sebesar (3)", ans: 3, opts: [3, 0, 30, 4], ex: "Mulai dari 0, lalu ditambah 3: 0 → <b>3</b>." },
    { v: "skor", s: HAT + "var: atur [skor] ke (2)\nvar: ubah [skor] sebesar (4)\nvar: ubah [skor] sebesar (1)", ans: 7, opts: [7, 6, 5, 8], ex: "2 → 6 → <b>7</b>. Setiap blok “ubah” menambah isi yang lama." },
    { v: "nyawa", s: HAT + "var: atur [nyawa] ke (5)\nvar: ubah [nyawa] sebesar (-1)", ans: 4, opts: [4, 6, 5, 1], ex: "5 → <b>4</b>. Angka negatif (−1) berarti isinya berkurang." },
    { v: "koin", s: HAT + "var: atur [koin] ke (10)\nvar: ubah [koin] sebesar (-3)\nvar: ubah [koin] sebesar (5)", ans: 12, opts: [12, 18, 8, 7], ex: "10 → 7 → <b>12</b>." },
    { v: "skor", s: HAT + "var: atur [skor] ke (8)\nvar: atur [skor] ke (1)", ans: 1, opts: [1, 9, 8, 7], ex: "Blok “atur” <b>mengganti</b> isi lama. Isi 8 dibuang, diganti menjadi <b>1</b>." },
    { v: "skor", s: HAT + "var: atur [skor] ke (0)\nctrl: ulangi (3) kali\n  var: ubah [skor] sebesar (2)", ans: 6, opts: [6, 2, 5, 3], ex: "Blok di dalam “ulangi 3 kali” dijalankan 3 kali: 0 → 2 → 4 → <b>6</b>." },
    { v: "bintang", s: HAT + "var: atur [bintang] ke (1)\nctrl: ulangi (4) kali\n  var: ubah [bintang] sebesar (5)\nvar: ubah [bintang] sebesar (-2)", ans: 19, opts: [19, 21, 18, 20], ex: "1 → 6 → 11 → 16 → 21 (4 kali ditambah 5), lalu dikurangi 2 → <b>19</b>." }
  ];

  const M3 = [
    { q: "Robi ingin menyimpan <b>jumlah koin</b> yang dikumpulkan. Nama variabel mana yang paling jelas?", o: ["jumlah_koin", "x", "abc"], ex: "<code>jumlah_koin</code> langsung menjelaskan isinya. Nama <code>x</code> dan <code>abc</code> sulit ditebak." },
    { q: "Mana nama variabel yang <b>tidak boleh</b> dipakai di bahasa pemrograman tulisan?", o: ["nama pemain", "nama_pemain", "pemain1"], ex: "<code>nama pemain</code> memakai spasi. Ganti spasi dengan garis bawah: <code>nama_pemain</code>." },
    { q: "Mana nama variabel yang <b>salah</b>?", o: ["2skor", "skor2", "skor_akhir"], ex: "Nama variabel tidak boleh diawali angka. <code>skor2</code> boleh karena angkanya di belakang." },
    { q: "Untuk menyimpan <b>nama hewan peliharaan</b>, nama variabel terbaik adalah …", o: ["nama_hewan", "nh", "h1"], ex: "<code>nama_hewan</code> mudah dipahami siapa saja yang membaca programnya." },
    { q: "Robi mau menyimpan <b>suhu hari ini</b>. Nama variabel terbaik adalah …", o: ["suhu", "s", "angka"], ex: "<code>suhu</code> paling jelas. <code>angka</code> terlalu umum, bisa angka apa saja." },
    { q: "Mana nama variabel yang <b>benar dan jelas</b>?", o: ["nilai_ujian", "nilai ujian", "1nilai"], ex: "<code>nilai_ujian</code> tidak memakai spasi dan tidak diawali angka." },
    { q: "Untuk menyimpan <b>sisa waktu</b> permainan, nama terbaik adalah …", o: ["sisa_waktu", "w", "waktu sisa"], ex: "<code>sisa_waktu</code> jelas dan tidak memakai spasi." }
  ];

  const M4 = [
    { target: 10, time: 45, fall: 5.2, every: 750 },
    { target: 15, time: 45, fall: 4.6, every: 700 },
    { target: 20, time: 50, fall: 4.1, every: 650 }
  ];

  const M5 = [
    { v: "skor", target: 7, max: 3, palette: [["atur", 0], ["ubah", 5], ["ubah", 2], ["ubah", 1]], sol: [["atur", 0], ["ubah", 5], ["ubah", 2]],
      say: "Mulai skor dari 0, lalu tambahkan sampai menjadi <b>7</b>. Ingat, blok pertama harus “atur”!" },
    { v: "nyawa", target: 3, max: 3, palette: [["atur", 5], ["ubah", -1], ["ubah", 1]], sol: [["atur", 5], ["ubah", -1], ["ubah", -1]],
      say: "Pemain mulai dengan 5 nyawa, lalu terkena batu dua kali. Buat nyawa menjadi <b>3</b>." },
    { v: "koin", target: 10, max: 3, palette: [["atur", 0], ["atur", 4], ["ubah", 3], ["ubah", 2]], sol: [["atur", 4], ["ubah", 3], ["ubah", 3]],
      say: "Buat koin berisi <b>10</b> hanya dengan 3 blok. Pilih blok “atur” yang tepat!" },
    { v: "skor", target: 12, max: 4, palette: [["atur", 0], ["ubah", 5], ["ubah", 2], ["ubah", -1]], sol: [["atur", 0], ["ubah", 5], ["ubah", 5], ["ubah", 2]],
      say: "Buat skor menjadi <b>12</b>. Kamu boleh memakai blok yang sama lebih dari sekali." },
    { v: "waktu", target: 0, max: 3, palette: [["atur", 10], ["ubah", -5], ["ubah", -2], ["ubah", 1]], sol: [["atur", 10], ["ubah", -5], ["ubah", -5]],
      say: "Hitung mundur! Waktu mulai dari 10. Buat waktu menjadi <b>0</b>." },
    { v: "bintang", target: 9, max: 3, palette: [["atur", 0], ["atur", 1], ["ubah", 4], ["ubah", 3]], sol: [["atur", 1], ["ubah", 4], ["ubah", 4]],
      say: "Tantangan terakhir: buat bintang berisi <b>9</b> dengan paling banyak 3 blok." }
  ];

  function blockText(kind, v, n) {
    return RV.inline(kind === "atur" ? "atur [" + v + "] ke (" + n + ")" : "ubah [" + v + "] sebesar (" + n + ")");
  }
  function bump(el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }

  /* ---------- Misi 1: kotak berlabel ---------- */
  function roundLabel(item, done, G) {
    const opts = RV.shuffle([item.ok].concat(item.no));
    G.show(G.head("Robi menemukan barang ini. Masuk ke kotak variabel yang mana?") +
      '<div style="text-align:center"><div class="item-card"><span class="emo">' + item.emo + '</span><div><div class="val">' + RV.esc(item.val) + '</div><div class="desc">' + item.desc + "</div></div></div></div>" +
      '<div class="box-choices">' + opts.map(function (o) {
        return '<button type="button" class="box-choice" data-v="' + o + '"><div class="vbox"><span class="vbox-label">' + o + '</span><span class="vbox-value">?</span></div></button>';
      }).join("") + '</div><div class="feedback-slot"></div>');
    G.screen.querySelectorAll(".box-choice").forEach(function (b) {
      b.addEventListener("click", function () {
        const ok = b.dataset.v === item.ok;
        G.screen.querySelectorAll(".box-choice").forEach(function (x) {
          x.disabled = true;
          if (x.dataset.v === item.ok) {
            x.classList.add("is-correct");
            x.querySelector(".vbox-value").textContent = item.val;
            bump(x.querySelector(".vbox"));
          } else if (x === b) x.classList.add("is-wrong");
        });
        G.feedback(ok, item.val + " adalah " + item.desc + ", jadi disimpan di variabel <code>" + item.ok + "</code>.", function () { done(ok ? 1 : 0); });
      });
    });
  }

  /* ---------- Misi 2: hitung isi kotak ---------- */
  function roundCount(r, done, G) {
    const opts = RV.shuffle(r.opts);
    G.show(G.head("Baca blok kodenya dari atas ke bawah. Setelah semua dijalankan, berapa isi variabel <b>" + r.v + "</b>?") +
      '<div class="split" style="align-items:center;margin-bottom:20px"><div class="script-box block">' + RV.renderScript(r.s) + "</div>" +
      '<div style="display:flex;justify-content:center;padding-top:16px"><div class="vbox" data-vb><span class="vbox-label">' + r.v + '</span><span class="vbox-value">?</span></div></div></div>' +
      '<div class="num-choices">' + opts.map(function (n) { return '<button type="button" class="q-opt" data-n="' + n + '">' + n + "</button>"; }).join("") + "</div>" +
      '<div class="feedback-slot"></div>');
    G.screen.querySelectorAll(".num-choices .q-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        const ok = Number(b.dataset.n) === r.ans;
        G.screen.querySelectorAll(".num-choices .q-opt").forEach(function (x) {
          x.disabled = true;
          if (Number(x.dataset.n) === r.ans) x.classList.add("is-correct");
          else if (x === b) x.classList.add("is-wrong");
        });
        const vb = G.screen.querySelector("[data-vb]");
        vb.querySelector(".vbox-value").textContent = r.ans;
        bump(vb);
        G.feedback(ok, r.ex, function () { done(ok ? 1 : 0); });
      });
    });
  }

  /* ---------- Misi 3: nama yang tepat ---------- */
  function roundName(r, done, G) {
    const correct = r.o[0];
    const opts = RV.shuffle(r.o);
    G.show(G.head(r.q) +
      '<div class="q-opts name-choices">' + opts.map(function (o, j) {
        return '<button type="button" class="q-opt" data-o="' + RV.esc(o) + '"><span class="q-key">' + "ABC"[j] + "</span><span>" + RV.esc(o) + "</span></button>";
      }).join("") + '</div><div class="feedback-slot"></div>');
    G.screen.querySelectorAll(".name-choices .q-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        const ok = b.dataset.o === correct;
        G.screen.querySelectorAll(".name-choices .q-opt").forEach(function (x) {
          x.disabled = true;
          if (x.dataset.o === correct) x.classList.add("is-correct");
          else if (x === b) x.classList.add("is-wrong");
        });
        G.feedback(ok, r.ex, function () { done(ok ? 1 : 0); });
      });
    });
  }

  /* ---------- Misi 4: tangkap bintang ---------- */
  const ITEMS = { 1: "⭐", 2: "🌟", 5: "💎", "-1": "🪨", "-2": "☁️" };
  function roundCatch(r, done, G) {
    G.show(G.head("Ketuk benda yang jatuh! Buat variabel <b>skor</b> tepat <b>" + r.target + "</b> sebelum waktu habis. Kelebihan? Ketuk 🪨 atau ☁️ untuk mengurangi.") +
      '<div class="catch-top"><div class="vbox" data-cv><span class="vbox-label">skor</span><span class="vbox-value">0</span></div>' +
      '<div class="target-chip">🎯 Target: skor = <b>' + r.target + "</b></div></div>" +
      '<div class="timebar"><span></span></div>' +
      '<div class="arena"><div class="arena-msg"><div><p style="font-size:1.05rem;margin-bottom:6px">⭐ +1 &nbsp; 🌟 +2 &nbsp; 💎 +5</p><p style="font-size:1.05rem">🪨 −1 &nbsp; ☁️ −2</p>' +
      '<p class="mb-0" style="opacity:.8;font-size:.9rem">Waktu: ' + r.time + ' detik</p><div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-start>▶ Mulai!</button></div></div></div></div>' +
      '<div class="last-block"><span>Blok yang dijalankan:</span><span class="blk var" data-lb>' + blockText("atur", "skor", 0) + "</span></div>" +
      '<div class="feedback-slot"></div>');
    const screen = G.screen;
    const arena = screen.querySelector(".arena");
    const msg = arena.querySelector(".arena-msg");
    const cv = screen.querySelector("[data-cv]");
    const bar = screen.querySelector(".timebar span");
    const lb = screen.querySelector("[data-lb]");
    let skor = 0, items = [], running = false, raf = 0, last = 0, spawnIn = 0, left = r.time * 1000;

    function pick() {
      const diff = r.target - skor, roll = Math.random();
      if (diff > 0) {
        if (roll < 0.18) return Math.random() < 0.5 ? -1 : -2;
        if (diff >= 5 && roll < 0.38) return 5;
        return Math.random() < 0.55 ? 1 : 2;
      }
      if (roll < 0.68) return Math.random() < 0.5 ? -1 : -2;
      return Math.random() < 0.6 ? 1 : 2;
    }
    function spawn() {
      const v = pick();
      const el = document.createElement("button");
      el.type = "button";
      el.className = "fall " + (v > 0 ? "pos" : "neg");
      el.innerHTML = '<span class="e">' + ITEMS[v] + "</span>" + (v > 0 ? "+" : "−") + Math.abs(v);
      el.setAttribute("aria-label", (v > 0 ? "tambah " : "kurang ") + Math.abs(v));
      const it = { el: el, x: Math.random() * Math.max(0, arena.clientWidth - 74) + 2, y: -72, v: v, speed: arena.clientHeight / r.fall * (0.85 + Math.random() * 0.3) };
      el.style.transform = "translate3d(" + it.x + "px," + it.y + "px,0)";
      const h = function (e) { e.preventDefault(); hit(it); };
      el.addEventListener("pointerdown", h);
      el.addEventListener("click", h);
      arena.appendChild(el);
      items.push(it);
    }
    function hit(it) {
      if (!running || it.hit) return;
      it.hit = true;
      skor += it.v;
      cv.querySelector(".vbox-value").textContent = skor;
      bump(cv);
      lb.innerHTML = blockText("ubah", "skor", it.v);
      const f = document.createElement("span");
      f.className = "float-txt";
      f.textContent = (it.v > 0 ? "+" : "−") + Math.abs(it.v);
      f.style.left = (it.x + 20) + "px"; f.style.top = it.y + "px";
      arena.appendChild(f);
      setTimeout(function () { f.remove(); }, 800);
      it.el.classList.add("pop");
      setTimeout(function () { it.el.remove(); }, 300);
      items = items.filter(function (x) { return x !== it; });
      G.beep(it.v > 0 ? "tick" : "bad");
      if (skor === r.target) end(true);
    }
    function frame(ts) {
      if (!running) return;
      const dt = last ? Math.min(50, ts - last) : 16;
      last = ts; left -= dt; spawnIn -= dt;
      if (spawnIn <= 0) { spawn(); spawnIn = r.every * (0.8 + Math.random() * 0.4); }
      const h = arena.clientHeight;
      items = items.filter(function (it) {
        it.y += it.speed * dt / 1000;
        if (it.y > h) { it.el.remove(); return false; }
        it.el.style.transform = "translate3d(" + it.x + "px," + it.y + "px,0)";
        return true;
      });
      const p = Math.max(0, left / (r.time * 1000));
      bar.style.width = (p * 100) + "%";
      bar.classList.toggle("low", p < 0.25);
      if (left <= 0) end(false); else raf = requestAnimationFrame(frame);
    }
    function end(win) {
      running = false;
      cancelAnimationFrame(raf);
      items.forEach(function (it) { it.el.remove(); });
      items = [];
      const near = Math.abs(skor - r.target) <= 3;
      const pts = win ? 2 : near ? 1 : 0;
      msg.hidden = false;
      msg.innerHTML = '<div><div style="font-size:3rem">' + (win ? "🎉" : near ? "👍" : "⏰") + '</div><p style="font-size:1.2rem">' +
        (win ? "Tepat " + r.target + "!" : "Waktu habis! Skormu " + skor + ".") + "</p></div>";
      G.feedback(win || near,
        win ? "Skor tepat " + r.target + ". Kamu dapat <b>2 poin</b>."
            : near ? "Skormu " + skor + ", hampir sampai " + r.target + ". Kamu dapat <b>1 poin</b>."
                   : "Skormu " + skor + ", targetnya " + r.target + ". Perhatikan: tambah kalau kurang, kurangi kalau lebih.",
        function () { done(pts); });
      if (win) G.beep("win");
    }
    screen.querySelector("[data-start]").addEventListener("click", function () {
      msg.hidden = true; running = true; last = 0; spawnIn = 200;
      raf = requestAnimationFrame(frame);
    });
  }

  /* ---------- Misi 5: susun program ---------- */
  function roundBuild(r, done, G) {
    let prog = [], attempts = 0, busy = false;
    const label = function (b) { return blockText(b[0], r.v, b[1]); };
    G.show(G.head(r.say) +
      '<div class="goal-card">🎯 Target: variabel <span class="blk var" style="min-height:0;padding:2px 10px">' + RV.esc(r.v) + "</span> berisi <b>" + r.target + "</b></div>" +
      '<div class="build"><div><h4>Pilih blok (ketuk untuk menambah)</h4><div class="palette">' +
      r.palette.map(function (b, i) { return '<button type="button" class="blk var btn-blk" data-p="' + i + '">' + label(b) + "</button>"; }).join("") +
      '</div><p class="limit">Paling banyak <b>' + r.max + "</b> blok di bawah 🏁.</p></div>" +
      '<div><h4>Programmu</h4><div class="workspace"><div class="script" data-ws></div></div>' +
      '<div class="btn-row" style="margin-top:12px"><button class="btn" type="button" data-undo>↶ Hapus terakhir</button>' +
      '<button class="btn btn-primary" type="button" data-run>▶ Jalankan</button></div>' +
      '<div class="build-side"><div class="vbox" data-bv><span class="vbox-label">' + RV.esc(r.v) + '</span><span class="vbox-value">?</span></div>' +
      '<span class="muted" style="font-size:.9rem">Kesempatan: <b data-left>3</b></span></div></div></div>' +
      '<div class="feedback-slot"></div>');
    const screen = G.screen;
    const ws = screen.querySelector("[data-ws]");
    const bv = screen.querySelector("[data-bv]");
    const leftEl = screen.querySelector("[data-left]");
    const palBtns = screen.querySelectorAll("[data-p]");
    const undoBtn = screen.querySelector("[data-undo]");
    const runBtn = screen.querySelector("[data-run]");

    function draw(activeIdx) {
      ws.innerHTML = '<div class="blk event">ketika 🏁 diklik</div>' + prog.map(function (b, i) {
        return '<div class="blk var' + (i === activeIdx ? " active" : "") + '">' + label(b) + "</div>";
      }).join("");
      palBtns.forEach(function (p) { p.disabled = busy || prog.length >= r.max; });
      undoBtn.disabled = busy || !prog.length;
      runBtn.disabled = busy;
    }
    function setVal(v) { bv.querySelector(".vbox-value").textContent = v === null ? "?" : v; bump(bv); }
    function lock() { palBtns.forEach(function (p) { p.disabled = true; }); undoBtn.disabled = true; runBtn.disabled = true; }
    palBtns.forEach(function (p) {
      p.addEventListener("click", function () {
        if (busy || prog.length >= r.max) return;
        prog.push(r.palette[Number(p.dataset.p)]);
        G.beep("tick");
        draw();
      });
    });
    undoBtn.addEventListener("click", function () { prog.pop(); draw(); });
    runBtn.addEventListener("click", function () {
      if (busy) return;
      if (!prog.length) { G.info("Ketuk blok untuk menambahkannya ke programmu dulu, ya."); return; }
      G.info("");
      busy = true; draw();
      let val = null, i = 0;
      setVal(null);
      (function stepRun() {
        if (i < prog.length) {
          const b = prog[i];
          val = b[0] === "atur" ? b[1] : (val === null ? null : val + b[1]);
          draw(i); setVal(val); G.beep("tick");
          i++;
          setTimeout(stepRun, 650);
          return;
        }
        busy = false; attempts++; draw();
        const startsOk = prog[0][0] === "atur";
        const ok = startsOk && val === r.target;
        const leftTries = 3 - attempts;
        leftEl.textContent = Math.max(0, leftTries);
        if (ok) {
          const pts = attempts === 1 ? 1 : 0.5;
          lock();
          G.feedback(true, "Isi " + r.v + " sekarang " + r.target + ". " + (pts === 1 ? "Langsung berhasil, <b>1 poin</b>!" : "Berhasil, <b>½ poin</b>."), function () { done(pts); });
          return;
        }
        const why = !startsOk
          ? "Programmu belum dimulai dengan blok “atur”, jadi isi awal " + r.v + " tidak diketahui (?)."
          : "Hasilnya " + val + ", padahal targetnya " + r.target + ".";
        if (leftTries > 0) {
          G.beep("bad"); G.resetCombo();
          G.screen.querySelector(".feedback-slot").innerHTML = '<div class="feedback-bar bad"><div class="fb-text">❌ ' + why + " Ubah programmu, lalu jalankan lagi. Kesempatan tersisa: <b>" + leftTries + "</b>.</div></div>";
        } else {
          lock();
          const sol = "event: ketika 🏁 diklik\n" + r.sol.map(function (b) {
            return "var: " + (b[0] === "atur" ? "atur [" + r.v + "] ke (" + b[1] + ")" : "ubah [" + r.v + "] sebesar (" + b[1] + ")");
          }).join("\n");
          G.feedback(false, why + ' Contoh jawaban yang benar:<div class="script-box" style="margin-top:10px">' + RV.renderScript(sol) + "</div>", function () { done(0); });
        }
      })();
    });
    draw();
  }

  window.RVGame.create({
    root: root,
    saveKey: "rv-k4-misi-kotak-v2",
    title: "Misi Kotak Ajaib",
    kicker: "Game Variabel · Kelas 4",
    story: "Robi si robot punya banyak kotak, tapi semuanya berantakan! Bantu Robi menyelesaikan 5 misi tentang variabel. Kumpulkan poin sebanyak-banyaknya.",
    color: "#E2622A",
    kkm: 85,
    missions: [
      { title: "Kotak Berlabel", icon: "📦", max: 6, play: roundLabel,
        rounds: function () { return RV.shuffle(M1).slice(0, 6); },
        desc: "Robi menemukan banyak barang. Bantu Robi memasukkan setiap barang ke kotak variabel yang labelnya cocok.",
        how: ["Lihat barang dan keterangannya.", "Ketuk kotak yang namanya paling cocok."] },
      { title: "Hitung Isi Kotak", icon: "🧮", max: 8, play: roundCount,
        rounds: function () { return M2.slice(); },
        desc: "Robi menjalankan blok kode. Tebak isi variabel setelah semua blok selesai dijalankan.",
        how: ["“atur … ke …” = mengganti isi kotak.", "“ubah … sebesar …” = menambah (atau mengurangi kalau negatif)."] },
      { title: "Nama yang Tepat", icon: "🏷️", max: 6, play: roundName,
        rounds: function () { return RV.shuffle(M3).slice(0, 6); },
        desc: "Kotak-kotak Robi butuh nama. Pilih nama variabel yang paling jelas dan benar.",
        how: ["Nama yang baik menjelaskan isinya.", "Tidak memakai spasi dan tidak diawali angka."] },
      { title: "Tangkap Bintang", icon: "🌟", max: 6, play: roundCatch, label: "Ronde ",
        rounds: function () { return M4.slice(); },
        desc: "Benda berjatuhan dari langit! Ketuk benda untuk mengubah variabel skor sampai tepat sama dengan target.",
        how: ["⭐ +1, 🌟 +2, 💎 +5 menambah skor.", "🪨 −1, ☁️ −2 mengurangi skor. Pakai kalau skormu kelebihan!"] },
      { title: "Susun Program", icon: "🧩", max: 6, play: roundBuild,
        rounds: function () { return M5.slice(); },
        desc: "Sekarang kamu yang jadi programmer! Susun blok supaya isi variabel sama dengan target.",
        how: ["Ketuk blok untuk menambahkannya ke program.", "Mulai dengan blok “atur”, lalu tekan ▶ Jalankan."] }
    ]
  });
})();
