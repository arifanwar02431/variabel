/* =========================================================
   Mesin game bersama (kelas 4 & kelas 6)
   Layar mulai → peta misi → pembuka misi → tantangan → hasil misi → rapor
   Nilai akhir 0–100, lulus jika nilai ≥ KKM. Progres disimpan per misi.
   ========================================================= */
(function () {
  "use strict";

  function robi(cls, color) {
    color = color || "#E2622A";
    return '<svg class="robi ' + (cls || "") + '" viewBox="0 0 120 120" aria-hidden="true">' +
      '<line x1="60" y1="10" x2="60" y2="24" stroke="#1F2233" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="60" cy="9" r="6" fill="#F6C02E" stroke="#1F2233" stroke-width="3"/>' +
      '<rect x="22" y="24" width="76" height="50" rx="16" fill="' + color + '" stroke="#1F2233" stroke-width="4"/>' +
      '<rect x="32" y="33" width="56" height="30" rx="10" fill="#fff" stroke="#1F2233" stroke-width="3"/>' +
      '<circle cx="48" cy="47" r="5" fill="#1F2233"/><circle cx="72" cy="47" r="5" fill="#1F2233"/>' +
      '<path d="M50 56 Q60 62 70 56" stroke="#1F2233" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<rect x="12" y="86" width="22" height="10" rx="5" fill="' + color + '" stroke="#1F2233" stroke-width="3"/>' +
      '<rect x="86" y="86" width="22" height="10" rx="5" fill="' + color + '" stroke="#1F2233" stroke-width="3"/>' +
      '<rect x="30" y="80" width="60" height="34" rx="6" fill="#fff" stroke="#1F2233" stroke-width="4"/>' +
      '<rect x="42" y="74" width="36" height="13" rx="3" fill="#F6C02E" stroke="#1F2233" stroke-width="3"/>' +
      '<text x="60" y="104" text-anchor="middle" font-family="monospace" font-weight="700" font-size="14" fill="#1F2233">?</text>' +
      "</svg>";
  }

  function create(cfg) {
    const root = cfg.root;
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
    const KKM = cfg.kkm || 85;
    const MISSIONS = cfg.missions;
    const N = MISSIONS.length;
    const MAX_TOTAL = MISSIONS.reduce(function (s, m) { return s + m.max; }, 0);
    const mascot = function (cls) { return robi(cls, cfg.color); };

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
      try { localStorage.setItem(cfg.saveKey, JSON.stringify({ name: st.name, pts: st.pts, done: st.done, elapsed: elapsedMs() })); } catch (e) { /* abaikan */ }
    }
    function loadSave() {
      try {
        const s = JSON.parse(localStorage.getItem(cfg.saveKey));
        if (s && Array.isArray(s.done) && s.done.length === N && s.done.some(Boolean) && !s.done.every(Boolean)) return s;
      } catch (e) { /* abaikan */ }
      return null;
    }
    function clearSave() { try { localStorage.removeItem(cfg.saveKey); } catch (e) { /* abaikan */ } }
    function startClock() { st.since = Date.now(); clearInterval(ticker); ticker = setInterval(updateHud, 1000); }
    function stopClock() { if (st && st.since) { st.elapsed += Date.now() - st.since; st.since = 0; } clearInterval(ticker); }
    function updateHud(misi, soal) {
      if (!st) return;
      if (misi !== undefined) H.misi.textContent = misi;
      if (soal !== undefined) H.soal.textContent = soal;
      H.poin.textContent = "⭐ " + fmt(totalPts() + (st.cur || 0)) + " poin";
      H.waktu.textContent = "⏱ " + clock(elapsedMs());
    }
    function show(html) { screen.innerHTML = html; RV.scrollToTop(root); }
    function head(text) { return '<div class="round-head">' + mascot() + '<div class="speech">' + text + "</div></div>"; }
    function feedback(ok, html, onNext, btnText) {
      if (ok) { st.combo++; RV.beep("ok"); } else { st.combo = 0; RV.beep("bad"); }
      const slot = screen.querySelector(".feedback-slot");
      const combo = ok && st.combo >= 3 ? '<span class="combo">🔥 ' + st.combo + "x beruntun!</span>" : "";
      slot.innerHTML = '<div class="feedback-bar ' + (ok ? "ok" : "bad") + '"><div class="fb-text">' + (ok ? "✅ Benar! " : "❌ Belum tepat. ") + html + combo + "</div>" +
        '<button class="btn btn-primary" type="button">' + (btnText || "Lanjut →") + "</button></div>";
      slot.querySelector("button").addEventListener("click", onNext, { once: true });
      slot.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    function info(html) {
      const slot = screen.querySelector(".feedback-slot");
      slot.innerHTML = html ? '<div class="feedback-bar info"><div class="fb-text">' + html + "</div></div>" : "";
      if (html) slot.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    const G = {
      get screen() { return screen; },
      show: show, head: head, feedback: feedback, info: info, robi: mascot,
      beep: RV.beep, esc: RV.esc, shuffle: RV.shuffle,
      resetCombo: function () { st.combo = 0; }
    };

    soundBtn.addEventListener("click", function () {
      RV.setSound(!RV.soundOn());
      soundBtn.textContent = RV.soundOn() ? "🔊 Suara" : "🔇 Suara";
    });

    function stars(pts, max) { const p = pts / max; return p >= 0.9 ? 3 : p >= 0.6 ? 2 : p > 0 ? 1 : 0; }
    function starText(n) { return "★★★".slice(0, n) + '<span style="color:#D9D2C3">' + "★★★".slice(0, 3 - n) + "</span>"; }

    /* Layar mulai */
    function startScreen() {
      hud.hidden = true;
      const saved = loadSave();
      let html = '<div class="gs-center">' + mascot("wiggle") +
        '<span class="gs-kicker">' + cfg.kicker + "</span>" +
        '<h3 class="gs-title">' + cfg.title + "</h3>" +
        '<p class="muted">' + cfg.story + "</p>" +
        '<div class="start-info"><div><b>' + N + "</b>misi</div><div><b>± 30</b>menit</div><div><b>" + KKM + "</b>nilai minimal lulus</div></div>";
      if (saved) {
        html += "<p><b>Permainan tersimpan:</b> " + RV.esc(saved.name) + ", sudah sampai Misi " + (saved.done.indexOf(false) + 1) + ".</p>" +
          '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-continue>▶ Lanjutkan permainan</button>' +
          '<button class="btn" type="button" data-fresh>Mulai dari awal</button></div>';
      } else {
        html += '<div class="start-form"><label class="field">Tulis namamu dulu, ya:<input type="text" maxlength="30" placeholder="Contoh: Sinta" data-name autocomplete="off"></label></div>' +
          '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-begin>▶ Mulai Petualangan</button></div>';
      }
      screen.innerHTML = html + "</div>";
      if (saved) {
        screen.querySelector("[data-continue]").addEventListener("click", function () {
          st = { name: saved.name, pts: saved.pts, done: saved.done, elapsed: saved.elapsed || 0, since: 0, combo: 0, cur: 0 };
          startClock(); mapScreen();
        });
        screen.querySelector("[data-fresh]").addEventListener("click", function () { clearSave(); startScreen(); });
      } else {
        const input = screen.querySelector("[data-name]");
        const begin = function () {
          st = { name: input.value.trim() || "Programmer Cilik", pts: MISSIONS.map(function () { return 0; }), done: MISSIONS.map(function () { return false; }), elapsed: 0, since: 0, combo: 0, cur: 0 };
          startClock(); mapScreen();
        };
        screen.querySelector("[data-begin]").addEventListener("click", begin);
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") begin(); });
      }
    }

    /* Peta misi */
    function mapScreen() {
      hud.hidden = false;
      st.cur = 0;
      const next = st.done.indexOf(false);
      updateHud("🗺️ Peta misi", next === -1 ? "Semua selesai" : "Berikutnya: Misi " + (next + 1));
      let html = '<div class="gs-center"><span class="gs-kicker">Halo, ' + RV.esc(st.name) + "!</span>" +
        '<h3 class="gs-title">Peta Misi</h3><p class="muted">Selesaikan misi satu per satu. Setiap misi berisi beberapa tantangan.</p></div><div class="map">';
      MISSIONS.forEach(function (m, i) {
        const done = st.done[i], cur = i === next;
        html += '<div class="map-node ' + (done ? "done" : cur ? "current" : "locked") + '">' +
          '<span class="mi">' + (done ? "✅" : cur ? m.icon : "🔒") + "</span>" +
          "<div><h4>Misi " + (i + 1) + " · " + m.title + "</h4><p>" +
          (done ? "Poin: " + fmt(st.pts[i]) + " dari " + m.max : cur ? "Siap dimainkan!" : "Selesaikan misi sebelumnya dulu") + "</p></div>" +
          (done ? '<span class="stars">' + starText(stars(st.pts[i], m.max)) + "</span>" : "<span></span>") + "</div>";
      });
      html += "</div>" +
        '<div class="map-total"><span>Total poin: <b>' + fmt(totalPts()) + "</b> dari " + MAX_TOTAL + "</span><span>·</span><span>Nilai minimal lulus: <b>" + KKM + "</b></span></div>" +
        '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-go>' +
        (next === -1 ? "📋 Lihat rapor" : "▶ Mainkan Misi " + (next + 1)) + "</button></div>";
      show(html);
      screen.querySelector("[data-go]").addEventListener("click", function () {
        if (next === -1) finalScreen(); else missionIntro(next);
      });
    }

    /* Pembuka misi */
    function missionIntro(mi) {
      const m = MISSIONS[mi];
      updateHud("Misi " + (mi + 1) + "/" + N, m.title);
      show('<div class="gs-center"><div style="font-size:3.4rem">' + m.icon + "</div>" +
        '<span class="gs-kicker">Misi ' + (mi + 1) + " dari " + N + "</span>" +
        '<h3 class="gs-title">' + m.title + "</h3><p>" + m.desc + "</p>" +
        '<ul class="rules" style="text-align:left;margin:16px 0">' +
        m.how.map(function (h) { return '<li><span class="badge-num">✓</span><p>' + h + "</p></li>"; }).join("") + "</ul>" +
        '<p class="muted">Poin maksimal misi ini: <b>' + m.max + "</b></p>" +
        '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-go>Ayo mulai! 🚀</button></div></div>');
      screen.querySelector("[data-go]").addEventListener("click", function () { runMission(mi); });
    }

    /* Menjalankan misi */
    function runMission(mi) {
      const m = MISSIONS[mi];
      const rounds = m.rounds();
      let r = 0;
      st.cur = 0;
      function next() {
        if (r >= rounds.length) { missionDone(mi, st.cur); return; }
        updateHud("Misi " + (mi + 1) + "/" + N, (m.label || "Tantangan ") + (r + 1) + "/" + rounds.length);
        m.play(rounds[r], function (pts) { st.cur += pts; r++; updateHud(); next(); }, G);
      }
      next();
    }

    function missionDone(mi, pts) {
      const m = MISSIONS[mi];
      st.pts[mi] = Math.min(pts, m.max);
      st.done[mi] = true;
      st.cur = 0;
      save();
      updateHud("Misi " + (mi + 1) + " selesai", "");
      const s = stars(st.pts[mi], m.max);
      const msgs = ["Tidak apa-apa, kamu sudah berusaha!", "Bagus, terus berlatih!", "Keren sekali!", "Luar biasa!"];
      RV.beep(s >= 2 ? "win" : "ok");
      show('<div class="gs-center">' + mascot("wiggle") +
        '<span class="gs-kicker">Misi ' + (mi + 1) + " selesai!</span>" +
        '<h3 class="gs-title">' + m.title + "</h3>" +
        '<div class="big-stars">' + starText(s) + "</div>" +
        "<p>Poin misi: <b>" + fmt(st.pts[mi]) + "</b> dari " + m.max + '</p><p class="muted">' + msgs[s] + "</p>" +
        '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-go>' +
        (mi < N - 1 ? "Kembali ke peta →" : "📋 Lihat rapor") + "</button></div></div>");
      screen.querySelector("[data-go]").addEventListener("click", function () {
        if (mi < N - 1) mapScreen(); else finalScreen();
      });
    }

    /* Rapor akhir (tanpa sertifikat) */
    function finalScreen() {
      stopClock();
      const total = totalPts();
      const nilai = Math.round(total / MAX_TOTAL * 100);
      const pass = nilai >= KKM;
      clearSave();
      hud.hidden = true;
      let weakest = 0;
      st.pts.forEach(function (p, i) { if (p / MISSIONS[i].max < st.pts[weakest] / MISSIONS[weakest].max) weakest = i; });
      let html = '<div class="rapor"><div class="rapor-head"><span class="gs-kicker">Rapor ' + cfg.title + "</span>" +
        '<h3 class="gs-title">' + RV.esc(st.name) + "</h3>" +
        '<div class="nilai-ring" style="--p:' + nilai + ";--ring:" + (pass ? "var(--ok)" : "var(--accent)") + '"><div><b>' + nilai + "</b><small>nilai</small></div></div>" +
        '<span class="status-pill ' + (pass ? "pass" : "fail") + '">' + (pass ? "LULUS ✓" : "BELUM LULUS") + "</span>" +
        '<p class="muted">Nilai minimal lulus: <b>' + KKM + "</b> · Total poin: " + fmt(total) + " dari " + MAX_TOTAL + " · Waktu bermain: " + clock(st.elapsed) + "</p></div>" +
        '<div class="rapor-rows">' + MISSIONS.map(function (m, i) {
          return '<div class="rapor-row"><span>' + m.icon + "</span><span>Misi " + (i + 1) + " · " + m.title + "</span><b>" + fmt(st.pts[i]) + "/" + m.max + "</b>" +
            '<div class="bar"><span style="width:' + (st.pts[i] / m.max * 100) + '%"></span></div></div>';
        }).join("") + "</div>";
      if (pass) {
        html += '<div class="callout tip"><span class="callout-icon">🎉</span><div><p>Selamat, <b>' + RV.esc(st.name) + "</b>! Kamu lulus dengan nilai <b>" + nilai + "</b>. Lanjutkan dengan mengerjakan kuis, ya.</p></div></div>";
      } else {
        html += '<div class="callout warn"><span class="callout-icon">💪</span><div><p>Nilaimu <b>' + nilai + "</b>, butuh minimal <b>" + KKM +
          "</b> untuk lulus. Baca lagi materinya, terutama yang berhubungan dengan misi <b>" + MISSIONS[weakest].title + "</b>, lalu main lagi. Kamu pasti bisa!</p></div></div>";
      }
      html += '<div class="gs-actions"><button class="btn btn-primary btn-big" type="button" data-again>↺ Main lagi</button>' +
        '<a class="btn" href="#kuis">Lanjut ke kuis →</a></div></div>';
      show(html);
      RV.beep(pass ? "win" : "ok");
      screen.querySelector("[data-again]").addEventListener("click", function () { st = null; startScreen(); });
    }

    startScreen();
  }

  window.RVGame = { create: create, robi: robi };
})();
