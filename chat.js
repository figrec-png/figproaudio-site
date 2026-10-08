// FigAMP support assistant: answers common questions in the browser, no server needed.
(function () {
  var EMAIL = "support@figproaudio.com";
  var BUY = "https://aldana-consulting-llc.moonbase.sh/buy/figamp";
  var STORE = "https://aldana-consulting-llc.moonbase.sh";
  var mail = '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>';

  var FAQ = [
    { id: "install-mac", label: "Install on Mac",
      keys: ["install mac", "mac install", "macos", "component", "au ", "audio unit", "copy", "where do i put", "install"],
      answer: "On a Mac, unzip the download and double-click FigAMP-1.2.1.pkg. The installer is signed and notarized by Apple, so there are no security warnings; it asks for your Mac password and puts the Audio Unit, VST3 and standalone app in the right places. Then restart your DAW. (The loose .component, .vst3 and .app files are also in the zip if you prefer to copy them by hand.)" },
    { id: "install-win", label: "Install on Windows",
      keys: ["windows", "pc", "vst3 folder", "program files", "exe", "install windows"],
      answer: "On Windows, unzip the download and run FigAMP-1.2.1-Setup.exe. It installs the VST3 plugin into C:\\Program Files\\Common Files\\VST3 and the standalone app into Program Files, with a Start menu entry and an uninstaller. No extra Microsoft runtime download is needed. Then restart your DAW and rescan plugins if it asks." },
    { id: "smartscreen", label: "Windows protected your PC",
      keys: ["smartscreen", "protected your pc", "windows protected", "run anyway", "unknown publisher", "blocked"],
      answer: "That blue \"Windows protected your PC\" screen can appear the first time you run the FigAMP setup file or the standalone app, because it is a new publisher to Windows. Click More info, then Run anyway. It never affects the plugin inside your DAW." },
    { id: "mac-warning", label: "Mac says it can't be opened",
      keys: ["cannot be opened", "can't be opened", "damaged", "unidentified developer", "gatekeeper", "apple could not verify", "malware", "security warning"],
      answer: "FigAMP installs from a .pkg that is signed and notarized by Apple, so macOS should not warn at all. If you still see a warning (for example from an older download), open System Settings › Privacy & Security, scroll down and click Open Anyway next to the FigAMP message." },
    { id: "activate", label: "Activate my licence",
      keys: ["activate", "activation", "licence", "license", "serial", "key", "unlock", "register", "sign in", "login", "log in"],
      answer: "Open FigAMP and click Buy / Activate in the top right. Sign in with the account you bought with, and FigAMP activates on that computer. You can also activate offline with a machine file from your account page." },
    { id: "trial", label: "Free trial",
      keys: ["trial", "demo", "try", "free", "expire", "expired", "14 day", "days left", "trial ended"],
      answer: "FigAMP has a free, fully featured 14-day trial: <a href=\"" + STORE + "\">get it here</a>. When the trial ends, FigAMP passes your guitar through dry until you activate a licence. Your sessions and settings are kept." },
    { id: "price", label: "Price and buying",
      keys: ["price", "cost", "how much", "buy", "purchase", "sale", "discount", "pay", "checkout", "\\$"],
      answer: "FigAMP is on sale for $49 (MSRP $99). It's a one-time purchase that's yours to keep. <a href=\"" + BUY + "\">Buy FigAMP</a>." },
    { id: "mic", label: "App doesn't hear my guitar",
      keys: ["no sound", "no input", "silence", "silent", "doesn't hear", "can't hear", "microphone", "mic", "input", "interface", "apollo", "focusrite", "audio settings"],
      answer: "In the standalone app:\n1. On a Mac, allow microphone access: System Settings › Privacy & Security › Microphone, switch FigAMP on, then reopen the app.\n2. In the app's audio settings, pick your audio interface and the input your guitar is plugged into.\nIn a DAW, set the track's input to your guitar's input and arm or monitor the track." },
    { id: "daw", label: "My DAW doesn't show FigAMP",
      keys: ["daw", "not showing", "doesn't show", "can't find", "missing", "rescan", "scan", "luna", "logic", "ableton", "reaper", "cubase", "studio one", "fl studio", "garageband", "pro tools", "aax"],
      answer: "Restart your DAW after installing and run its plugin rescan. On a Mac, LUNA, Logic and GarageBand use the Audio Unit version, and most other DAWs use VST3. Pro Tools needs AAX, which FigAMP doesn't support yet." },
    { id: "system", label: "System requirements",
      keys: ["requirement", "system", "compatible", "apple silicon", "m1", "m2", "m3", "m4", "intel", "windows 10", "windows 11", "linux", "ipad", "ios", "formats", "vst", "standalone"],
      answer: "Mac: macOS 11 or later, Apple Silicon or Intel. Audio Unit, VST3 and standalone app.\nWindows: Windows 10 or 11, 64-bit. VST3 and standalone app.\nThere's no Linux, iPad or AAX version yet." },
    { id: "computers", label: "How many computers?",
      keys: ["how many computers", "two computers", "second computer", "laptop", "another computer", "new computer", "move", "transfer", "deactivate"],
      answer: "Your licence is for your own computers. Activate each one by signing in from the Buy / Activate button. Moving to a new computer and running out of activations? Email " + mail + " and we'll sort it out." },
    { id: "presets", label: "Save my own presets",
      keys: ["preset", "presets", "save", "my presets", "delete preset", "presets folder", "favorite", "favourite", "my sound"],
      answer: "Dial in a sound, open the Preset menu and choose Save preset…. Name it and it appears under My presets in the same menu, in the plugin and the app. Delete preset and Show presets folder are right below. Presets live in Library › Audio › Presets › Fig Audio › FigAMP on a Mac and %APPDATA%\\Fig Audio\\FigAMP\\Presets on Windows." },
    { id: "comp", label: "The Compressor",
      keys: ["compressor", "comp", "sustain", "squash", "squeeze", "dynamics", "even out", "picking"],
      answer: "The Compressor is a pedal-style compressor in front of the amp. Switch it on, turn Sustain up for longer notes and more even picking, and set Level for how hard the signal hits the amp (5 is about unity). Factory presets leave it off; your own presets remember it." },
    { id: "ir", label: "Load my own cabinet IR",
      keys: ["ir", "impulse", "cab", "cabinet", "wav", "speaker"],
      answer: "Yes, you can use your own impulse responses. In the Cabinet section, click Load IR… and pick a .wav file. Mic Position works with the built-in cabinets." },
    { id: "refund", label: "Refunds",
      keys: ["refund", "money back", "return", "cancel"],
      answer: "Please try the free 14-day trial first to make sure FigAMP works on your system. If something goes wrong after you buy, email " + mail + " and we'll make it right." },
    { id: "human", label: "Talk to a person",
      keys: ["human", "person", "contact", "email", "support", "help me", "agent", "talk"],
      answer: "Email " + mail + " with your computer (Mac or Windows), your DAW and what's happening, and we'll get back to you." }
  ];

  var GREETING = "Hi! I'm the FigAMP support assistant. Pick a topic or type your question.";
  var STARTERS = ["install-mac", "install-win", "activate", "mic", "daw", "price"];
  var FALLBACK = "I'm not sure about that one. Try one of these topics, or email " + mail + " and we'll help you directly.";

  function norm(s) { return " " + s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ") + " "; }

  function match(q) {
    var t = norm(q), best = null, bestScore = 0;
    FAQ.forEach(function (f) {
      var score = 0;
      f.keys.forEach(function (k) {
        if (k === "\\$") { if (t.indexOf("$") >= 0) score += 1; return; }
        if (t.indexOf(k) >= 0) score += k.length > 6 ? 3 : (k.trim().length <= 3 ? 1 : 2);
      });
      if (score > bestScore) { bestScore = score; best = f; }
    });
    return bestScore > 0 ? best : null;
  }

  var launch = document.createElement("button");
  launch.className = "fb-launch";
  launch.setAttribute("aria-expanded", "false");
  launch.setAttribute("aria-controls", "fb-panel");
  launch.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Help';

  var panel = document.createElement("div");
  panel.className = "fb-panel";
  panel.id = "fb-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "FigAMP support");
  panel.innerHTML =
    '<div class="fb-head"><img src="img/logo.png" alt=""><div><strong>FigAMP Support</strong><span>Answers to common questions</span></div>' +
    '<button class="fb-close" aria-label="Close">×</button></div>' +
    '<div class="fb-log" aria-live="polite"></div>' +
    '<form class="fb-form"><input type="text" placeholder="Type your question…" aria-label="Your question" maxlength="300"><button type="submit">Ask</button></form>';

  document.body.appendChild(panel);
  document.body.appendChild(launch);

  var log = panel.querySelector(".fb-log");
  var input = panel.querySelector("input");
  var started = false;

  function add(html, who) {
    var d = document.createElement("div");
    d.className = "fb-msg " + (who === "user" ? "fb-user" : "fb-bot");
    if (who === "user") d.textContent = html; else d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function chips(ids) {
    var wrap = document.createElement("div");
    wrap.className = "fb-chips";
    ids.forEach(function (id) {
      var f = FAQ.filter(function (x) { return x.id === id; })[0];
      if (!f) return;
      var b = document.createElement("button");
      b.type = "button"; b.className = "fb-chip"; b.textContent = f.label;
      b.onclick = function () { ask(f.label, f); };
      wrap.appendChild(b);
    });
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  function ask(text, forced) {
    add(text, "user");
    var f = forced || match(text);
    setTimeout(function () {
      if (f) {
        add(f.answer, "bot");
        chips(f.id === "human" ? STARTERS : ["human"]);
      } else {
        add(FALLBACK, "bot");
        chips(STARTERS.concat(["smartscreen", "trial"]));
      }
    }, 250);
  }

  function open(on) {
    panel.classList.toggle("open", on);
    launch.setAttribute("aria-expanded", on ? "true" : "false");
    if (on && !started) { started = true; add(GREETING, "bot"); chips(STARTERS); }
    if (on) input.focus();
  }

  launch.onclick = function () { open(!panel.classList.contains("open")); };
  panel.querySelector(".fb-close").onclick = function () { open(false); launch.focus(); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) open(false); });
  panel.querySelector("form").onsubmit = function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = "";
    ask(q);
  };
})();
