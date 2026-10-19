/* =========================================================
   Game Kelas 4 — "Misi Kotak Ajaib"
   5 misi, ± 30 menit, nilai akhir 0–100, lulus jika nilai ≥ 85
   ========================================================= */
(function () {
  "use strict";
  const root = document.querySelector("[data-game]");
  if (!root || !window.RV) return;
  const RV = window.RV;
  const screen = root.querySelector("[data-screen]");
  const hud = root.querySelector(".game-hud");
  const H = {
    misi: root.querySelector("[data-hud='misi']"),
    soal: root.querySelector("[data-hud='soal']"),
    poin: root.querySelector("[data-hud='poin']"),
    waktu: root.querySelector("[data-hud='waktu']")
  };
  const soundBtn = root.querySelector("[data-sound]");
  const KKM = 85;
  const SAVE_KEY = "rv-k4-misi-kotak-v1";

  /* ---------- Data misi ---------- */
  const MISSIONS = [
    { title: "Kotak Berlabel", icon: "📦", max: 6,
      desc: "Robi menemukan banyak barang. Bantu Robi memasukkan setiap barang ke kotak variabel yang labelnya cocok.",
      how: ["Lihat barang dan keterangannya.", "Ketuk kotak yang namanya paling cocok."] },
    { title: "Hitung Isi Kotak", icon: "🧮", max: 8,
      desc: "Robi menjalankan blok kode. Tebak isi variabel setelah semua blok selesai dijalankan.",
      how: ["“atur … ke …” = mengganti isi kotak.", "“ubah … sebesar …” = menambah (atau mengurangi kalau negatif)."] },
    { title: "Nama yang Tepat", icon: "🏷️", max: 6,
      desc: "Kotak-kotak Robi butuh nama. Pilih nama variabel yang paling jelas dan benar.",
      how: ["Nama yang baik menjelaskan isinya.", "Tidak memakai spasi dan tidak diawali angka."] },
    { title: "Tangkap Bintang", icon: "🌟", max: 6,
      desc: "Benda berjatuhan dari langit! Ketuk benda untuk mengubah variabel skor sampai tepat sama dengan target.",
      how: ["⭐ +1, 🌟 +2, 💎 +5 menambah skor.", "🪨 −1, ☁️ −2 mengurangi skor. Pakai kalau skormu kelebihan!"] },
    { title: "Susun Program", icon: "🧩", max: 6,
      desc: "Sekarang kamu yang jadi programmer! Susun blok supaya isi variabel sama dengan target.",
      how: ["Ketuk blok untuk menambahkannya ke program.", "Mulai dengan blok “atur”, lalu tekan ▶ Jalankan."] }
  ];
  const MAX_TOTAL = MISSIONS.reduce(function (s, m) { return s + m.max; }, 0);

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
    { v: "skor", s: HAT + "var: atur [skor] ke (5)", ans: 5, opts: [5, 0, 6, 1],
      ex: "Blok “atur” langsung mengisi skor dengan <b>5</b>." },
    { v: "skor", s: HAT + "var: atur [skor] ke (0)\nvar: ubah [skor] sebesar (3)", ans: 3, opts: [3, 0, 30, 4],
      ex: "Mulai dari 0, lalu ditambah 3: 0 → <b>3</b>." },
    { v: "skor", s: HAT + "var: atur [skor] ke (2)\nvar: ubah [skor] sebesar (4)\nvar: ubah [skor] sebesar (1)", ans: 7, opts: [7, 6, 5, 8],
      ex: "2 → 6 → <b>7</b>. Setiap blok “ubah” menambah isi yang lama." },
    { v: "nyawa", s: HAT + "var: atur [nyawa] ke (5)\nvar: ubah [nyawa] sebesar (-1)", ans: 4, opts: [4, 6, 5, 1],
      ex: "5 → <b>4</b>. Angka negatif (−1) berarti isinya berkurang." },
    { v: "koin", s: HAT + "var: atur [koin] ke (10)\nvar: ubah [koin] sebesar (-3)\nvar: ubah [koin] sebesar (5)", ans: 12, opts: [12, 18, 8, 7],
      ex: "10 → 7 → <b>12</b>." },
    { v: "skor", s: HAT + "var: atur [skor] ke (8)\nvar: atur [skor] ke (1)", ans: 1, opts: [1, 9, 8, 7],
      ex: "Blok “atur” <b>mengganti</b> isi lama. Isi 8 dibuang, diganti menjadi <b>1</b>." },
    { v: "skor", s: HAT + "var: atur [skor] ke (0)\nctrl: ulangi (3) kali\n  var: ubah [skor] sebesar (2)", ans: 6, opts: [6, 2, 5, 3],
      ex: "Blok di dalam “ulangi 3 kali” dijalankan 3 kali: 0 → 2 → 4 → <b>6</b>." },
    { v: "bintang", s: HAT + "var: atur [bintang] ke (1)\nctrl: ulangi (4) kali\n  var: ubah [bintang] sebesar (5)\nvar: ubah [bintang] sebesar (-2)", ans: 19, opts: [19, 21, 18, 20],
      ex: "1 → 6 → 11 → 16 → 21 (4 kali ditambah 5), lalu dikurangi 2 → <b>19</b>." }
  ];

  const M3 = [
    { q: "Robi ingin menyimpan <b>jumlah koin</b> yang dikumpulkan. Nama variabel mana yang paling jelas?", o: ["jumlah_koin", "x", "abc"],
      ex: "<code>jumlah_koin</code> langsung menjelaskan isinya. Nama <code>x</code> dan <code>abc</code> sulit ditebak." },
    { q: "Mana nama variabel yang <b>tidak boleh</b> dipakai di bahasa pemrograman tulisan?", o: ["nama pemain", "nama_pemain", "pemain1"],
      ex: "<code>nama pemain</code> memakai spasi. Ganti spasi dengan garis bawah: <code>nama_pemain</code>." },
    { q: "Mana nama variabel yang <b>salah</b>?", o: ["2skor", "skor2", "skor_akhir"],
      ex: "Nama variabel tidak boleh diawali angka. <code>skor2</code> boleh karena angkanya di belakang." },
    { q: "Untuk menyimpan <b>nama hewan peliharaan</b>, nama variabel terbaik adalah …", o: ["nama_hewan", "nh", "h1"],
      ex: "<code>nama_hewan</code> mudah dipahami siapa saja yang membaca programnya." },
    { q: "Robi mau menyimpan <b>suhu hari ini</b>. Nama variabel terbaik adalah …", o: ["suhu", "s", "angka"],
      ex: "<code>suhu</code> paling jelas. <code>angka</code> terlalu umum, bisa angka apa saja." },
    { q: "Mana nama variabel yang <b>benar dan jelas</b>?", o: ["nilai_ujian", "nilai ujian", "1nilai"],
      ex: "<code>nilai_ujian</code> tidak memakai spasi dan tidak diawali angka." },
    { q: "Untuk menyimpan <b>sisa waktu</b> permainan, nama terbaik adalah …", o: ["sisa_waktu", "w", "waktu sisa"],
      ex: "<code>sisa_waktu</code> jelas dan tidak memakai spasi." }
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

  /* ---------- Robi, si robot (gambar buatan sendiri) ---------- */
  function robi(cls) {
    return '<svg class="robi ' + (cls || "") + '" viewBox="0 0 120 120" aria-hidden="true">' +
      '<line x1="60" y1="10" x2="60" y2="24" stroke="#1F2233" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="60" cy="9" r="6" fill="#F6C02E" stroke="#1F2233" stroke-width="3"/>' +
      '<rect x="22" y="24" width="76" height="50" rx="16" fill="#E2622A" stroke="#1F2233" stroke-width="4"/>' +
      '<rect x="32" y="33" width="56" height="30" rx="10" fill="#fff" stroke="#1F2233" stroke-width="3"/>' +
      '<circle cx="48" cy="47" r="5" fill="#1F2233"/><circle cx="72" cy="47" r="5" fill="#1F2233"/>' +
      '<path d="M50 56 Q60 62 70 56" stroke="#1F2233" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<rect x="12" y="86" width="22" height="10" rx="5" fill="#E2622A" stroke="#1F2233" stroke-width="3"/>' +
      '<rect x="86" y="86" width="22" height="10" rx="5" fill="#E2622A" stroke="#1F2233" stroke-width="3"/>' +
      '<rect x="30" y="80" width="60" height="34" rx="6" fill="#fff" stroke="#1F2233" stroke-width="4"/>' +
      '<rect x="42" y="74" width="36" height="13" rx="3" fill="#F6C02E" stroke="#1F2233" stroke-width="3"/>' +
      '<text x="60" y="104" text-anchor="middle" font-family="monospace" font-weight="700" font-size="14" fill="#96390F">?</text>' +
      "</svg>";
  }

  /* ---------- Status permainan ---------- */
  let st = null;
  let ticker = null;

  function fmt(n) { return String(Math.round(n * 10) / 10).replace(".", ","); }
  function totalPts() { return st.pts.reduce(function (a, b) { return a + b; }, 0); }
  function elapsedMs() { return st.elapsed + (st.since ? Date.now() - st.since : 0); }
  function clock(ms) {
    const s = Math.floor(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ name: st.name, pts: st.pts, done: st.done, elapsed: elapsedMs() })); } catch (e) { /* abaikan */ }
  }
  function loadSave() {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (s && Array.isArray(s.done) && s.done.some(Boolean) && !s.done.every(Boolean)) return s;
    } catch (e) { /* abaikan */ }
    return null;
  }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* abaikan */ } }

  function startClock() {
    st.since = Date.now();
    clearInterval(ticker);
    ticker = setInterval(updateHud, 1000);
  }
  function stopClock() {
    if (st && st.since) { st.elapsed += Date.now() - st.since; st.since = 0; }
    clearInterval(ticker);
  }

  function updateHud(misi, soal) {
    if (!st) return;
    if (misi !== undefined) H.misi.textContent = misi;
    if (soal !== undefined) H.soal.textContent = soal;
    H.poin.textContent = "⭐ " + fmt(totalPts() + (st.cur || 0)) + " poin";
    H.waktu.textContent = "⏱ " + clock(elapsedMs());
  }

  function show(html) {
    screen.innerHTML = html;
    RV.scrollToTop(root);
  }

  soundBtn.addEventListener("click", function () {
    RV.setSound(!RV.soundOn());
    soundBtn.textContent = RV.soundOn() ? "🔊 Suara" : "🔇 Suara";
  });

  /* ---------- Layar mulai ---------- */
  function startScreen() {
    hud.hidden = true;
    const saved = loadSave();
    let html = '<div class="gs-center">' + robi("wiggle") +
      '<span class="gs-kicker">Game Variabel · Kelas 4</span>' +
      '<h3 class="gs-title">Misi Kotak Ajaib</h3>' +
      "<p class=\"muted\">Robi si robot punya banyak kotak, tapi semuanya berantakan! Bantu Robi menyelesaikan 5 misi tentang variabel. Kumpulkan poin sebanyak-banyaknya.</p>" +
      '<div class="start-info"><div><b>5</b>misi</div><div><b>± 30</b>menit</div><div><b>85</b>nilai minimal lulus</div></div>';
    if (saved) {
      const next = saved.done.indexOf(false) + 1;
      html += '<p><b>Permainan tersimpan:</b> ' + RV.esc(saved.name) + ", sudah sampai Misi " + next + ".</p>" +
        '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-continue>▶ Lanjutkan permainan</button>' +
        '<button class="btn" type="button" data-fresh>Mulai dari awal</button></div>';
    } else {
      html += '<div class="start-form"><label class="field">Tulis namamu dulu, ya:<input type="text" maxlength="30" placeholder="Contoh: Sinta" data-name autocomplete="off"></label></div>' +
        '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-begin>▶ Mulai Petualangan</button></div>';
    }
    html += "</div>";
    screen.innerHTML = html;

    if (saved) {
      screen.querySelector("[data-continue]").addEventListener("click", function () {
        st = { name: saved.name, pts: saved.pts, done: saved.done, elapsed: saved.elapsed || 0, since: 0, combo: 0, cur: 0 };
        startClock(); mapScreen();
      });
      screen.querySelector("[data-fresh]").addEventListener("click", function () { clearSave(); startScreen(); });
    } else {
      const input = screen.querySelector("[data-name]");
      const begin = function () {
        const name = input.value.trim() || "Programmer Cilik";
        st = { name: name, pts: [0, 0, 0, 0, 0], done: [false, false, false, false, false], elapsed: 0, since: 0, combo: 0, cur: 0 };
        startClock(); mapScreen();
      };
      screen.querySelector("[data-begin]").addEventListener("click", begin);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") begin(); });
    }
  }

  /* ---------- Peta misi ---------- */
  function stars(pts, max) {
    const p = pts / max;
    return p >= 0.9 ? 3 : p >= 0.6 ? 2 : p > 0 ? 1 : 0;
  }
  function starText(n) { return "★★★".slice(0, n) + '<span style="color:#D9D2C3">' + "★★★".slice(0, 3 - n) + "</span>"; }

  function mapScreen() {
    hud.hidden = false;
    st.cur = 0;
    const next = st.done.indexOf(false);
    updateHud("🗺️ Peta misi", next === -1 ? "Semua selesai" : "Berikutnya: Misi " + (next + 1));
    let html = '<div class="gs-center"><span class="gs-kicker">Halo, ' + RV.esc(st.name) + "!</span>" +
      '<h3 class="gs-title">Peta Misi Robi</h3><p class="muted">Selesaikan misi satu per satu. Setiap misi berisi beberapa tantangan.</p></div><div class="map">';
    MISSIONS.forEach(function (m, i) {
      const done = st.done[i], cur = i === next;
      html += '<div class="map-node ' + (done ? "done" : cur ? "current" : "locked") + '">' +
        '<span class="mi">' + (done ? "✅" : cur ? m.icon : "🔒") + "</span>" +
        "<div><h4>Misi " + (i + 1) + " · " + m.title + "</h4><p>" +
        (done ? "Poin: " + fmt(st.pts[i]) + " dari " + m.max : cur ? "Siap dimainkan!" : "Selesaikan misi sebelumnya dulu") + "</p></div>" +
        (done ? '<span class="stars">' + starText(stars(st.pts[i], m.max)) + "</span>" : "<span></span>") +
        "</div>";
    });
    html += "</div>" +
      '<div class="map-total"><span>Total poin: <b>' + fmt(totalPts()) + "</b> dari " + MAX_TOTAL + "</span><span>·</span><span>Nilai minimal lulus: <b>" + KKM + "</b></span></div>" +
      '<div class="gs-actions">' +
      (next === -1 ? '<button class="btn btn-primary btn-big" type="button" data-go>🎓 Lihat rapor</button>'
                   : '<button class="btn btn-primary btn-big" type="button" data-go>▶ Mainkan Misi ' + (next + 1) + "</button>") +
      "</div>";
    show(html);
    screen.querySelector("[data-go]").addEventListener("click", function () {
      if (next === -1) finalScreen(); else missionIntro(next);
    });
  }

  /* ---------- Pembuka misi ---------- */
  function missionIntro(mi) {
    const m = MISSIONS[mi];
    updateHud("Misi " + (mi + 1) + "/5", m.title);
    show('<div class="gs-center"><div style="font-size:3.4rem">' + m.icon + "</div>" +
      '<span class="gs-kicker">Misi ' + (mi + 1) + " dari 5</span>" +
      '<h3 class="gs-title">' + m.title + "</h3><p>" + m.desc + "</p>" +
      '<ul class="rules" style="text-align:left;margin:16px 0">' +
      m.how.map(function (h) { return '<li><span class="badge-num">✓</span><p>' + h + "</p></li>"; }).join("") +
      "</ul>" +
      '<p class="muted">Poin maksimal misi ini: <b>' + m.max + "</b></p>" +
      '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-go>Ayo mulai! 🚀</button></div></div>');
    screen.querySelector("[data-go]").addEventListener("click", function () { runMission(mi); });
  }

  /* ---------- Menjalankan misi ---------- */
  function runMission(mi) {
    let rounds, play;
    if (mi === 0) { rounds = RV.shuffle(M1).slice(0, 6); play = roundLabel; }
    else if (mi === 1) { rounds = M2.slice(); play = roundCount; }
    else if (mi === 2) { rounds = RV.shuffle(M3).slice(0, 6); play = roundName; }
    else if (mi === 3) { rounds = M4.slice(); play = roundCatch; }
    else { rounds = M5.slice(); play = roundBuild; }
    let r = 0;
    st.cur = 0;
    const label = mi === 3 ? "Ronde " : "Tantangan ";
    function next() {
      if (r >= rounds.length) { missionDone(mi, st.cur); return; }
      updateHud("Misi " + (mi + 1) + "/5", label + (r + 1) + "/" + rounds.length);
      play(rounds[r], function (pts) {
        st.cur += pts;
        r++;
        updateHud();
        next();
      });
    }
    next();
  }

  function missionDone(mi, pts) {
    st.pts[mi] = Math.min(pts, MISSIONS[mi].max);
    st.done[mi] = true;
    st.cur = 0;
    save();
    updateHud("Misi " + (mi + 1) + " selesai", "");
    const m = MISSIONS[mi];
    const s = stars(st.pts[mi], m.max);
    const msgs = ["Tidak apa-apa, kamu sudah berusaha!", "Bagus, terus berlatih!", "Keren sekali!", "Luar biasa! Kamu ahli variabel!"];
    RV.beep(s >= 2 ? "win" : "ok");
    show('<div class="gs-center">' + robi("wiggle") +
      '<span class="gs-kicker">Misi ' + (mi + 1) + " selesai!</span>" +
      '<h3 class="gs-title">' + m.title + "</h3>" +
      '<div class="big-stars">' + starText(s) + "</div>" +
      "<p>Poin misi: <b>" + fmt(st.pts[mi]) + "</b> dari " + m.max + "</p><p class=\"muted\">" + msgs[s] + "</p>" +
      '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-go>' +
      (mi < 4 ? "Kembali ke peta →" : "🎓 Lihat rapor") + "</button></div></div>");
    screen.querySelector("[data-go]").addEventListener("click", function () {
      if (mi < 4) mapScreen(); else finalScreen();
    });
  }

  /* ---------- Umpan balik bersama ---------- */
  function feedback(ok, html, onNext, btnText) {
    if (ok) { st.combo++; RV.beep("ok"); } else { st.combo = 0; RV.beep("bad"); }
    const slot = screen.querySelector(".feedback-slot");
    const combo = ok && st.combo >= 3 ? '<span class="combo">🔥 ' + st.combo + "x beruntun!</span>" : "";
    slot.innerHTML = '<div class="feedback-bar ' + (ok ? "ok" : "bad") + '"><p>' + (ok ? "✅ Benar! " : "❌ Belum tepat. ") + html + combo + "</p>" +
      '<button class="btn btn-primary" type="button">' + (btnText || "Lanjut →") + "</button></div>";
    const b = slot.querySelector("button");
    b.addEventListener("click", onNext, { once: true });
    slot.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function head(text) {
    return '<div class="round-head">' + robi() + '<div class="speech">' + text + "</div></div>";
  }

  /* ---------- Misi 1: kotak berlabel ---------- */
  function roundLabel(item, done) {
    const opts = RV.shuffle([item.ok].concat(item.no));
    show(head("Robi menemukan barang ini. Masuk ke kotak variabel yang mana?") +
      '<div style="text-align:center"><div class="item-card"><span class="emo">' + item.emo + '</span><div><div class="val">' + RV.esc(item.val) + '</div><div class="desc">' + item.desc + "</div></div></div></div>" +
      '<div class="box-choices">' + opts.map(function (o) {
        return '<button type="button" class="box-choice" data-v="' + o + '"><div class="vbox"><span class="vbox-label">' + o + '</span><span class="vbox-value">?</span></div></button>';
      }).join("") + "</div>" +
      '<div class="feedback-slot"></div>');
    screen.querySelectorAll(".box-choice").forEach(function (b) {
      b.addEventListener("click", function () {
        const ok = b.dataset.v === item.ok;
        screen.querySelectorAll(".box-choice").forEach(function (x) {
          x.disabled = true;
          if (x.dataset.v === item.ok) {
            x.classList.add("is-correct");
            x.querySelector(".vbox-value").textContent = item.val;
            x.querySelector(".vbox").classList.add("bump");
          } else if (x === b) x.classList.add("is-wrong");
        });
        feedback(ok, item.val + " adalah " + item.desc + ", jadi disimpan di variabel <code>" + item.ok + "</code>.", function () { done(ok ? 1 : 0); });
      });
    });
  }

  /* ---------- Misi 2: hitung isi kotak ---------- */
  function roundCount(r, done) {
    const opts = RV.shuffle(r.opts);
    show(head("Baca blok kodenya dari atas ke bawah. Setelah semua dijalankan, berapa isi variabel <b>" + r.v + "</b>?") +
      '<div class="split" style="align-items:center;margin-bottom:20px"><div class="script-box block">' + RV.renderScript(r.s) + "</div>" +
      '<div style="display:flex;justify-content:center;padding-top:16px"><div class="vbox" data-vb><span class="vbox-label">' + r.v + '</span><span class="vbox-value">?</span></div></div></div>' +
      '<div class="num-choices">' + opts.map(function (n) {
        return '<button type="button" class="q-opt" data-n="' + n + '">' + n + "</button>";
      }).join("") + "</div>" +
      '<div class="feedback-slot"></div>');
    screen.querySelectorAll(".num-choices .q-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        const ok = Number(b.dataset.n) === r.ans;
        screen.querySelectorAll(".num-choices .q-opt").forEach(function (x) {
          x.disabled = true;
          if (Number(x.dataset.n) === r.ans) x.classList.add("is-correct");
          else if (x === b) x.classList.add("is-wrong");
        });
        const vb = screen.querySelector("[data-vb]");
        vb.querySelector(".vbox-value").textContent = r.ans;
        vb.classList.add("bump");
        feedback(ok, r.ex, function () { done(ok ? 1 : 0); });
      });
    });
  }

  /* ---------- Misi 3: nama yang tepat ---------- */
  function roundName(r, done) {
    const correct = r.o[0];
    const opts = RV.shuffle(r.o);
    show(head(r.q) +
      '<div class="q-opts name-choices">' + opts.map(function (o, j) {
        return '<button type="button" class="q-opt" data-o="' + RV.esc(o) + '"><span class="q-key">' + "ABC"[j] + "</span><span>" + RV.esc(o) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="feedback-slot"></div>');
    screen.querySelectorAll(".name-choices .q-opt").forEach(function (b) {
      b.addEventListener("click", function () {
        const ok = b.dataset.o === correct;
        screen.querySelectorAll(".name-choices .q-opt").forEach(function (x) {
          x.disabled = true;
          if (x.dataset.o === correct) x.classList.add("is-correct");
          else if (x === b) x.classList.add("is-wrong");
        });
        feedback(ok, r.ex, function () { done(ok ? 1 : 0); });
      });
    });
  }

  /* ---------- Misi 4: tangkap bintang ---------- */
  const ITEMS = { 1: "⭐", 2: "🌟", 5: "💎", "-1": "🪨", "-2": "☁️" };
  function blockText(kind, v, n) {
    return RV.inline(kind === "atur" ? "atur [" + v + "] ke (" + n + ")" : "ubah [" + v + "] sebesar (" + n + ")");
  }

  function roundCatch(r, done) {
    show(head("Ketuk benda yang jatuh! Buat variabel <b>skor</b> tepat <b>" + r.target + "</b> sebelum waktu habis. Kelebihan? Ketuk 🪨 atau ☁️ untuk mengurangi.") +
      '<div class="catch-top"><div class="vbox" data-cv><span class="vbox-label">skor</span><span class="vbox-value">0</span></div>' +
      '<div class="target-chip">🎯 Target: skor = <b>' + r.target + "</b></div></div>" +
      '<div class="timebar"><span></span></div>' +
      '<div class="arena"><div class="arena-msg"><div><p style="font-size:1.05rem;margin-bottom:6px">⭐ +1 &nbsp; 🌟 +2 &nbsp; 💎 +5</p><p style="font-size:1.05rem">🪨 −1 &nbsp; ☁️ −2</p>' +
      '<p class="mb-0" style="opacity:.8;font-size:.9rem">Waktu: ' + r.time + ' detik</p><div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-start>▶ Mulai!</button></div></div></div></div>' +
      '<div class="last-block"><span>Blok yang dijalankan:</span><span class="blk var" data-lb>' + blockText("atur", "skor", 0) + "</span></div>" +
      '<div class="feedback-slot"></div>');

    const arena = screen.querySelector(".arena");
    const msg = arena.querySelector(".arena-msg");
    const cv = screen.querySelector("[data-cv]");
    const bar = screen.querySelector(".timebar span");
    const lb = screen.querySelector("[data-lb]");
    let skor = 0, items = [], running = false, raf = 0, last = 0, spawnIn = 0, left = r.time * 1000;

    function pick() {
      const diff = r.target - skor;
      const roll = Math.random();
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
      const w = arena.clientWidth;
      const it = { el: el, x: Math.random() * Math.max(0, w - 74) + 2, y: -72, v: v, speed: arena.clientHeight / r.fall * (0.85 + Math.random() * 0.3) };
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
      cv.classList.remove("bump"); void cv.offsetWidth; cv.classList.add("bump");
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
      RV.beep(it.v > 0 ? "tick" : "bad");
      if (skor === r.target) end(true);
    }

    function frame(ts) {
      if (!running) return;
      const dt = last ? Math.min(50, ts - last) : 16;
      last = ts;
      left -= dt;
      spawnIn -= dt;
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
      msg.innerHTML = "<div><div style=\"font-size:3rem\">" + (win ? "🎉" : near ? "👍" : "⏰") + "</div><p style=\"font-size:1.2rem\">" +
        (win ? "Tepat " + r.target + "!" : "Waktu habis! Skormu " + skor + ".") + "</p></div>";
      feedback(win || near,
        win ? "Skor tepat " + r.target + ". Kamu dapat <b>2 poin</b>."
            : near ? "Skormu " + skor + ", hampir sampai " + r.target + ". Kamu dapat <b>1 poin</b>."
                   : "Skormu " + skor + ", targetnya " + r.target + ". Perhatikan: tambah kalau kurang, kurangi kalau lebih.",
        function () { done(pts); });
      if (win) RV.beep("win");
    }

    screen.querySelector("[data-start]").addEventListener("click", function () {
      msg.hidden = true;
      running = true;
      last = 0;
      spawnIn = 200;
      raf = requestAnimationFrame(frame);
    });
  }

  /* ---------- Misi 5: susun program ---------- */
  function roundBuild(r, done) {
    let prog = [], attempts = 0, busy = false;
    const label = function (b) { return blockText(b[0], r.v, b[1]); };
    show(head(r.say) +
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
    function setVal(v) {
      bv.querySelector(".vbox-value").textContent = v === null ? "?" : v;
      bv.classList.remove("bump"); void bv.offsetWidth; bv.classList.add("bump");
    }
    palBtns.forEach(function (p) {
      p.addEventListener("click", function () {
        if (busy || prog.length >= r.max) return;
        prog.push(r.palette[Number(p.dataset.p)]);
        RV.beep("tick");
        draw();
      });
    });
    undoBtn.addEventListener("click", function () { prog.pop(); draw(); });
    runBtn.addEventListener("click", function () {
      if (busy) return;
      const slot = screen.querySelector(".feedback-slot");
      if (!prog.length) {
        slot.innerHTML = '<div class="feedback-bar info"><p>Ketuk blok di kiri (atau atas) untuk menambahkannya ke programmu dulu, ya.</p></div>';
        return;
      }
      slot.innerHTML = "";
      busy = true; draw();
      let val = null, i = 0;
      setVal(null);
      (function stepRun() {
        if (i < prog.length) {
          const b = prog[i];
          val = b[0] === "atur" ? b[1] : (val === null ? null : val + b[1]);
          draw(i); setVal(val);
          RV.beep("tick");
          i++;
          setTimeout(stepRun, 650);
          return;
        }
        busy = false;
        attempts++;
        draw();
        const startsOk = prog[0][0] === "atur";
        const ok = startsOk && val === r.target;
        const leftTries = 3 - attempts;
        leftEl.textContent = Math.max(0, leftTries);
        if (ok) {
          const pts = attempts === 1 ? 1 : 0.5;
          palBtns.forEach(function (p) { p.disabled = true; });
          undoBtn.disabled = true; runBtn.disabled = true;
          feedback(true, "Isi " + r.v + " sekarang " + r.target + ". " + (pts === 1 ? "Langsung berhasil, <b>1 poin</b>!" : "Berhasil, <b>½ poin</b>."), function () { done(pts); });
          return;
        }
        const why = !startsOk
          ? "Programmu belum dimulai dengan blok “atur”, jadi isi awal " + r.v + " tidak diketahui (?)."
          : "Hasilnya " + val + ", padahal targetnya " + r.target + ".";
        if (leftTries > 0) {
          RV.beep("bad"); st.combo = 0;
          slot.innerHTML = '<div class="feedback-bar bad"><p>❌ ' + why + " Ubah programmu, lalu coba jalankan lagi. Kesempatan tersisa: <b>" + leftTries + "</b>.</p></div>";
          slot.scrollIntoView({ block: "nearest", behavior: "smooth" });
        } else {
          palBtns.forEach(function (p) { p.disabled = true; });
          undoBtn.disabled = true; runBtn.disabled = true;
          const sol = "event: ketika 🏁 diklik\n" + r.sol.map(function (b) {
            return "var: " + (b[0] === "atur" ? "atur [" + r.v + "] ke (" + b[1] + ")" : "ubah [" + r.v + "] sebesar (" + b[1] + ")");
          }).join("\n");
          feedback(false, why + " Contoh jawaban yang benar:<div class=\"script-box\" style=\"margin-top:10px\">" + RV.renderScript(sol) + "</div>", function () { done(0); });
        }
      })();
    });
    draw();
  }

  /* ---------- Rapor akhir ---------- */
  function finalScreen() {
    stopClock();
    const total = totalPts();
    const nilai = Math.round(total / MAX_TOTAL * 100);
    const pass = nilai >= KKM;
    clearSave();
    hud.hidden = true;
    let weakest = 0;
    st.pts.forEach(function (p, i) { if (p / MISSIONS[i].max < st.pts[weakest] / MISSIONS[weakest].max) weakest = i; });
    const tgl = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    let html = '<div class="rapor"><div class="rapor-head"><span class="gs-kicker">Rapor Misi Kotak Ajaib</span>' +
      '<h3 class="gs-title">' + RV.esc(st.name) + "</h3>" +
      '<div class="nilai-ring" style="--p:' + nilai + ";--ring:" + (pass ? "var(--ok)" : "var(--k4)") + '"><div><b>' + nilai + "</b><small>nilai</small></div></div>" +
      '<span class="status-pill ' + (pass ? "pass" : "fail") + '">' + (pass ? "LULUS ✓" : "BELUM LULUS") + "</span>" +
      '<p class="muted">Nilai minimal lulus: <b>' + KKM + "</b> · Total poin: " + fmt(total) + " dari " + MAX_TOTAL + " · Waktu bermain: " + clock(st.elapsed) + "</p></div>" +
      '<div class="rapor-rows">' + MISSIONS.map(function (m, i) {
        return '<div class="rapor-row"><span>' + m.icon + "</span><span>Misi " + (i + 1) + " · " + m.title + "</span><b>" + fmt(st.pts[i]) + "/" + m.max + "</b>" +
          '<div class="bar"><span style="width:' + (st.pts[i] / m.max * 100) + '%"></span></div></div>';
      }).join("") + "</div>";
    if (pass) {
      html += '<div class="cert"><div class="seal">🏅</div><h3>Sertifikat Ahli Variabel</h3><p class="mb-0">diberikan kepada</p>' +
        '<div class="who">' + RV.esc(st.name) + "</div><p class=\"mb-0\">karena berhasil menyelesaikan Misi Kotak Ajaib dengan nilai <b>" + nilai + "</b>.</p>" +
        '<p class="muted mb-0" style="font-size:.86rem;margin-top:6px">' + tgl + "</p></div>";
    } else {
      html += '<div class="callout warn"><span class="callout-icon">💪</span><div><p>Nilaimu <b>' + nilai + "</b>, butuh minimal <b>" + KKM +
        "</b> untuk lulus. Coba baca lagi materinya, terutama bagian yang berhubungan dengan misi <b>" + MISSIONS[weakest].title + "</b>, lalu main lagi. Kamu pasti bisa!</p></div></div>";
    }
    html += '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-again>↺ Main lagi</button>' +
      '<a class="btn" href="#kuis">Lanjut ke kuis →</a></div></div>';
    show(html);
    RV.beep(pass ? "win" : "ok");
    screen.querySelector("[data-again]").addEventListener("click", function () { st = null; startScreen(); });
  }

  startScreen();
})();
