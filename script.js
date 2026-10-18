/* =========================================================
   Ruang Variabel — skrip bersama
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. Pewarnaan kode sederhana ---------- */
  const KEYWORDS = {
    py: new Set(["def", "return", "if", "elif", "else", "for", "in", "while", "and", "or", "not",
      "True", "False", "None", "global", "import", "from", "as", "pass", "break", "continue", "class"]),
    js: new Set(["let", "const", "var", "function", "return", "if", "else", "for", "while",
      "true", "false", "null", "undefined", "new", "typeof"])
  };
  const BUILTINS = {
    py: new Set(["print", "input", "int", "float", "str", "bool", "len", "type", "range", "list", "round", "sum"]),
    js: new Set(["console", "log", "Number", "String", "parseInt", "prompt", "alert", "Math"])
  };
  const PATTERNS = {
    py: /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g,
    js: /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g
  };

  function escapeHTML(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function highlight(src, lang) {
    const re = new RegExp(PATTERNS[lang].source, "g");
    let out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += escapeHTML(src.slice(last, m.index));
      const t = escapeHTML(m[0]);
      if (m[1]) out += '<span class="t-com">' + t + "</span>";
      else if (m[2]) out += '<span class="t-str">' + t + "</span>";
      else if (m[3]) out += '<span class="t-num">' + t + "</span>";
      else if (KEYWORDS[lang].has(m[0])) out += '<span class="t-kw">' + t + "</span>";
      else if (BUILTINS[lang].has(m[0])) out += '<span class="t-fn">' + t + "</span>";
      else out += t;
      last = re.lastIndex;
    }
    return out + escapeHTML(src.slice(last));
  }
  window.highlightCode = highlight;

  document.querySelectorAll("pre code[data-lang]").forEach(function (el) {
    const raw = el.textContent.replace(/^\n/, "").replace(/\s+$/, "");
    el.dataset.raw = raw;
    el.innerHTML = highlight(raw, el.dataset.lang);
  });

  /* Tombol salin */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const code = btn.closest(".code").querySelector("code");
      const text = code.dataset.raw || code.textContent;
      const done = function () {
        btn.textContent = "Tersalin ✓";
        setTimeout(function () { btn.textContent = "Salin"; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { btn.textContent = "Gagal"; });
      } else {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "Gagal"; }
        ta.remove();
      }
    });
  });

  /* ---------- 2. Daftar isi aktif ---------- */
  const tocLinks = Array.from(document.querySelectorAll(".toc a[href^='#']"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    const map = new Map();
    tocLinks.forEach(function (a) {
      const sec = document.querySelector(a.getAttribute("href"));
      if (sec) map.set(sec, a);
    });
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove("active"); });
          const link = map.get(e.target);
          link.classList.add("active");
          link.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach(function (_, sec) { obs.observe(sec); });
  }

  /* ---------- 3. Kuis ---------- */
  function initQuiz(root) {
    const data = window[root.dataset.quiz];
    if (!data) return;
    const list = root.querySelector(".quiz-list");
    const bar = root.querySelector(".quiz-bar span");
    const status = root.querySelector(".quiz-status");
    const result = root.querySelector(".quiz-result");
    let answered = 0, score = 0;

    function updateProgress() {
      bar.style.width = (answered / data.length * 100) + "%";
      status.textContent = answered + " dari " + data.length + " soal terjawab · Benar: " + score;
    }

    function showResult() {
      result.hidden = false;
      result.querySelector(".score").textContent = score + " / " + data.length;
      const pct = score / data.length;
      let msg;
      if (pct === 1) msg = "Sempurna! Kamu benar-benar paham tentang variabel.";
      else if (pct >= 0.7) msg = "Hebat! Pemahamanmu sudah kuat. Baca lagi penjelasan soal yang terlewat, ya.";
      else if (pct >= 0.4) msg = "Lumayan! Coba ulangi bagian materi yang masih membingungkan, lalu kerjakan lagi.";
      else msg = "Tidak apa-apa, belajar memang butuh proses. Baca ulang materinya, lalu coba lagi!";
      result.querySelector(".msg").textContent = msg;
    }

    function render() {
      answered = 0; score = 0;
      list.innerHTML = "";
      result.hidden = true;
      data.forEach(function (q, i) {
        const card = document.createElement("div");
        card.className = "q";
        card.innerHTML =
          '<p class="q-num">Soal ' + (i + 1) + "</p>" +
          '<p class="q-text">' + q.q + "</p>" +
          '<div class="q-opts" role="group"></div>' +
          '<p class="q-explain" hidden aria-live="polite"></p>';
        const opts = card.querySelector(".q-opts");
        q.o.forEach(function (opt, j) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "q-opt";
          b.innerHTML = '<span class="q-key">' + "ABCD"[j] + "</span><span>" + opt + "</span>";
          b.addEventListener("click", function () {
            if (card.dataset.done) return;
            card.dataset.done = "1";
            answered++;
            const ok = j === q.a;
            if (ok) score++;
            opts.querySelectorAll(".q-opt").forEach(function (x, k) {
              x.disabled = true;
              if (k === q.a) x.classList.add("is-correct");
              else if (k === j) x.classList.add("is-wrong");
            });
            const ex = card.querySelector(".q-explain");
            ex.hidden = false;
            ex.className = "q-explain " + (ok ? "ok" : "bad");
            ex.innerHTML = "<strong>" + (ok ? "Benar! " : "Belum tepat. ") + "</strong>" + q.e;
            updateProgress();
            if (answered === data.length) showResult();
          });
          opts.appendChild(b);
        });
        list.appendChild(card);
      });
      updateProgress();
    }

    root.querySelector(".quiz-reset").addEventListener("click", function () {
      render();
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    render();
  }
  document.querySelectorAll("[data-quiz]").forEach(initQuiz);

  /* ---------- 4. Kelas 4: game skor & nyawa ---------- */
  function blockHTML(kind, name, value) {
    if (kind === "atur") return '<span class="blk var">atur <span class="drop">' + name + '</span> ke <span class="slot">' + value + "</span></span>";
    return '<span class="blk var">ubah <span class="drop">' + name + '</span> sebesar <span class="slot">' + value + "</span></span>";
  }

  function bump(box) {
    box.classList.remove("bump");
    void box.offsetWidth;
    box.classList.add("bump");
  }

  const game = document.querySelector("[data-game]");
  if (game) {
    const st = { skor: 0, nyawa: 3 };
    const blockEl = game.querySelector("[data-block]");
    const msg = game.querySelector("[data-msg]");
    const playBtns = game.querySelectorAll("[data-act='bintang'], [data-act='permata'], [data-act='batu']");

    const show = function (n) {
      const box = game.querySelector('[data-var="' + n + '"]');
      box.querySelector(".vbox-value").textContent = st[n];
      bump(box);
    };
    const setPlayable = function (on) { playBtns.forEach(function (b) { b.disabled = !on; }); };

    const acts = {
      bintang: function () {
        st.skor += 1; show("skor");
        blockEl.innerHTML = blockHTML("ubah", "skor", "1");
        msg.textContent = "⭐ Dapat bintang! Isi variabel skor bertambah 1 menjadi " + st.skor + ".";
      },
      permata: function () {
        st.skor += 5; show("skor");
        blockEl.innerHTML = blockHTML("ubah", "skor", "5");
        msg.textContent = "💎 Dapat permata! Isi variabel skor bertambah 5 menjadi " + st.skor + ".";
      },
      batu: function () {
        st.nyawa -= 1; show("nyawa");
        blockEl.innerHTML = blockHTML("ubah", "nyawa", "-1");
        if (st.nyawa <= 0) {
          msg.textContent = "Nyawa habis! Skor akhirmu " + st.skor + ". Tekan “Main lagi” untuk mengisi ulang variabelnya.";
          setPlayable(false);
        } else {
          msg.textContent = "🪨 Terkena batu! Isi variabel nyawa berkurang 1 menjadi " + st.nyawa + ".";
        }
      },
      ulang: function () {
        st.skor = 0; st.nyawa = 3; show("skor"); show("nyawa");
        blockEl.innerHTML = blockHTML("atur", "skor", "0") + " " + blockHTML("atur", "nyawa", "3");
        msg.textContent = "Permainan dimulai lagi. Variabel diisi dengan nilai awal.";
        setPlayable(true);
      }
    };
    game.querySelectorAll("[data-act]").forEach(function (b) {
      b.addEventListener("click", function () { acts[b.dataset.act](); });
    });
  }

  /* ---------- 5. Kelas 4: buat kotakmu sendiri ---------- */
  const maker = document.querySelector("[data-maker]");
  if (maker) {
    const nameIn = maker.querySelector("[data-name]");
    const valIn = maker.querySelector("[data-value]");
    const box = maker.querySelector(".vbox");
    const fb = maker.querySelector(".feedback");
    const update = function () {
      const name = nameIn.value;
      const val = valIn.value;
      box.querySelector(".vbox-label").textContent = name || "…";
      box.querySelector(".vbox-value").textContent = val === "" ? "…" : val;
      bump(box);
      let cls = "ok", text = "";
      if (!name.trim()) { cls = "warn"; text = "Beri nama dulu untuk kotakmu."; }
      else if (/\s/.test(name)) { cls = "bad"; text = "Ada spasi di nama. Coba pakai garis bawah: " + name.trim().replace(/\s+/g, "_"); }
      else if (/^\d/.test(name)) { cls = "bad"; text = "Nama tidak boleh diawali angka. Coba pindahkan angkanya ke belakang."; }
      else if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) { cls = "bad"; text = "Pakai huruf, angka, dan garis bawah (_) saja, ya. Tanda seperti - ! ? . tidak dipakai."; }
      else if (name.length < 3) { cls = "warn"; text = "Nama sudah boleh, tapi kurang jelas. Coba nama yang menjelaskan isinya, misalnya “umur” atau “warna_favorit”."; }
      else { text = "Bagus! Variabel “" + name + "” sekarang berisi " + (val === "" ? "(belum ada isi)" : val) + "."; }
      fb.className = "feedback " + cls;
      fb.textContent = text;
    };
    nameIn.addEventListener("input", update);
    valIn.addEventListener("input", update);
    update();
  }

  /* ---------- 6. Kelas 6: cek nama variabel ---------- */
  const PY_KW = ["False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue",
    "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is",
    "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"];
  const PY_BUILTIN = ["print", "input", "int", "str", "float", "list", "len", "sum", "max", "min", "type", "range", "bool", "dict", "round"];

  function toSnake(s) { return s.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase(); }

  function checkName(name) {
    if (!name) return { cls: "warn", text: "Ketik sebuah nama variabel untuk diperiksa." };
    if (/\s/.test(name)) return { cls: "bad", text: "✗ Tidak valid: mengandung spasi. Python akan membacanya sebagai dua kata terpisah. Saran: " + name.trim().replace(/\s+/g, "_") };
    if (/^\d/.test(name)) {
      const digits = name.match(/^\d+/)[0];
      const rest = name.slice(digits.length).replace(/^_+/, "") || "data";
      return { cls: "bad", text: "✗ Tidak valid: diawali angka → SyntaxError. Saran: pindahkan angka ke belakang, misalnya " + rest + digits };
    }
    if (/-/.test(name)) return { cls: "bad", text: "✗ Tidak valid: tanda “-” dibaca sebagai operasi pengurangan. Saran: " + name.replace(/-/g, "_") };
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) return { cls: "bad", text: "✗ Tidak valid: hanya boleh huruf, angka, dan garis bawah (_). Simbol seperti . ! @ # $ % ? tidak diizinkan." };
    if (PY_KW.indexOf(name) !== -1) return { cls: "bad", text: "✗ Tidak valid: “" + name + "” adalah kata kunci (keyword) Python yang sudah punya arti khusus." };
    if (PY_BUILTIN.indexOf(name) !== -1) return { cls: "warn", text: "⚠ Valid, tapi berbahaya: “" + name + "” adalah nama fungsi bawaan Python. Jika dipakai sebagai variabel, fungsi aslinya tertimpa dan bisa memunculkan error." };
    if (/^[A-Z][A-Z0-9_]*$/.test(name) && name.length > 1) return { cls: "ok", text: "✓ Valid. Nama HURUF_KAPITAL biasanya dipakai untuk konstanta (nilai yang tidak diubah), misalnya NILAI_KKM." };
    if (/[a-z][A-Z]/.test(name)) return { cls: "ok", text: "✓ Valid, gaya camelCase (lazim di JavaScript). Di Python, gaya yang dianjurkan adalah snake_case: " + toSnake(name) };
    if (name.length === 1 && name !== "_") return { cls: "warn", text: "⚠ Valid, tapi kurang bermakna. Nama satu huruf hanya wajar untuk penghitung perulangan (i, j) atau rumus (x, y)." };
    if (/^_/.test(name)) return { cls: "ok", text: "✓ Valid. Diawali garis bawah biasanya menandakan variabel “internal” yang tidak untuk dipakai dari luar." };
    return { cls: "ok", text: "✓ Valid dan sesuai gaya snake_case Python. Pastikan namanya menjelaskan isinya." };
  }

  const checker = document.querySelector("[data-checker]");
  if (checker) {
    const input = checker.querySelector("input");
    const fb = checker.querySelector(".feedback");
    const run = function () {
      const r = checkName(input.value);
      fb.className = "feedback " + r.cls;
      fb.textContent = r.text;
    };
    input.addEventListener("input", run);
    checker.querySelectorAll("[data-try]").forEach(function (b) {
      b.addEventListener("click", function () { input.value = b.dataset.try; run(); input.focus(); });
    });
    run();
  }

  /* ---------- 7. Kelas 6: penelusur kode ---------- */
  const tracer = document.querySelector("[data-tracer]");
  if (tracer && window.TRACE_PROGRAMS) {
    const programs = window.TRACE_PROGRAMS;
    const codeEl = tracer.querySelector(".tracer-code");
    const tbody = tracer.querySelector("tbody");
    const outEl = tracer.querySelector(".tracer-out");
    const noteEl = tracer.querySelector(".tracer-note");
    const countEl = tracer.querySelector(".step-count");
    const prevBtn = tracer.querySelector("[data-prev]");
    const nextBtn = tracer.querySelector("[data-next]");
    const resetBtn = tracer.querySelector("[data-reset]");
    const tabs = tracer.querySelectorAll(".seg button");
    let prog, step;

    function stateAt(k) {
      const vars = {}, order = [], out = [];
      for (let i = 0; i <= k; i++) {
        const s = prog.steps[i];
        if (s.set) Object.keys(s.set).forEach(function (n) {
          if (!(n in vars)) order.push(n);
          vars[n] = s.set[n];
        });
        if (s.out) out.push(s.out);
      }
      return { vars: vars, order: order, out: out };
    }

    function draw() {
      const st = stateAt(step);
      const cur = step >= 0 ? prog.steps[step] : null;
      codeEl.querySelectorAll("li").forEach(function (li, i) {
        li.classList.toggle("active", !!cur && cur.line === i);
      });
      const changed = cur && cur.set ? Object.keys(cur.set) : [];
      if (!st.order.length) {
        tbody.innerHTML = '<tr class="tracer-empty"><td colspan="3">Belum ada variabel di memori.</td></tr>';
      } else {
        tbody.innerHTML = st.order.map(function (n) {
          const v = st.vars[n];
          return '<tr class="' + (changed.indexOf(n) !== -1 ? "changed" : "") + '"><td>' + escapeHTML(n) + "</td><td>" + escapeHTML(v[0]) + "</td><td>" + v[1] + "</td></tr>";
        }).join("");
      }
      outEl.textContent = st.out.join("\n");
      noteEl.innerHTML = cur ? cur.note : prog.intro;
      countEl.textContent = "Langkah " + (step + 1) + " / " + prog.steps.length;
      prevBtn.disabled = step < 0;
      nextBtn.disabled = step >= prog.steps.length - 1;
      nextBtn.textContent = step < 0 ? "Mulai ▶" : "Berikutnya ▶";
    }

    function load(key) {
      prog = programs[key];
      step = -1;
      codeEl.innerHTML = prog.lines.map(function (l) { return "<li>" + highlight(l, "py") + "</li>"; }).join("");
      tabs.forEach(function (t) { t.classList.toggle("active", t.dataset.prog === key); });
      draw();
    }

    prevBtn.addEventListener("click", function () { if (step >= 0) { step--; draw(); } });
    nextBtn.addEventListener("click", function () { if (step < prog.steps.length - 1) { step++; draw(); } });
    resetBtn.addEventListener("click", function () { step = -1; draw(); });
    tabs.forEach(function (t) { t.addEventListener("click", function () { load(t.dataset.prog); }); });
    load(tabs[0].dataset.prog);
  }
})();
