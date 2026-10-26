/* =========================================================
   Mesin latihan soal bersama (kelas 4 & kelas 6)
   Pemakaian: RVLatihan.create(rootElement, GROUPS, { next: "#coba" })
   Skor: 1 poin per soal benar. Skor 0–100 = poin ÷ jumlah soal × 100.
   Jenis soal:
     pg, bs, isian, hitung, urut, multi, salah, jodoh (grup match)  -> kelas 4
     telusur, tabel, lengkapi, susun, salahflow                      -> kelas 6
     pg / bs / multi boleh memakai gambar flowchart (f: [...nodes])
   ========================================================= */
(function () {
  "use strict";

  function create(root, GROUPS, opts) {
  if (!root || !window.RV) return;
  opts = opts || {};
  const RV = window.RV;
  const KKM = Number(root.dataset.kkm || 85);

  /* ---------------- STATUS ---------------- */
  let state;          // { [no]: true/false } untuk soal yang sudah diperiksa
  let finished = false;
  const finishBtn = root.querySelector("[data-lat-finish]");
  let TOTAL = 0;
  GROUPS.forEach(function (g) { TOTAL += g.items.length; });
  const NEXT = opts.next || "#coba";
  const NEXT_LABEL = opts.nextLabel || "Lanjut ke game →";

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
  function flowBox(nodes, extra) { return '<div class="flow-box' + (extra ? " " + extra : "") + '">' + RV.renderFlow({ nodes: nodes }) + "</div>"; }
  function fig(it) { return it.f ? flowBox(it.f) : ""; }
  function inputNote(it) { return it.input ? '<div class="input-note">⌨️ Input: <b>' + RV.esc(it.input) + "</b></div>" : ""; }
  function cardShape(n) { return '<span class="ico">' + RV.flowShape(n.t, "", 60) + "</span><span>" + RV.esc(n.x.replace(/\n/g, " ")) + "</span>"; }
  function card(no, inner) {
    return '<div class="lat-q" data-no="' + no + '"><div class="lat-head"><span class="lat-num">' + no + "</span>" + inner + "</div></div>";
  }

  const R = {
    pg: function (it, no) {
      const opts = RV.shuffle(it.o.map(function (t, i) { return { t: t, ok: i === it.a }; }));
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + "</p>" + fig(it) + '<div class="q-opts">' +
        opts.map(function (o, j) { return '<button type="button" class="q-opt"' + (o.ok ? ' data-ok="1"' : "") + '><span class="q-key">' + "ABCD"[j] + "</span><span>" + o.t + "</span></button>"; }).join("") +
        '</div><div class="lat-slot"></div></div>');
    },
    bs: function (it, no) {
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + "</p>" + fig(it) + '<div class="bs-row">' +
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
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + "</p>" + fig(it) + '<div class="chip-row">' +
        opts.map(function (o) { return '<button type="button" class="chip-opt" aria-pressed="false" data-o="' + RV.esc(o) + '">' + RV.esc(o) + "</button>"; }).join("") +
        '</div><div class="btn-row"><button type="button" class="btn btn-primary" data-check>Periksa</button></div><div class="lat-slot"></div></div>');
    },
    telusur: function (it, no) {
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="lat-split">' + flowBox(it.f) +
        "<div>" + inputNote(it) + '<p class="lat-text">' + (it.ask || "Apa yang ditampilkan?") + "</p>" +
        '<div class="isian-row"><input type="text"' + (it.num ? ' inputmode="numeric"' : "") + ' class="lat-input mono" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Jawaban…" aria-label="Jawaban soal ' + no + '">' +
        '<button type="button" class="btn btn-primary" data-check>Periksa</button></div></div></div><div class="lat-slot"></div></div>');
    },
    tabel: function (it, no) {
      let k = 0;
      const head = "<tr>" + it.cols.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr>";
      const rows = it.rows.map(function (r) {
        return "<tr>" + r.map(function (cell) {
          if (cell && typeof cell === "object") {
            const id = k++;
            if (cell.sel) return '<td><select class="tbl-in" data-k="' + id + '"><option value="">pilih</option>' + cell.sel.map(function (o) { return "<option>" + RV.esc(o) + "</option>"; }).join("") + "</select></td>";
            return '<td><input type="text" inputmode="numeric" class="tbl-in" data-k="' + id + '" autocomplete="off" placeholder="?" aria-label="Isian tabel"></td>';
          }
          return "<td>" + RV.esc(cell) + "</td>";
        }).join("") + "</tr>";
      }).join("");
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="lat-split">' + flowBox(it.f) +
        '<div><div class="table-wrap tbl-latihan"><table><thead>' + head + "</thead><tbody>" + rows + "</tbody></table></div>" +
        '<div class="btn-row"><button type="button" class="btn btn-primary" data-check>Periksa tabel</button></div></div></div><div class="lat-slot"></div></div>');
    },
    lengkapi: function (it, no) {
      const correct = it.o[0];
      const opts = RV.shuffle(it.o);
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="lat-split"><div data-fb>' + flowBox(it.f) + "</div>" +
        '<div><p class="lat-text">Pilih isi kotak “?”:</p><div class="q-opts">' +
        opts.map(function (o, j) { return '<button type="button" class="q-opt"' + (o === correct ? ' data-ok="1"' : "") + '><span class="q-key">' + "ABCD"[j] + '</span><span class="mono-txt">' + RV.esc(o) + "</span></button>"; }).join("") +
        '</div></div></div><div class="lat-slot"></div></div>');
    },
    susun: function (it, no) {
      const all = it.steps.concat(it.extra ? [it.extra] : []);
      const order = RV.shuffle(all.map(function (c, i) { return i; }));
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="urut-wrap">' +
        '<div><p class="lat-sub">Kartu langkah' + (it.extra ? " (ada 1 pengecoh)" : "") + '</p><div class="cards">' +
        order.map(function (i) { return '<button type="button" class="step-card" data-c="' + i + '">' + cardShape(all[i]) + "</button>"; }).join("") + "</div>" +
        '<div class="btn-row" style="margin-top:12px"><button type="button" class="btn" data-undo>↶ Batalkan</button><button type="button" class="btn btn-primary" data-check>Periksa</button></div>' +
        '<p class="limit">Pilih <b>' + it.steps.length + "</b> kartu.</p></div>" +
        '<div><p class="lat-sub">Flowchart-mu</p><div data-ws></div></div>' +
        '</div><div class="lat-slot"></div></div>');
    },
    salahflow: function (it, no) {
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + "</p>" + flowBox(it.f, "salah-flow") + '<div class="lat-slot"></div></div>');
    },
    salah: function (it, no) {
      return card(no, '<div class="lat-main"><p class="lat-text">' + it.q + '</p><div class="steps-box inline salah-box">' + RV.renderSteps(it.k) + '</div><div class="lat-slot"></div></div>');
    }
  };

  function renderMatch(g, startNo) {
    const opts = '<option value="">' + (g.placeholder || "— pilih nama —") + "</option>" + g.options.map(function (o) { return '<option value="' + o + '">' + o + "</option>"; }).join("");
    let rows = "";
    g.items.forEach(function (it, i) {
      rows += '<div class="match-row" data-no="' + (startNo + i) + '"><span class="lat-num">' + (startNo + i) + "</span>" +
        (it.shape ? '<div class="match-shape">' + RV.flowShape(it.shape, it.x, it.shape === "dec" ? 150 : 170) + "</div>"
                  : '<div class="item-card mini"><span class="emo">' + it.emo + '</span><div><div class="val">' + RV.esc(it.val) + '</div><div class="desc">' + it.desc + "</div></div></div>") +
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
    if (it.type === "telusur") {
      const input = el.querySelector(".lat-input");
      const btn = el.querySelector("[data-check]");
      const check = function () {
        if (no in state) return;
        const v = input.value.trim();
        if (!v) { slot.innerHTML = '<div class="lat-fb info">Ketik jawabanmu dulu, ya.</div>'; input.focus(); return; }
        const clean = function (s) { return norm(s).replace(/["“”']/g, "").replace(/,/g, " ").replace(/\s+/g, " ").trim(); };
        const ok = it.a.some(function (a) { return clean(a) === clean(v); });
        input.disabled = true; btn.disabled = true;
        input.classList.add(ok ? "is-correct" : "is-wrong");
        say(ok, (ok ? "" : "Jawaban yang benar: <b>" + RV.esc(it.a[0]) + "</b>. ") + it.e);
      };
      btn.addEventListener("click", check);
      input.addEventListener("keydown", function (ev) { if (ev.key === "Enter") check(); });
    }
    if (it.type === "tabel") {
      const ins = el.querySelectorAll(".tbl-in");
      const answers = [];
      it.rows.forEach(function (r) { r.forEach(function (c) { if (c && typeof c === "object") answers.push(String(c.a)); }); });
      const btn = el.querySelector("[data-check]");
      btn.addEventListener("click", function () {
        if (no in state) return;
        const vals = Array.from(ins).map(function (x) { return x.value.trim(); });
        const empty = vals.filter(function (v) { return !v; }).length;
        if (empty) { slot.innerHTML = '<div class="lat-fb info">Masih ada ' + empty + " kotak tabel yang kosong.</div>"; return; }
        let right = 0;
        ins.forEach(function (x, i) {
          const ok = norm(vals[i]).replace(/\./g, "") === norm(answers[i]).replace(/\./g, "");
          x.disabled = true;
          x.classList.add(ok ? "is-correct" : "is-wrong");
          if (!ok) x.insertAdjacentHTML("afterend", '<small class="tbl-fix">' + RV.esc(answers[i]) + "</small>");
          if (ok) right++;
        });
        btn.disabled = true;
        const ok = right === answers.length;
        say(ok, (ok ? "" : right + " dari " + answers.length + " kotak benar. Satu soal tabel bernilai 1 poin jika semua kotaknya benar. ") + it.e);
      });
    }
    if (it.type === "lengkapi") {
      el.querySelectorAll(".q-opt").forEach(function (b) {
        b.addEventListener("click", function () {
          if (no in state) return;
          const ok = !!b.dataset.ok;
          el.querySelectorAll(".q-opt").forEach(function (x) {
            x.disabled = true;
            if (x.dataset.ok) x.classList.add("is-correct"); else if (x === b) x.classList.add("is-wrong");
          });
          const box = el.querySelector("[data-fb]");
          const blank = box.querySelector(".fn.blank");
          const id = blank ? blank.dataset.n : null;
          const filled = it.f.map(function (n) {
            const c = Object.assign({}, n, { blank: false });
            if (n.side) c.side = Object.assign({}, n.side, { blank: false });
            return c;
          });
          box.innerHTML = flowBox(filled);
          if (id !== null) { const g = box.querySelector('.fn[data-n="' + id + '"]'); if (g) g.classList.add("filled"); }
          say(ok, it.e);
        });
      });
    }
    if (it.type === "susun") {
      const all = it.steps.concat(it.extra ? [it.extra] : []);
      const need = it.steps.length;
      const ws = el.querySelector("[data-ws]");
      const pool = el.querySelectorAll("[data-c]");
      const undo = el.querySelector("[data-undo]");
      const btn = el.querySelector("[data-check]");
      let chosen = [];
      const START = { t: "start", x: "Mulai" }, END = { t: "end", x: "Selesai" };
      const draw = function () {
        ws.innerHTML = flowBox([START].concat(chosen.map(function (i) { return all[i]; })).concat(chosen.length === need ? [END] : []));
        pool.forEach(function (p) { p.disabled = (no in state) || chosen.indexOf(Number(p.dataset.c)) !== -1 || chosen.length >= need; });
        undo.disabled = (no in state) || !chosen.length;
      };
      pool.forEach(function (p) {
        p.addEventListener("click", function () { if (no in state || chosen.length >= need) return; chosen.push(Number(p.dataset.c)); RV.beep("tick"); slot.innerHTML = ""; draw(); });
      });
      undo.addEventListener("click", function () { chosen.pop(); draw(); });
      btn.addEventListener("click", function () {
        if (no in state) return;
        if (chosen.length < need) { slot.innerHTML = '<div class="lat-fb info">Pilih ' + need + " kartu dulu, ya. Sekarang baru " + chosen.length + ".</div>"; return; }
        const ok = chosen.every(function (c, i) { return c === i; });
        btn.disabled = true;
        const usedExtra = it.extra && chosen.indexOf(all.length - 1) !== -1;
        say(ok, (ok ? "" : (usedExtra ? "Kartu pengecoh “" + RV.esc(it.extra.x.replace(/\n/g, " ")) + "” ikut dipakai. " : "Urutannya belum tepat. ") + "Flowchart yang benar:" + flowBox([START].concat(it.steps).concat([END]), "in-fb")) + " " + it.e);
        draw();
      });
      draw();
    }
    if (it.type === "salahflow") {
      const gs = el.querySelectorAll(".fn");
      gs.forEach(function (g) {
        if (g.classList.contains("fn-start") || g.classList.contains("fn-end")) return;
        g.classList.add("pickable");
        g.setAttribute("role", "button");
        g.setAttribute("tabindex", "0");
        const pick = function () {
          if (no in state) return;
          const ok = g.dataset.n === String(it.a);
          gs.forEach(function (x) {
            x.classList.remove("pickable"); x.removeAttribute("tabindex");
            if (x.dataset.n === String(it.a)) x.classList.add("is-correct"); else if (x === g) x.classList.add("is-wrong");
          });
          say(ok, it.e);
        };
        g.addEventListener("click", pick);
        g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); pick(); } });
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
    const unit = g.unit || "pasangan";
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
      slot.innerHTML = '<div class="lat-fb ' + (right === g.items.length ? "ok" : "bad") + '"><span class="pt-chip ' + (right ? "plus" : "zero") + '">+' + right + ' poin</span><b>' + right + " dari " + g.items.length + " " + unit + " benar.</b> " +
        (right === g.items.length ? "Hebat, semuanya tepat!" : "Lihat tanda ❌ untuk jawaban yang benar.") + "</div>";
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
      body.querySelectorAll(".pickable").forEach(function (el) { el.classList.remove("pickable"); el.removeAttribute("tabindex"); el.style.pointerEvents = "none"; });
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
        '<div class="gs-actions"><button class="btn btn-primary" type="button" data-lat-reset>↺ Ulangi latihan</button><a class="btn" href="' + NEXT + '">' + NEXT_LABEL + '</a></div>' +
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
  }

  window.RVLatihan = { create: create };
})();
