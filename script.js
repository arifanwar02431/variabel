/* =========================================================
   Ruang Variabel — skrip bersama
   (blok ala Scratch, daftar isi, kuis, penelusur blok, dadu)
   ========================================================= */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- 1. Penggambar blok ala Scratch ----------
     Satu baris = satu blok, format "jenis: teks".
     Jenis: event, var, ctrl, look, sense, op, motion, else.
     Baris yang menjorok (2 spasi) masuk ke dalam blok di atasnya (ulangi, jika).
     Di dalam teks:
       (isi)     -> kotak isian putih
       [nama]    -> pilihan (dropdown), mis. [skor]
       {nama}    -> reporter variabel oranye
       {s:teks}  -> reporter penginderaan biru (mis. jawaban)
       {o:teks}  -> reporter operator hijau (mis. gabung, acak)
       «teks»    -> kondisi (hijau, segi enam)
  */
  const PAIRS = { "(": ")", "[": "]", "{": "}", "«": "»" };

  function parseInline(s) {
    let out = "", i = 0;
    while (i < s.length) {
      const c = s[i];
      if (PAIRS[c]) {
        const stack = [];
        let j = i;
        for (; j < s.length; j++) {
          const ch = s[j];
          if (PAIRS[ch]) stack.push(PAIRS[ch]);
          else if (stack.length && ch === stack[stack.length - 1]) {
            stack.pop();
            if (!stack.length) break;
          }
        }
        const inner = s.slice(i + 1, j);
        if (c === "(") {
          if (/^\{.*\}$/.test(inner)) out += parseInline(inner);
          else out += '<span class="slot">' + parseInline(inner) + "</span>";
        } else if (c === "[") {
          out += '<span class="drop">' + esc(inner) + " ▾</span>";
        } else if (c === "{") {
          let cls = "var", t = inner;
          if (t.indexOf("s:") === 0) { cls = "sense"; t = t.slice(2); }
          else if (t.indexOf("o:") === 0) { cls = "op"; t = t.slice(2); }
          out += '<span class="rep ' + cls + '">' + parseInline(t) + "</span>";
        } else {
          out += '<span class="bool">' + parseInline(inner) + "</span>";
        }
        i = j + 1;
      } else {
        out += esc(c);
        i++;
      }
    }
    return out;
  }

  function dedent(src) {
    const lines = src.replace(/\t/g, "  ").split("\n").filter(function (l) { return l.trim(); });
    const min = Math.min.apply(null, lines.map(function (l) { return l.match(/^ */)[0].length; }));
    return lines.map(function (l) { return l.slice(min); });
  }

  function renderScript(src) {
    const lines = dedent(src);
    const root = { children: [] };
    const stack = [{ indent: -1, node: root }];
    lines.forEach(function (line, idx) {
      const indent = line.match(/^ */)[0].length;
      const m = line.trim().match(/^([a-z]+):\s?(.*)$/);
      const node = { type: m ? m[1] : "var", text: m ? m[2] : line.trim(), id: idx, children: [] };
      while (stack[stack.length - 1].indent >= indent) stack.pop();
      stack[stack.length - 1].node.children.push(node);
      stack.push({ indent: indent, node: node });
    });
    return '<div class="script">' + renderNodes(root.children) + "</div>";
  }

  function renderNodes(nodes) {
    let html = "", prev = null;
    nodes.forEach(function (n) {
      if (n.type === "else" && prev) { prev.elseNode = n; return; }
      prev = n;
    });
    nodes.forEach(function (n) { if (n.type !== "else") html += renderNode(n); });
    return html;
  }

  function renderNode(n) {
    const head = '<div class="blk ' + n.type + '" data-id="' + n.id + '">' + parseInline(n.text) + "</div>";
    if (!n.children.length && !n.elseNode) return head;
    let html = '<div class="cblk ' + n.type + '">' + head + '<div class="cinner">' + renderNodes(n.children) + "</div>";
    if (n.elseNode) {
      html += '<div class="blk ' + n.type + ' cmid" data-id="' + n.elseNode.id + '">' + parseInline(n.elseNode.text) + "</div>";
      html += '<div class="cinner">' + renderNodes(n.elseNode.children) + "</div>";
    }
    return html + '<div class="cfoot"></div></div>';
  }

  function renderAllScripts(scope) {
    (scope || document).querySelectorAll("[data-script]").forEach(function (el) {
      el.innerHTML = renderScript(el.textContent);
      el.removeAttribute("data-script");
    });
  }
  renderAllScripts();

  /* ---------- 2. Suara kecil (bisa dimatikan) ---------- */
  let actx = null;
  let soundOn = true;
  function beep(kind) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = kind === "ok" ? [660, 880] : kind === "bad" ? [320, 230] : kind === "win" ? [523, 659, 784, 1047] : [600];
      notes.forEach(function (f, i) {
        const t = actx.currentTime + i * 0.1;
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        o.connect(g); g.connect(actx.destination);
        o.start(t); o.stop(t + 0.22);
      });
    } catch (e) { /* tanpa suara */ }
  }

  function scrollToTop(el) {
    const r = el.getBoundingClientRect();
    if (r.top < 120 || r.top > window.innerHeight * 0.6) {
      window.scrollTo({ top: window.scrollY + r.top - 140, behavior: "smooth" });
    }
  }

  window.RV = {
    esc: esc, shuffle: shuffle, renderScript: renderScript, inline: parseInline, beep: beep, scrollToTop: scrollToTop,
    setSound: function (on) { soundOn = on; }, soundOn: function () { return soundOn; }
  };

  /* ---------- 3. Daftar isi aktif ----------
     Hanya baris daftar isi yang digeser ke samping; halaman tidak pernah digeser oleh skrip. */
  const tocInner = document.querySelector(".toc-inner");
  const tocLinks = Array.from(document.querySelectorAll(".toc a[href^='#']"));
  if (tocInner && tocLinks.length && "IntersectionObserver" in window) {
    const map = new Map();
    tocLinks.forEach(function (a) {
      const sec = document.querySelector(a.getAttribute("href"));
      if (sec) map.set(sec, a);
    });
    let current = null;
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        const link = map.get(e.target);
        if (!link || link === current) return;
        if (current) current.classList.remove("active");
        link.classList.add("active");
        current = link;
        tocInner.scrollLeft = Math.max(0, link.offsetLeft - (tocInner.clientWidth - link.offsetWidth) / 2);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach(function (_, sec) { obs.observe(sec); });
  }

  /* ---------- 4. Kuis satu-per-satu dengan nilai & KKM ---------- */
  function initQuiz(root) {
    const data = window[root.dataset.quiz];
    if (!data) return;
    const kkm = Number(root.dataset.kkm || 85);
    const stage = root.querySelector(".quiz-stage");
    const bar = root.querySelector(".quiz-bar span");
    const countEl = root.querySelector("[data-count]");
    const rightEl = root.querySelector("[data-right]");
    let order, idx, right, wrong;

    function start(shuffleQuestions) {
      order = shuffleQuestions ? shuffle(data) : data.slice();
      idx = 0; right = 0; wrong = [];
      showQuestion();
    }

    function updateTop() {
      countEl.textContent = "Soal " + Math.min(idx + 1, order.length) + " dari " + order.length;
      rightEl.textContent = "Benar: " + right;
      bar.style.width = (idx / order.length * 100) + "%";
    }

    function showQuestion() {
      updateTop();
      const q = order[idx];
      const opts = shuffle(q.o.map(function (text, k) { return { text: text, ok: k === q.a }; }));
      stage.innerHTML =
        '<div class="q">' +
          '<p class="q-num">Soal ' + (idx + 1) + "</p>" +
          '<p class="q-text">' + q.q + "</p>" +
          (q.s ? '<div class="script-box">' + renderScript(q.s) + "</div>" : "") +
          '<div class="q-opts"></div>' +
          '<p class="q-explain" hidden aria-live="polite"></p>' +
          '<div class="q-next" hidden><button class="btn btn-primary" type="button"></button></div>' +
        "</div>";
      const box = stage.querySelector(".q-opts");
      opts.forEach(function (opt, j) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "q-opt";
        if (opt.ok) b.dataset.ok = "1";
        b.innerHTML = '<span class="q-key">' + "ABCD"[j] + "</span><span>" + opt.text + "</span>";
        b.addEventListener("click", function () { answer(b, opt, q, box); });
        box.appendChild(b);
      });
    }

    function answer(btn, opt, q, box) {
      if (box.dataset.done) return;
      box.dataset.done = "1";
      if (opt.ok) { right++; beep("ok"); } else { wrong.push(q); beep("bad"); }
      box.querySelectorAll(".q-opt").forEach(function (b) {
        b.disabled = true;
        if (b.dataset.ok) b.classList.add("is-correct");
        else if (b === btn) b.classList.add("is-wrong");
      });
      const ex = stage.querySelector(".q-explain");
      ex.hidden = false;
      ex.className = "q-explain " + (opt.ok ? "ok" : "bad");
      ex.innerHTML = "<strong>" + (opt.ok ? "Benar! " : "Belum tepat. ") + "</strong>" + q.e;
      rightEl.textContent = "Benar: " + right;
      bar.style.width = ((idx + 1) / order.length * 100) + "%";
      const next = stage.querySelector(".q-next");
      const nb = next.querySelector("button");
      next.hidden = false;
      nb.textContent = idx + 1 < order.length ? "Soal berikutnya →" : "Lihat nilaiku 🎯";
      nb.addEventListener("click", function () {
        idx++;
        if (idx < order.length) showQuestion(); else showResult();
        scrollToTop(root);
      });
      next.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function showResult() {
      const nilai = Math.round(right / order.length * 100);
      const pass = nilai >= kkm;
      countEl.textContent = "Selesai";
      bar.style.width = "100%";
      let msg;
      if (nilai === 100) msg = "Sempurna! Semua jawabanmu benar. Kamu benar-benar paham tentang variabel.";
      else if (pass) msg = "Hebat, kamu lulus! Lihat lagi soal yang masih salah supaya makin paham.";
      else msg = "Nilai minimal untuk lulus adalah " + kkm + ". Baca lagi materinya, perhatikan soal yang salah, lalu coba lagi. Kamu pasti bisa!";
      let review = "";
      if (wrong.length) {
        review = '<div class="review"><h4>Soal yang perlu dipelajari lagi:</h4><ol>' +
          wrong.map(function (q) { return "<li>" + q.q + "<br>Jawaban benar: <span>" + q.o[q.a] + "</span></li>"; }).join("") +
          "</ol></div>";
      }
      stage.innerHTML =
        '<div class="result-card">' +
          "<p class=\"mb-0\">Nilai kuismu</p>" +
          '<div class="big">' + nilai + "</div>" +
          "<p>" + right + " dari " + order.length + " soal benar · Nilai minimal: " + kkm + "</p>" +
          '<span class="status-pill ' + (pass ? "pass" : "fail") + '">' + (pass ? "LULUS ✓" : "BELUM LULUS") + "</span>" +
          "<p>" + msg + "</p>" +
          '<button class="btn btn-primary" type="button" data-retry>↺ Ulangi kuis (soal diacak)</button>' +
          review +
        "</div>";
      if (pass) beep("win");
      stage.querySelector("[data-retry]").addEventListener("click", function () {
        start(true);
        scrollToTop(root);
      });
    }

    start(false);
  }
  document.querySelectorAll("[data-quiz]").forEach(initQuiz);

  /* ---------- 5. Penelusur blok (kelas 6) ---------- */
  function initTracer(root) {
    const programs = window[root.dataset.tracer];
    if (!programs) return;
    const scriptEl = root.querySelector("[data-trace-script]");
    const monEl = root.querySelector(".monitors");
    const bubble = root.querySelector(".bubble");
    const noteEl = root.querySelector(".tracer-note");
    const countEl = root.querySelector(".step-count");
    const prevBtn = root.querySelector("[data-prev]");
    const nextBtn = root.querySelector("[data-next]");
    const resetBtn = root.querySelector("[data-reset]");
    const tabs = root.querySelectorAll(".seg button");
    let prog, step;

    function stateAt(k) {
      const vars = {}, order = [];
      let talk = null;
      for (let i = 0; i <= k; i++) {
        const s = prog.steps[i];
        if (s.set) Object.keys(s.set).forEach(function (n) {
          if (!(n in vars)) order.push(n);
          vars[n] = s.set[n];
        });
        if (s.say !== undefined) talk = { text: s.say };
        if (s.ask !== undefined) talk = { text: s.ask, answer: s.answer };
      }
      return { vars: vars, order: order, talk: talk };
    }

    function draw() {
      const st = stateAt(step);
      const cur = step >= 0 ? prog.steps[step] : null;
      scriptEl.querySelectorAll(".blk").forEach(function (b) {
        b.classList.toggle("active", !!cur && Number(b.dataset.id) === cur.id);
      });
      const changed = cur && cur.set ? Object.keys(cur.set) : [];
      monEl.innerHTML = st.order.map(function (n) {
        return '<span class="monitor' + (changed.indexOf(n) !== -1 ? " changed" : "") + '">' + esc(n) + " <b>" + esc(st.vars[n]) + "</b></span>";
      }).join("");
      if (st.talk) {
        bubble.hidden = false;
        bubble.innerHTML = esc(st.talk.text) + (st.talk.answer !== undefined ? '<div class="ask-box">Kamu mengetik: <b>' + esc(st.talk.answer) + "</b></div>" : "");
      } else bubble.hidden = true;
      noteEl.innerHTML = cur ? cur.note : prog.intro;
      countEl.textContent = "Langkah " + (step + 1) + " / " + prog.steps.length;
      prevBtn.disabled = step < 0;
      nextBtn.disabled = step >= prog.steps.length - 1;
      nextBtn.textContent = step < 0 ? "Mulai ▶" : "Berikutnya ▶";
    }

    function load(key) {
      prog = programs[key];
      step = -1;
      scriptEl.innerHTML = renderScript(prog.script);
      tabs.forEach(function (t) { t.classList.toggle("active", t.dataset.prog === key); });
      draw();
    }

    prevBtn.addEventListener("click", function () { if (step >= 0) { step--; draw(); } });
    nextBtn.addEventListener("click", function () { if (step < prog.steps.length - 1) { step++; draw(); } });
    resetBtn.addEventListener("click", function () { step = -1; draw(); });
    tabs.forEach(function (t) { t.addEventListener("click", function () { load(t.dataset.prog); }); });
    load(tabs[0].dataset.prog);
  }
  document.querySelectorAll("[data-tracer]").forEach(initTracer);

  /* ---------- 6. Dadu (kelas 6) ---------- */
  const dice = document.querySelector("[data-dice]");
  if (dice) {
    let lemparan = 0;
    const face = dice.querySelector(".dice");
    const monD = dice.querySelector("[data-mon='dadu']");
    const monL = dice.querySelector("[data-mon='lemparan']");
    const total = dice.querySelector("[data-mon='total']");
    let jumlah = 0;
    dice.querySelector("[data-roll]").addEventListener("click", function () {
      const v = 1 + Math.floor(Math.random() * 6);
      lemparan++; jumlah += v;
      face.textContent = v;
      face.classList.remove("roll"); void face.offsetWidth; face.classList.add("roll");
      monD.textContent = v; monL.textContent = lemparan; total.textContent = jumlah;
      [monD, monL, total].forEach(function (m) {
        const p = m.parentNode; p.classList.remove("changed"); void p.offsetWidth; p.classList.add("changed");
      });
      beep("tick");
    });
    dice.querySelector("[data-roll-reset]").addEventListener("click", function () {
      lemparan = 0; jumlah = 0;
      face.textContent = "?"; monD.textContent = "0"; monL.textContent = "0"; total.textContent = "0";
    });
  }
})();
