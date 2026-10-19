/* =========================================================
   Ruang Variabel — skrip bersama
   (blok ala Scratch, flowchart, daftar isi, kuis, penelusur flowchart)
   ========================================================= */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- 1. Blok ala Scratch (dipakai kelas 4) ----------
     Satu baris = satu blok, format "jenis: teks". Jenis: event, var, ctrl, look, sense, op, else.
     Baris menjorok 2 spasi masuk ke dalam blok di atasnya.
     (isi) kotak isian · [nama] pilihan · {nama} variabel · {s:..} penginderaan · {o:..} operator · «..» kondisi */
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

  /* ---------- 2. Flowchart (SVG) ----------
     spec = { nodes: [ { t, x, ... } ] }
     t: "start" / "end" (terminal), "proc" (proses), "io" (input/output), "dec" (keputusan)
     x: teks (pakai \n untuk baris baru)
     Pada "dec":
       side: { t, x, label: "Ya", join: 0 }  -> cabang ke kanan, bergabung lagi sebelum node ke-(i+1+join)
       back: { to: indeks, label: "Tidak" }  -> panah kembali ke atas (perulangan)
     blank: true -> kotak kosong bertanda "?" */
  let flowUid = 0;
  const FH = { start: 44, end: 44, proc: 50, io: 50, dec: 84 };
  const MW = 178, SW = 140, GAP = 36, LOOPX = 12;

  /* Pecah teks panjang menjadi beberapa baris */
  function wrap(txt, max) {
    const out = [];
    String(txt).split("\n").forEach(function (line) {
      if (line.length <= max) { out.push(line); return; }
      let cur = "";
      line.split(" ").forEach(function (w) {
        if (cur && (cur + " " + w).length > max) { out.push(cur); cur = w; }
        else cur = cur ? cur + " " + w : w;
      });
      if (cur) out.push(cur);
    });
    return out;
  }
  function nodeH(t, lines) {
    if (t === "dec") return Math.max(FH.dec, lines * 18 + 44);
    if (t === "start" || t === "end") return FH[t];
    return Math.max(FH[t] || 50, lines * 18 + 16);
  }

  function shapeSvg(t, cx, top, w, h) {
    if (t === "start" || t === "end") return '<rect x="' + (cx - w / 2) + '" y="' + top + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '"/>';
    if (t === "io") {
      const k = 14;
      return '<polygon points="' + (cx - w / 2 + k) + "," + top + " " + (cx + w / 2) + "," + top + " " + (cx + w / 2 - k) + "," + (top + h) + " " + (cx - w / 2) + "," + (top + h) + '"/>';
    }
    if (t === "dec") {
      const hw = w / 2 + 16;
      return '<polygon points="' + cx + "," + top + " " + (cx + hw) + "," + (top + h / 2) + " " + cx + "," + (top + h) + " " + (cx - hw) + "," + (top + h / 2) + '"/>';
    }
    return '<rect x="' + (cx - w / 2) + '" y="' + top + '" width="' + w + '" height="' + h + '" rx="3"/>';
  }
  function textSvg(lines, cx, cy) {
    return lines.map(function (l, i) {
      return '<text x="' + cx + '" y="' + (cy + (i - (lines.length - 1) / 2) * 18) + '" text-anchor="middle" dominant-baseline="central">' + esc(l) + "</text>";
    }).join("");
  }
  function lbl(x, y, t, anchor) {
    return t ? '<text class="fl-lbl" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "start") + '">' + esc(t) + "</text>" : "";
  }
  function maxChars(t, w) { return Math.floor((t === "dec" ? w * 0.62 : w - 18) / 8.4); }

  function renderFlow(spec, opts) {
    opts = opts || {};
    const nodes = spec.nodes || spec;
    const hasBack = nodes.some(function (n) { return n.back; });
    const hasSide = nodes.some(function (n) { return n.side; });
    const CX = (hasBack ? 72 : 16) + MW / 2;
    let y = 8;
    const pos = nodes.map(function (n) {
      const lines = n.blank ? ["?"] : wrap(n.x, maxChars(n.t, MW));
      let h = nodeH(n.t, lines.length);
      let sideLines = null;
      if (n.side) {
        sideLines = n.side.blank ? ["?"] : wrap(n.side.x, maxChars(n.side.t || "proc", SW));
        h = Math.max(h, nodeH(n.side.t || "proc", sideLines.length) + 8);
      }
      const p = { y: y, h: h, cy: y + h / 2, lines: lines, sideLines: sideLines };
      y += h + GAP;
      return p;
    });
    const SX = CX + MW / 2 + 42 + SW / 2;
    const W = hasSide ? SX + SW / 2 + 6 : CX + MW / 2 + 52;
    const H = y - GAP + 10;
    const mid = "fa" + (++flowUid);
    const arrow = ' marker-end="url(#' + mid + ')"';
    let edges = "", shapes = "";
    function leftEdge(n) { return CX - MW / 2 - (n.t === "dec" ? 16 : n.t === "io" ? -7 : 0); }

    nodes.forEach(function (n, i) {
      const p = pos[i];
      const hi = opts.highlight !== undefined && String(opts.highlight) === String(i);
      shapes += '<g class="fn fn-' + n.t + (hi ? " active" : "") + (n.blank ? " blank" : "") + '" data-n="' + i + '">' +
        shapeSvg(n.t, CX, p.y, MW, p.h) + textSvg(p.lines, CX, p.cy) + "</g>";
      const next = nodes[i + 1];
      if (next && n.t !== "end" && !n.stop) {
        edges += '<line x1="' + CX + '" y1="' + (p.y + p.h) + '" x2="' + CX + '" y2="' + (pos[i + 1].y - 2) + '"' + arrow + "/>";
        let dl = n.down;
        if (n.t === "dec" && !dl) {
          const other = n.side ? n.side.label : n.back ? n.back.label : "";
          dl = other === "Ya" ? "Tidak" : other === "Tidak" ? "Ya" : "";
        }
        if (dl) edges += lbl(CX + 8, p.y + p.h + 16, dl);
      }
      if (n.side) {
        const s = n.side, hw = MW / 2 + 16;
        const sH = nodeH(s.t || "proc", p.sideLines.length), sTop = p.cy - sH / 2;
        edges += '<line x1="' + (CX + hw) + '" y1="' + p.cy + '" x2="' + (SX - SW / 2 - 2) + '" y2="' + p.cy + '"' + arrow + "/>" + lbl(CX + hw + 6, p.cy - 8, s.label || "Ya");
        const j = i + 1 + (s.join || 0);
        const jy = pos[j] ? pos[j].y - GAP / 2 : H - 4;
        edges += '<polyline points="' + SX + "," + (sTop + sH) + " " + SX + "," + jy + " " + (CX + 3) + "," + jy + '"' + arrow + "/>";
        const shi = opts.highlight !== undefined && String(opts.highlight) === i + "s";
        shapes += '<g class="fn fn-' + (s.t || "proc") + (shi ? " active" : "") + (s.blank ? " blank" : "") + '" data-n="' + i + 's">' +
          shapeSvg(s.t || "proc", SX, sTop, SW, sH) + textSvg(p.sideLines, SX, p.cy) + "</g>";
      }
      if (n.back) {
        const b = n.back, tgt = pos[b.to];
        const sx = n.t === "dec" ? CX - MW / 2 - 16 : leftEdge(n);
        edges += '<polyline points="' + sx + "," + p.cy + " " + LOOPX + "," + p.cy + " " + LOOPX + "," + tgt.cy + " " + (leftEdge(nodes[b.to]) - 2) + "," + tgt.cy + '"' + arrow + "/>" +
          lbl(sx - 6, p.cy - 8, b.label || "Tidak", "end");
      }
    });
    return '<svg class="flow" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" style="--fw:' + Math.min(W, 380) + 'px" role="img" aria-label="Flowchart">' +
      '<defs><marker id="' + mid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>' +
      '<g class="fl-edges">' + edges + "</g>" + shapes + "</svg>";
  }

  /* Satu simbol kecil (untuk tabel simbol & game) */
  function flowShape(t, text, w, h) {
    w = w || 150; h = h || (t === "dec" ? 70 : 48);
    const pad = t === "dec" ? 20 : 6;
    const vw = w + pad * 2 + 4, vh = h + 6;
    return '<svg class="flow flow-mini" viewBox="0 0 ' + vw + " " + vh + '" width="' + vw + '" role="img" aria-label="Simbol">' +
      '<g class="fn fn-' + t + '">' + shapeSvg(t, vw / 2, 3, w, h) + (text ? textSvg(wrap(text, maxChars(t, w)), vw / 2, 3 + h / 2) : "") + "</g></svg>";
  }

  function renderAll(scope) {
    scope = scope || document;
    scope.querySelectorAll("[data-script]").forEach(function (el) {
      el.innerHTML = renderScript(el.textContent);
      el.removeAttribute("data-script");
    });
    scope.querySelectorAll("[data-flow]").forEach(function (el) {
      const spec = window.FLOWS && window.FLOWS[el.dataset.flow];
      if (spec) el.innerHTML = renderFlow(spec);
      el.removeAttribute("data-flow");
    });
    scope.querySelectorAll("[data-shape]").forEach(function (el) {
      el.innerHTML = flowShape(el.dataset.shape, el.dataset.text || "", Number(el.dataset.w) || 150);
      el.removeAttribute("data-shape");
    });
  }
  renderAll();

  /* ---------- 3. Suara kecil ---------- */
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
    esc: esc, shuffle: shuffle, renderScript: renderScript, inline: parseInline,
    renderFlow: renderFlow, flowShape: flowShape, beep: beep, scrollToTop: scrollToTop,
    setSound: function (on) { soundOn = on; }, soundOn: function () { return soundOn; }
  };

  /* ---------- 4. Daftar isi aktif ----------
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

  /* ---------- 5. Kuis satu-per-satu dengan nilai & KKM ---------- */
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
          (q.f ? '<div class="flow-box">' + renderFlow(q.f) + "</div>" : "") +
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
      if (nilai === 100) msg = "Sempurna! Semua jawabanmu benar.";
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
          '<p class="mb-0">Nilai kuismu</p>' +
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

  /* ---------- 6. Penelusur flowchart (kelas 6) ---------- */
  function initFlowTracer(root) {
    const programs = window[root.dataset.flowTracer];
    if (!programs) return;
    const svgBox = root.querySelector("[data-flow-svg]");
    const varsEl = root.querySelector("[data-vars]");
    const outEl = root.querySelector("[data-out]");
    const noteEl = root.querySelector(".tracer-note");
    const countEl = root.querySelector(".step-count");
    const thead = root.querySelector(".trace-table thead");
    const tbody = root.querySelector(".trace-table tbody");
    const prevBtn = root.querySelector("[data-prev]");
    const nextBtn = root.querySelector("[data-next]");
    const resetBtn = root.querySelector("[data-reset]");
    const tabs = root.querySelectorAll(".seg button");
    let prog, step, varNames;

    function nodeText(n) {
      const s = String(n);
      const node = s.slice(-1) === "s" ? prog.flow.nodes[parseInt(s, 10)].side : prog.flow.nodes[n];
      return node.x.replace(/\n/g, " ");
    }
    function draw() {
      const cur = step >= 0 ? prog.steps[step] : null;
      svgBox.querySelectorAll(".fn").forEach(function (g) {
        g.classList.toggle("active", !!cur && g.dataset.n === String(cur.n));
      });
      const vals = {};
      const out = [];
      let rows = "";
      for (let i = 0; i <= step; i++) {
        const s = prog.steps[i];
        if (s.set) Object.keys(s.set).forEach(function (k) { vals[k] = s.set[k]; });
        if (s.out !== undefined) out.push(s.out);
        rows += "<tr" + (i === step ? ' class="now"' : "") + "><td>" + (i + 1) + "</td><td>" + esc(nodeText(s.n)) + (s.ans ? " → <b>" + s.ans + "</b>" : "") + "</td>" +
          varNames.map(function (k) {
            const changed = s.set && k in s.set;
            return "<td>" + (k in vals ? (changed ? "<b>" + esc(vals[k]) + "</b>" : esc(vals[k])) : "") + "</td>";
          }).join("") +
          "<td>" + (s.out !== undefined ? esc(s.out) : "") + "</td></tr>";
      }
      tbody.innerHTML = rows || '<tr><td colspan="' + (varNames.length + 3) + '" class="muted">Tekan “Mulai” untuk mengisi tabel.</td></tr>';
      const changedNow = cur && cur.set ? Object.keys(cur.set) : [];
      varsEl.innerHTML = varNames.map(function (k) {
        return '<span class="monitor' + (changedNow.indexOf(k) !== -1 ? " changed" : "") + '">' + esc(k) + " <b>" + (k in vals ? esc(vals[k]) : "–") + "</b></span>";
      }).join("");
      outEl.textContent = out.join("\n");
      noteEl.innerHTML = cur ? cur.note : prog.intro;
      countEl.textContent = "Langkah " + (step + 1) + " / " + prog.steps.length;
      prevBtn.disabled = step < 0;
      nextBtn.disabled = step >= prog.steps.length - 1;
      nextBtn.textContent = step < 0 ? "Mulai ▶" : "Berikutnya ▶";
      const nowRow = tbody.querySelector("tr.now");
      if (nowRow) {
        const wrap = tbody.closest(".table-wrap");
        wrap.scrollTop = nowRow.offsetTop - wrap.clientHeight + nowRow.offsetHeight + 40;
      }
    }
    function load(key) {
      prog = programs[key];
      step = -1;
      varNames = [];
      prog.steps.forEach(function (s) { if (s.set) Object.keys(s.set).forEach(function (k) { if (varNames.indexOf(k) === -1) varNames.push(k); }); });
      svgBox.innerHTML = renderFlow(prog.flow);
      thead.innerHTML = "<tr><th>No</th><th>Kotak yang dijalankan</th>" + varNames.map(function (k) { return "<th>" + esc(k) + "</th>"; }).join("") + "<th>Output</th></tr>";
      tabs.forEach(function (t) { t.classList.toggle("active", t.dataset.prog === key); });
      draw();
    }
    prevBtn.addEventListener("click", function () { if (step >= 0) { step--; draw(); } });
    nextBtn.addEventListener("click", function () { if (step < prog.steps.length - 1) { step++; draw(); } });
    resetBtn.addEventListener("click", function () { step = -1; draw(); });
    tabs.forEach(function (t) { t.addEventListener("click", function () { load(t.dataset.prog); }); });
    load(tabs[0].dataset.prog);
  }
  document.querySelectorAll("[data-flow-tracer]").forEach(initFlowTracer);
})();
