/* FigAMP audio demos: one player shared by every "Hear it" button on the page.
   Each clip is the same dry DI riff played through one amp's Classic Tone, so switching
   amps while it plays keeps your place in the riff and you hear only the amp change. */
(function () {
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".listen[data-src]"));
  if (!buttons.length) return;
  var audio = new Audio();
  audio.preload = "none";
  var current = null;

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function setState(btn, state) {
    btn.setAttribute("data-state", state);
    btn.setAttribute("aria-pressed", state === "playing" || state === "loading" ? "true" : "false");
    var lbl = btn.querySelector(".lbl");
    if (lbl) lbl.textContent = state === "playing" ? "Pause" : state === "loading" ? "Loading" : btn.getAttribute("data-label") || "Hear it";
  }

  function reset(btn) {
    setState(btn, "idle");
    var bar = btn.querySelector(".bar i");
    if (bar) bar.style.width = "0%";
    var t = btn.querySelector(".t");
    if (t && btn.getAttribute("data-dur")) t.textContent = btn.getAttribute("data-dur");
  }

  function play(btn) {
    var keepTime = 0;
    var sameRiff = current && current !== btn && !audio.paused &&
      current.getAttribute("data-riff") && current.getAttribute("data-riff") === btn.getAttribute("data-riff");
    if (sameRiff) keepTime = audio.currentTime;
    if (current && current !== btn) reset(current);
    if (current !== btn) {
      current = btn;
      audio.src = btn.getAttribute("data-src");
      if (keepTime) {
        var seek = function () { try { audio.currentTime = keepTime; } catch (e) {} audio.removeEventListener("loadedmetadata", seek); };
        audio.addEventListener("loadedmetadata", seek);
      }
    }
    setState(btn, "loading");
    var p = audio.play();
    if (p && p.catch) p.catch(function () { reset(btn); });
  }

  buttons.forEach(function (btn) {
    var t = btn.querySelector(".t");
    if (t) btn.setAttribute("data-dur", t.textContent);
    btn.setAttribute("data-label", (btn.querySelector(".lbl") || {}).textContent || "Hear it");
    reset(btn);
    btn.addEventListener("click", function () {
      if (current === btn && !audio.paused) { audio.pause(); return; }
      play(btn);
    });
  });

  audio.addEventListener("playing", function () { if (current) setState(current, "playing"); });
  audio.addEventListener("pause", function () { if (current && !audio.ended) setState(current, "paused"); });
  audio.addEventListener("ended", function () { if (current) reset(current); current = null; });
  audio.addEventListener("timeupdate", function () {
    if (!current) return;
    var bar = current.querySelector(".bar i"), t = current.querySelector(".t");
    if (bar && audio.duration) bar.style.width = (100 * audio.currentTime / audio.duration).toFixed(1) + "%";
    if (t) t.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener("error", function () {
    if (!current) return;
    var lbl = current.querySelector(".lbl");
    setState(current, "idle");
    if (lbl) lbl.textContent = "Couldn't load";
  });
})();
