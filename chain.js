/* The Fig chain: one guitar riff played through the real Fig plugins in signal-chain order.
   Every on/off combination was rendered offline through the plugins themselves, level-matched,
   and is the same length, so switching a plugin while the riff plays keeps your place and you
   hear only what that plugin does. Builds itself inside every .rig-board on the page. */
(function () {
  var boards = Array.prototype.slice.call(document.querySelectorAll(".rig-board"));
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!boards.length || !AC) return;

  var BUY = "https://aldana-consulting-llc.moonbase.sh/buy/";
  var TRY = "https://aldana-consulting-llc.moonbase.sh/download/";
  var UNITS = [
    { id: "gut", name: "FigGutEQ", role: "Guitar EQ", page: "figguteq.html", slug: "figguteq", price: "$29", was: "$49" },
    { id: "amp", name: "FigAMP", role: "Amp, cab and pedals", page: "/", slug: "figamp", price: "$49", was: "$99" },
    { id: "strip", name: "FigSTRIP", role: "Channel strip", page: "figstrip.html", slug: "figstrip", price: "$49", was: "$99" },
    { id: "tech", name: "FigTECH EQ", role: "Tube program EQ", page: "figtecheq.html", slug: "figtecheq", price: "$79", was: "$129" },
    { id: "verb", name: "FigVERB", role: "Guitar reverb", page: "figverb.html", slug: "figverb", price: "Free", free: true }
  ];
  var RIFFS = {
    clean: {
      label: "Clean riff", amp: "Singer", dir: "/audio/chain/clean/",
      presets: { gut: "Clean Sparkle", amp: "Singer, Classic Singer, Gain 6", strip: "Electric Track", tech: "Stereo Gtr Spread", verb: "Clean Chamber" }
    },
    heavy: {
      label: "Heavy riff", amp: "Steel 50", dir: "/audio/chain/heavy/",
      presets: { gut: "Tight Low End", amp: "Steel 50, Modern Rhythm", strip: "Electric Track", tech: "Distorted Gtr Focus", verb: "Crunch Room" }
    }
  };

  var ctx = null, master = null;
  var cache = {};          // url -> Promise<AudioBuffer>
  var order = [];          // most recently used urls, for a small decoded-buffer cache
  var active = null;       // the board that owns playback

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }
  function ensureCtx() {
    if (!ctx) {
      // iPhone: play through the ringer switch, like the other audio on the site.
      try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
      ctx = new AC();
      master = ctx.createGain();
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    return ctx;
  }
  function load(url) {
    if (cache[url]) { touch(url); return cache[url]; }
    cache[url] = fetch(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.arrayBuffer();
    }).then(function (data) {
      return new Promise(function (res, rej) { ensureCtx().decodeAudioData(data, res, rej); });
    });
    cache[url].catch(function () { delete cache[url]; });
    touch(url);
    return cache[url];
  }
  function touch(url) {
    var i = order.indexOf(url);
    if (i > -1) order.splice(i, 1);
    order.unshift(url);
    while (order.length > 8) delete cache[order.pop()];
  }

  function Board(root) {
    var self = this;
    this.root = root;
    this.focus = root.getAttribute("data-focus") || "";
    this.riff = "clean";
    this.on = { gut: false, amp: true, strip: false, tech: false, verb: true };
    if (this.focus && this.focus !== "amp") {
      this.on = { gut: false, amp: true, strip: false, tech: false, verb: false };
      this.on[this.focus] = true;
    }
    this.playing = false;
    this.src = null; this.gain = null; this.buf = null;
    this.t0 = 0;            // context time at which the riff's position 0 played
    this.pausedAt = 0;
    this.want = 0;          // id of the latest switch request, so stale loads are ignored

    root.textContent = "";
    var top = el("div", "rig-top");
    var riffs = el("div", "rig-riffs");
    riffs.setAttribute("role", "group");
    riffs.setAttribute("aria-label", "Choose the riff");
    this.riffBtns = {};
    Object.keys(RIFFS).forEach(function (k) {
      var b = el("button", "rig-riff");
      b.type = "button";
      b.appendChild(el("strong", null, RIFFS[k].label));
      b.appendChild(el("span", null, "on FigAMP " + RIFFS[k].amp));
      b.addEventListener("click", function () { self.setRiff(k); });
      self.riffBtns[k] = b;
      riffs.appendChild(b);
    });
    top.appendChild(riffs);
    var tip = el("p", "rig-tip", "Tap any plugin to switch it in or out while it plays.");
    top.appendChild(tip);
    root.appendChild(top);

    var row = el("div", "rig-row");
    var jack = el("div", "rig-jack");
    jack.appendChild(el("span", "rig-jack-ico"));
    jack.appendChild(el("span", null, "Guitar DI"));
    row.appendChild(jack);
    this.unitBtns = {};
    UNITS.forEach(function (u) {
      row.appendChild(el("span", "rig-cable"));
      var b = el("button", "rig-unit" + (u.id === self.focus ? " rig-focus" : ""));
      b.type = "button";
      b.setAttribute("data-unit", u.id);
      var led = el("span", "rig-led");
      led.setAttribute("aria-hidden", "true");
      b.appendChild(led);
      b.appendChild(el("strong", null, u.name));
      b.appendChild(el("span", "rig-role", u.role));
      b.appendChild(el("span", "rig-preset"));
      var sw = el("span", "rig-switch");
      sw.setAttribute("aria-hidden", "true");
      b.appendChild(sw);
      b.appendChild(el("span", "rig-state"));
      b.addEventListener("click", function () { self.toggle(u.id); });
      self.unitBtns[u.id] = b;
      row.appendChild(b);
    });
    row.appendChild(el("span", "rig-cable"));
    var out = el("div", "rig-jack rig-out");
    out.appendChild(el("span", "rig-jack-ico"));
    out.appendChild(el("span", null, "Your mix"));
    row.appendChild(out);
    root.appendChild(row);

    var tr = el("div", "rig-transport");
    this.playBtn = el("button", "rig-play");
    this.playBtn.type = "button";
    this.playBtn.appendChild(el("span", "ico"));
    this.playLbl = el("span", "lbl", "Play the chain");
    this.playBtn.appendChild(this.playLbl);
    this.playBtn.addEventListener("click", function () { self.playing ? self.pause() : self.play(); });
    tr.appendChild(this.playBtn);
    var meter = el("div", "rig-meter");
    this.now = el("div", "rig-now");
    this.now.setAttribute("aria-live", "polite");
    meter.appendChild(this.now);
    var bar = el("div", "rig-bar");
    this.fill = el("i");
    bar.appendChild(this.fill);
    meter.appendChild(bar);
    tr.appendChild(meter);
    this.time = el("span", "rig-time", "0:00");
    tr.appendChild(this.time);
    root.appendChild(tr);

    this.get = el("div", "rig-get");
    root.appendChild(this.get);
    root.appendChild(el("p", "rig-note",
      "Every clip is Fig Audio's own DI riff run through the plugins themselves, one factory preset each " +
      "(on the clean riff, FigAMP's Classic Singer has its Gain at 6), level-matched so you hear tone, not volume. FigAMP's own delay and room are off here so FigVERB is the only space. " +
      "With FigAMP off you hear the dry DI."));

    this.render();
  }

  Board.prototype.url = function () {
    var r = RIFFS[this.riff], o = this.on;
    if (!o.amp) return r.dir + "di.mp3";
    return r.dir + (o.gut ? 1 : 0) + "" + (o.strip ? 1 : 0) + (o.tech ? 1 : 0) + (o.verb ? 1 : 0) + ".mp3";
  };

  Board.prototype.render = function () {
    var self = this, r = RIFFS[this.riff];
    Object.keys(this.riffBtns).forEach(function (k) {
      self.riffBtns[k].setAttribute("aria-pressed", k === self.riff ? "true" : "false");
    });
    UNITS.forEach(function (u) {
      var b = self.unitBtns[u.id], on = !!self.on[u.id];
      var bypassed = on && u.id !== "amp" && !self.on.amp;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("data-bypassed", bypassed ? "true" : "false");
      b.querySelector(".rig-preset").textContent = r.presets[u.id];
      b.querySelector(".rig-state").textContent = bypassed ? "Needs the amp" : on ? "On" : "Off";
      b.setAttribute("aria-label", u.name + ", " + u.role + ", " + (on ? "on" : "off") + ". Preset: " + r.presets[u.id]);
    });
    var chain = UNITS.filter(function (u) { return self.on[u.id] && self.on.amp; }).map(function (u) { return u.name; });
    this.now.textContent = chain.length ? "Now hearing: " + chain.join(" › ") : "Now hearing: the dry DI, no plugins";

    // What this chain costs, with a trial or download for each plugin in it.
    this.get.textContent = "";
    var inChain = UNITS.filter(function (u) { return self.on[u.id] && (u.id === "amp" || self.on.amp); });
    if (!inChain.length) return;
    this.get.appendChild(el("strong", "rig-get-h", "Get this chain"));
    var list = el("div", "rig-get-list");
    inChain.forEach(function (u) {
      var item = el("div", "rig-get-item");
      var name = el("a", null, u.name);
      name.href = u.page;
      item.appendChild(name);
      var p = el("span", "rig-get-price");
      if (u.was) { var s = el("s", "was", u.was); p.appendChild(s); p.appendChild(document.createTextNode(" ")); }
      p.appendChild(document.createTextNode(u.price));
      item.appendChild(p);
      if (!u.free) {
        var buy = el("a", "rig-get-buy", "Buy");
        buy.href = BUY + u.slug;
        item.appendChild(buy);
      }
      var a = el("a", "rig-get-try", u.free ? "Download free, Mac" : "Free trial");
      a.href = TRY + u.slug;
      item.appendChild(a);
      list.appendChild(item);
    });
    this.get.appendChild(list);
  };

  Board.prototype.position = function () {
    if (!this.buf) return this.pausedAt;
    if (!this.playing) return this.pausedAt;
    var d = this.buf.duration;
    return ((ctx.currentTime - this.t0) % d + d) % d;
  };

  // Starts the current combination at the riff's current position, crossfading from the old one.
  Board.prototype.switchTo = function () {
    var self = this, id = ++this.want, url = this.url();
    this.root.setAttribute("data-loading", "true");
    load(url).then(function (buf) {
      if (id !== self.want) return;
      self.root.removeAttribute("data-loading");
      var pos = self.position();
      self.buf = buf;
      if (!self.playing) { self.pausedAt = pos % buf.duration; return; }
      var now = ctx.currentTime, fade = 0.03;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(1, now + fade);
      g.connect(master);
      var s = ctx.createBufferSource();
      s.buffer = buf; s.loop = true;
      s.connect(g);
      s.start(now, pos % buf.duration);
      if (self.src) {
        self.gain.gain.cancelScheduledValues(now);
        self.gain.gain.setValueAtTime(self.gain.gain.value, now);
        self.gain.gain.linearRampToValueAtTime(0, now + fade);
        try { self.src.stop(now + fade + 0.01); } catch (e) {}
      }
      self.src = s; self.gain = g;
      self.t0 = now - (pos % buf.duration);
      self.preloadNeighbours();
    }).catch(function () {
      if (id !== self.want) return;
      self.root.removeAttribute("data-loading");
      self.now.textContent = "Couldn't load this clip. Try again in a moment.";
    });
  };

  // Fetch the clips one switch away, so the next tap is instant.
  Board.prototype.preloadNeighbours = function () {
    var self = this, saved = JSON.stringify(this.on);
    UNITS.forEach(function (u) {
      self.on[u.id] = !self.on[u.id];
      var url = self.url();
      self.on = JSON.parse(saved);
      if (!cache[url] && order.length < 8) load(url);
    });
  };

  Board.prototype.play = function () {
    ensureCtx();
    if (active && active !== this) active.pause();
    active = this;
    this.playing = true;
    this.t0 = ctx.currentTime - this.pausedAt;
    this.root.setAttribute("data-playing", "true");
    this.playLbl.textContent = "Pause";
    this.switchTo();
    this.tick();
  };

  Board.prototype.pause = function () {
    this.pausedAt = this.position();
    this.playing = false;
    this.want++;
    this.root.removeAttribute("data-playing");
    this.root.removeAttribute("data-loading");
    this.playLbl.textContent = "Play the chain";
    if (this.src && ctx) {
      var now = ctx.currentTime;
      this.gain.gain.setValueAtTime(this.gain.gain.value, now);
      this.gain.gain.linearRampToValueAtTime(0, now + 0.03);
      try { this.src.stop(now + 0.05); } catch (e) {}
    }
    this.src = null;
  };

  Board.prototype.tick = function () {
    var self = this;
    if (!this.playing) return;
    if (this.buf) {
      var p = this.position();
      this.fill.style.width = (100 * p / this.buf.duration).toFixed(2) + "%";
      this.time.textContent = fmt(p);
    }
    requestAnimationFrame(function () { self.tick(); });
  };

  Board.prototype.toggle = function (id) {
    this.on[id] = !this.on[id];
    this.render();
    if (this.playing) this.switchTo();
    else if (!ctx) { /* first touch: start playing so the tap is heard */ this.play(); }
    else this.switchTo();
  };

  Board.prototype.setRiff = function (k) {
    if (k === this.riff) return;
    this.riff = k;
    this.pausedAt = 0;
    this.t0 = ctx ? ctx.currentTime : 0;
    this.buf = null;
    this.render();
    if (this.playing) this.switchTo();
  };

  boards.forEach(function (b) { new Board(b); });
})();
