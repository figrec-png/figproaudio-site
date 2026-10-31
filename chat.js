// Fig Pro Audio assistant: a plugin finder plus answers to common questions,
// on every page, in the browser, with no server.
// Prices and versions here must match the product pages. Update both together.
(function () {
  var script = document.currentScript || document.querySelector('script[src$="chat.js"]');
  var BASE = new URL(".", script ? script.src : location.href).href; // site root
  function url(p) { return new URL(p, BASE).href; }

  var EMAIL = "support@figproaudio.com";
  var STORE = "https://aldana-consulting-llc.moonbase.sh";
  var mail = '<a href="mailto:' + EMAIL + '">' + EMAIL + "</a>";

  // ---------- Products ----------
  var P = {
    figamp: {
      name: "FigAMP", role: "Guitar amp", page: "./", img: "img/figamp-1.4.0.jpg",
      price: 49, msrp: 99, priceNote: "On sale", mac: true, win: true,
      line: "Eight touch-sensitive classic amps, guitar and bass cabinets, compressor, delay and room in one window.",
      install: { mac: "run the installer, FigAMP-1.5.2-Mac.pkg. It's signed and notarized by Apple, asks for your Mac password and puts the Audio Unit, VST3 and standalone app in the right places.",
        win: "run FigAMP-1.5.2-Windows-Setup.exe. It installs the VST3 into C:\\Program Files\\Common Files\\VST3 and the standalone app into Program Files, with a Start menu entry and an uninstaller. No extra Microsoft runtime is needed." },
      activate: "click Buy / Activate in the top right of FigAMP",
      formats: "Mac: macOS 11 or later, Apple Silicon or Intel, Audio Unit, VST3 and standalone. Windows: 10 or 11, 64-bit, VST3 and standalone."
    },
    figguteq: {
      name: "FigGutEQ", role: "Guitar EQ", page: "figguteq.html", img: "img/figguteq-1.0.0.png",
      price: 29, msrp: 49, priceNote: "Launch price", mac: true, win: true,
      line: "Eight bands named for where a guitar lives, plus Pick Attack and Tuning Lock. Zero latency.",
      install: { mac: "run the FigGutEQ Mac installer (.pkg). It's signed and notarized by Apple, asks for your Mac password and installs the Audio Unit, VST3 and standalone app.",
        win: "run the FigGutEQ Windows setup. It installs FigGutEQ.vst3 into C:\\Program Files\\Common Files\\VST3 and the standalone app, with an uninstaller." },
      activate: "click Buy / Activate in the top right of FigGutEQ",
      formats: "Mac: macOS 11 or later, Apple Silicon or Intel, Audio Unit, VST3 and standalone. Windows: 10 or 11, 64-bit, VST3 and standalone."
    },
    figstrip: {
      name: "FigSTRIP", role: "Channel strip", page: "figstrip.html", img: "img/figstrip-channel-1.0.2.png", tall: true,
      price: 49, msrp: 99, priceNote: "Launch price", mac: true, win: true,
      line: "Preamp, filters, dynamics, two EQs and tape in any order on every track, plus a Bus mode with its own glue compressor.",
      install: { mac: "run the FigSTRIP Mac installer (.pkg). It's signed and notarized by Apple, asks for your Mac password and installs the Audio Unit, VST3 and standalone app.",
        win: "run the FigSTRIP Windows setup. It installs FigSTRIP.vst3 into C:\\Program Files\\Common Files\\VST3 and the standalone app, with an uninstaller." },
      activate: "click Buy / Activate in the top right of FigSTRIP",
      formats: "Mac: macOS 11 or later, Apple Silicon or Intel, Audio Unit, VST3 and standalone. Windows: 10 or 11, 64-bit, VST3 and standalone."
    },
    figtecheq: {
      name: "FigTECH EQ", role: "Tube program EQ", page: "figtecheq.html", img: "img/figtecheq-1.0.0.png",
      price: 79, msrp: 129, priceNote: "Introductory price", mac: true, win: true,
      line: "Two 1960s-style passive tube program EQs racked as a pair, in Link, Dual or Mid-Side.",
      install: { mac: "run the FigTECH EQ Mac installer (.pkg). It's signed and notarized by Apple; its Customize page lists the Audio Unit, VST3 and CLAP plugins and the standalone app, all ticked, so untick any you don't want.",
        win: "run the FigTECH EQ Windows setup. It installs the VST3 and CLAP plugins and the standalone app, each optional, with an uninstaller." },
      activate: "click TRIAL in the top bar of FigTECH EQ, or use the gear menu",
      formats: "Mac: macOS 12 or later, Apple Silicon or Intel, Audio Unit, VST3, CLAP and standalone. Windows: 10 or 11, 64-bit, VST3, CLAP and standalone."
    },
    figverb: {
      name: "FigVERB", role: "Free guitar reverb", page: "figverb.html", img: "img/figverb-1.0.0.png",
      price: 0, mac: true, win: false,
      line: "A studio reverb made for guitar: Hall, Plate, Room, Chamber and Ambience, with Low Cut and Duck. Free, no time limit.",
      install: { mac: "run the installer, FigVERB-1.0.0-Mac.pkg. It's signed and notarized by Apple, asks for your Mac password and installs the Audio Unit and VST3.",
        win: "FigVERB is Mac only for now, so there's no Windows installer." },
      activate: "click ACTIVATE FREE in FigVERB, then sign in with your Fig Pro Audio account or make one for free",
      formats: "Mac only: macOS 11 or later, Apple Silicon or Intel, Audio Unit and VST3."
    }
  };
  var ORDER = ["figamp", "figguteq", "figstrip", "figtecheq", "figverb"];
  Object.keys(P).forEach(function (id) {
    P[id].id = id;
    P[id].buy = STORE + "/buy/" + id;
    P[id].trial = STORE + "/download/" + id;
  });

  // ---------- What the visitor is working on ----------
  var INTENTS = {
    guitar: { label: "Recording guitar", title: "A full guitar rig: EQ, amp and reverb",
      chain: [["figguteq", "In PRE AMP mode in front of the amp: tighten the low end and shape the pick attack the amp hears."],
              ["figamp", "The amp: pick one of eight, press Classic Tone and play. Cabinet, delay and room are built in."],
              ["figverb", "After the amp: a studio hall, plate or chamber behind your tone. Free."]],
      guide: ["guides/clean-di-guitar-signal/", "Get a clean DI signal first"] },
    bass: { label: "Playing bass", title: "Real amp grit that keeps the low end",
      chain: [["figamp", "Bass Mode lets a low B through every amp, with 4x10 and 1x15 bass cabinets, a Blend knob for your clean DI and a bass preset for every amp."],
              ["figstrip", "Finish the bass track in the mix: compressor, two EQs and tape, with bass presets."]],
      guide: ["guides/record-bass-di-and-amp-at-home/", "Record bass DI and amp at home"] },
    recorded: { label: "Guitar already recorded", title: "Fix and place a guitar that's already recorded",
      chain: [["figguteq", "In POST AMP mode: tame fizz, cut mud and sit the guitar in the mix in a couple of clicks."],
              ["figverb", "Put the guitar in a real space without washing out the mix. Free."]],
      guide: ["guides/amp-sim-tone-for-the-mix/", "Make an amp sim tone sit in the mix"] },
    mixing: { label: "Mixing every track", title: "A recording chain on every track",
      chain: [["figstrip", "The everyday strip for vocals, drums, bass, guitar and keys: preamp, filters, compressor and gate, two EQs and tape, with 32 presets."],
              ["figtecheq", "Broad, musical tube EQ moves on kick, bass, vocals and buses, including the low boost and cut trick."]],
      guide: ["guides/getting-started-with-figstrip/", "Getting started with FigSTRIP"] },
    master: { label: "Mix bus and mastering", title: "Glue and polish on the mix bus",
      chain: [["figstrip", "Flip to Bus mode for a glue compressor built for mix buses, drum buses and stems, with Mix for parallel compression."],
              ["figtecheq", "Mid-Side mode: add weight to the centre and air to the edges, then decode back to left and right."]],
      guide: ["guides/getting-started-with-figtecheq/", "Getting started with FigTECH EQ"] },
    free: { label: "Something free", title: "Free, with no time limit",
      chain: [["figverb", "A big studio reverb made for guitar. No trial and no time limit, activated with a free account."]] }
  };
  var INTENT_ORDER = ["guitar", "bass", "recorded", "mixing", "master", "free"];

  // ---------- Questions and answers ----------
  // answer(p, plat) gets the product in context and "mac", "win" or "" when unknown.
  var FAQ = [
    { id: "install", label: "How do I install it?", perProduct: true,
      keys: ["install", "installer", "pkg", "setup", "where do i put", "copy", "component", "vst3 folder", "program files"],
      answer: function (p, plat) {
        var s = "";
        if (plat !== "win") s += "On a Mac, " + p.install.mac + "\n";
        if (plat !== "mac") s += "On Windows, " + p.install.win + "\n";
        return s + "Then restart your DAW and rescan plugins if it asks." }, also: ["activate", "daw"] },
    { id: "smartscreen", label: "\"Windows protected your PC\"",
      keys: ["smartscreen", "protected your pc", "windows protected", "run anyway", "unknown publisher", "blocked"],
      answer: function () { return "That blue \"Windows protected your PC\" screen can appear the first time you run a Fig Pro Audio setup file or standalone app, because we're a new publisher to Windows. Click More info, then Run anyway. It never affects the plugin inside your DAW."; } },
    { id: "mac-warning", label: "Mac says it can't be opened",
      keys: ["cannot be opened", "can't be opened", "damaged", "unidentified developer", "gatekeeper", "apple could not verify", "malware", "security warning"],
      answer: function () { return "Every Fig Pro Audio Mac installer is signed and notarized by Apple, so macOS shouldn't warn at all. If you still see a warning (for example from an older download), open System Settings › Privacy & Security, scroll down and click Open Anyway next to the message."; } },
    { id: "activate", label: "Activate my licence", perProduct: true,
      keys: ["activate", "activation", "licence", "license", "serial", "key", "unlock", "register", "sign in", "login", "log in", "account"],
      answer: function (p) { return "To activate, " + p.activate + ". Sign in with the account you bought with, and it activates on that computer. One Fig Pro Audio account covers every plugin, and you can also activate offline with a machine file from your account page."; } },
    { id: "trial", label: "Free trials",
      keys: ["trial", "demo", "try", "expire", "expired", "14 day", "days left", "trial ended", "evaluate"],
      answer: function () { return "Every paid plugin has a free, fully featured 14-day trial, and FigVERB is simply free.\nWhen a trial ends, FigAMP, FigGutEQ and FigSTRIP pass your audio through unprocessed until you activate. FigTECH EQ keeps working but drops out for two seconds every 45 seconds. Your sessions and settings are kept."; },
      cards: function (p) { return pageProduct || state.product ? [] : ["figamp", "figguteq", "figstrip", "figtecheq"]; } },
    { id: "price", label: "Prices",
      keys: ["price", "cost", "how much", "buy", "purchase", "sale", "discount", "pay", "checkout", "cheap", "\\$"],
      answer: function () { return "Every plugin is a one-time purchase, not a subscription:\n" + ORDER.map(function (id) { var p = P[id]; return "• " + p.name + ": " + priceText(p); }).join("\n") + "\nMoonbase takes the payment as our reseller, and every paid plugin has a 14-day trial first."; } },
    { id: "free", label: "Is anything free?",
      keys: ["free", "no cost", "freebie", "gratis"],
      answer: function (p, plat) { return plat === "win" ? "FigVERB is our free plugin, but it's Mac only for now. On Windows, every paid plugin has a fully featured 14-day trial." : "Yes, FigVERB is free: a studio reverb made for guitar, with no trial and no time limit. Click ACTIVATE FREE inside it and sign in with a free account."; },
      cards: function (p, plat) { return plat === "win" ? [] : ["figverb"]; } },
    { id: "mic", label: "App doesn't hear my guitar",
      keys: ["no sound", "no input", "silence", "silent", "doesn't hear", "can't hear", "microphone", "mic access", "input", "interface", "apollo", "focusrite", "audio settings"],
      answer: function () { return "In a standalone app:\n1. On a Mac, allow microphone access: System Settings › Privacy & Security › Microphone, switch the app on, then reopen it.\n2. In the app's audio settings, pick your audio interface and the input your guitar is plugged into.\nIn a DAW, set the track's input to your guitar's input and arm or monitor the track."; } },
    { id: "daw", label: "My DAW doesn't show it",
      keys: ["daw", "not showing", "doesn't show", "can't find", "missing", "rescan", "scan", "luna", "logic", "ableton", "reaper", "cubase", "studio one", "fl studio", "garageband", "pro tools", "aax"],
      answer: function () { return "Restart your DAW after installing and run its plugin rescan. On a Mac, LUNA, Logic and GarageBand use the Audio Unit version, and most other DAWs use VST3 (FigTECH EQ also comes as CLAP). Pro Tools needs AAX, which our plugins don't support yet."; } },
    { id: "system", label: "System requirements", perProduct: true,
      keys: ["requirement", "system", "compatible", "apple silicon", "m1", "m2", "m3", "m4", "intel", "windows 10", "windows 11", "linux", "ipad", "ios", "format", "clap", "standalone", "macos"],
      answer: function (p) { return p.name + ". " + p.formats + "\nThere's no Linux, iPad or AAX version of any Fig Pro Audio plugin yet."; } },
    { id: "computers", label: "How many computers?",
      keys: ["how many computers", "two computers", "second computer", "laptop", "another computer", "new computer", "move", "transfer", "deactivate", "mac and windows", "both"],
      answer: function () { return "Your licence is for your own computers, Mac and Windows alike. Activate each one by signing in from inside the plugin. Moving to a new computer and run out of activations? Email " + mail + " and we'll sort it out."; } },
    { id: "refund", label: "Refunds",
      keys: ["refund", "money back", "return", "cancel"],
      answer: function () { return "Purchases are final, because every paid plugin has a fully featured 14-day trial as the evaluation period. Please run the trial on the computer and DAW you plan to use before you buy. If something you bought won't install, activate or run on a supported system, email " + mail + " and we'll work with you to get it running. Details are in our <a href=\"" + url("terms.html") + "\">terms</a>."; } },
    { id: "presets", label: "Save my own presets",
      keys: ["preset", "presets", "save", "my presets", "delete preset", "presets folder", "favorite", "favourite", "my sound"],
      answer: function (p) {
        if (p.id === "figamp") return "Dial in a sound, open the Preset menu and choose Save preset…. It appears under My presets, in the plugin and the app. Presets live in Library › Audio › Presets › Fig Audio › FigAMP on a Mac and %APPDATA%\\Fig Audio\\FigAMP\\Presets on Windows.";
        return "Every Fig Pro Audio plugin lets you save your own presets from its preset menu, next to the factory ones. FigAMP has 34 factory presets, FigGutEQ 18, FigSTRIP 32, FigTECH EQ 15 and FigVERB 13."; } },
    { id: "latency", label: "Latency for tracking",
      keys: ["latency", "delay when", "lag", "tracking", "real time", "realtime", "zero latency"],
      answer: function () { return "FigVERB adds no latency, and neither does FigGutEQ at 1x (its optional 2x and 4x oversampling adds under a tenth of a millisecond). FigSTRIP has a Zero Latency mode for tracking, next to its 2x and 4x oversampling. FigTECH EQ lets you turn oversampling off while you play and keep it on for offline bounces."; } },
    { id: "amps", label: "Which amps are in FigAMP?",
      keys: ["which amp", "amps", "amp list", "models", "steel 50", "singer", "brit 45", "chime", "black panel", "hot 20", "liquid", "cali v", "metal", "high gain", "clean amp"],
      answer: function () { return "Eight amps, each with a Classic Tone button: Singer (clean to smooth overdrive), Brit 45 (British crunch), Chime 30 (class-A chime), Black Panel (American clean), Hot 20 (hot-rodded crunch), Liquid 100 (liquid high-gain lead), Cali V (focused lead with a graphic EQ) and Steel 50 (tight modern high gain). The tube stages respond to your picking, so they bloom when you dig in and clean up when you back off."; },
      cards: function () { return ["figamp"]; } },
    { id: "bass", label: "Using FigAMP for bass",
      keys: ["bass", "bass guitar", "bass mode", "blend", "4x10", "1x15", "low end", "low b"],
      answer: function () { return "FigAMP works for bass: turn on Bass Mode (next to Bright) so the deep lows get through, pick the 4x10 or 1x15 bass cabinet, and turn up Blend to mix your clean DI back in under the amp (40 to 60% is a good start). FigAMP lines the two up for you, and every amp has a bass preset."; },
      cards: function () { return ["figamp"]; } },
    { id: "ir", label: "Load my own cabinet IR",
      keys: ["ir", "impulse", "cab", "cabinet", "wav", "speaker"],
      answer: function () { return "Yes, in FigAMP's Cabinet section click Load IR… and pick a .wav file. Your own IRs play at the same level as the built-in cabinets. Mic Position works with the built-in cabinets."; } },
    { id: "busmode", label: "FigSTRIP's Bus mode",
      keys: ["bus mode", "bus compressor", "glue", "channel mode", "drum bus", "mix bus"],
      answer: function () { return "FigSTRIP has one switch for Channel or Bus. Channel is the full strip for a single track. Bus swaps in a glue compressor for mix buses, drum buses, stems and groups: threshold, stepped attack and release with a two-stage Auto release, 2, 4 and 10 to 1 ratios, make-up, a sidechain high-pass and Mix for parallel compression. Switching to Bus links the stereo channels and sets up only the sections you haven't touched, as one undo step."; },
      cards: function () { return ["figstrip"]; } },
    { id: "compare", label: "How do the plugins differ?",
      keys: ["difference", "differ", "compare", "versus", " vs ", "which eq", "both eq", "guteq or", "tech eq or", "which one"],
      answer: function () { return "In short:\n• FigAMP is the guitar (and bass) amp.\n• FigGutEQ is an EQ only for guitar, before or after the amp, with zero latency.\n• FigSTRIP is a full channel strip for any track, with a Bus mode.\n• FigTECH EQ is a colourful tube program EQ for buses, mixes and mastering, as well as single tracks.\n• FigVERB is a free guitar reverb (Mac).\nTell me what you're working on and I'll show you which to try."; },
      intents: true },
    { id: "human", label: "Talk to a person",
      keys: ["human", "person", "contact", "email", "support", "help me", "agent", "talk", "someone"],
      answer: function () { return "Email " + mail + " with your computer (Mac or Windows), your DAW, which plugin and what's happening, and we'll get back to you."; } }
  ];
  var FINDER_KEYS = ["recommend", "which plugin", "what plugin", "choose", "suggest", "what should i", "what do you have", "what do you sell", "all plugins", "products", "catalog", "where do i start", "start", "beginner", "new here", "mixing", "mix ", "master", "vocal", "drum", "bundle", "what's best", "best for"];

  // ---------- Context ----------
  var path = location.pathname.toLowerCase();
  var pageProduct = null;
  ORDER.forEach(function (id) { if (path.indexOf(id) >= 0) pageProduct = id; });
  if (!pageProduct && /figtech-eq/.test(path)) pageProduct = "figtecheq";
  var isHome = /\/(index\.html)?$/.test(path) && path.split("/").filter(Boolean).length <= 1 && path.indexOf("guides") < 0;
  if (!pageProduct && (isHome || /why\.html$/.test(path))) pageProduct = "figamp";
  var onSupport = /support\.html$/.test(path);

  function guessPlatform() {
    var ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod|Android|Mobile/i.test(ua)) return ""; // they make music on a computer, ask
    if (/Windows/i.test(ua)) return "win";
    if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
    return "";
  }

  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };
  var state = { plat: store.get("fb-plat", true) || "", product: null, pendingFaq: null, pendingIntent: null };

  // ---------- UI ----------
  function priceText(p) {
    if (!p.price) return "Free";
    return "$" + p.price + " (MSRP $" + p.msrp + ", " + p.priceNote.toLowerCase() + ")";
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var launch = document.createElement("button");
  launch.type = "button";
  launch.className = "fb-launch";
  launch.setAttribute("aria-expanded", "false");
  launch.setAttribute("aria-controls", "fb-panel");
  launch.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Ask us</span>';

  var nudge = document.createElement("div");
  nudge.className = "fb-nudge";
  nudge.setAttribute("role", "status");
  nudge.innerHTML = '<button type="button" class="fb-nudge-go">' +
    (pageProduct && !isHome ? "Questions about " + P[pageProduct].name + "? Or not sure it's the one? Ask here." : "Not sure which plugin fits? Two taps and I'll show you.") +
    '</button><button type="button" class="fb-nudge-x" aria-label="Dismiss">×</button>';

  var panel = document.createElement("div");
  panel.className = "fb-panel";
  panel.id = "fb-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Fig Pro Audio assistant");
  panel.innerHTML =
    '<div class="fb-head"><img src="' + url("img/logo.png") + '" alt=""><div><strong>Fig Pro Audio</strong><span>Plugin finder and quick answers</span></div>' +
    '<button type="button" class="fb-restart" title="Start over" aria-label="Start over">↺</button>' +
    '<button type="button" class="fb-close" aria-label="Close">×</button></div>' +
    '<div class="fb-log" aria-live="polite"></div>' +
    '<form class="fb-form"><input type="text" placeholder="Ask a question…" aria-label="Your question" maxlength="300"><button type="submit">Ask</button></form>' +
    '<div class="fb-foot">Automated answers from our product pages. A person reads ' + mail + '.</div>';

  document.body.appendChild(panel);
  document.body.appendChild(nudge);
  document.body.appendChild(launch);

  var log = panel.querySelector(".fb-log");
  var input = panel.querySelector("input");

  function save() {
    // keep the conversation as you move between pages (this browser tab only)
    while (log.children.length > 40) log.removeChild(log.firstChild);
    store.set("fb-log", log.innerHTML, true);
  }
  function scroll() { log.scrollTop = log.scrollHeight; }

  function add(html, who) {
    var d = document.createElement("div");
    d.className = "fb-msg " + (who === "user" ? "fb-user" : "fb-bot");
    if (who === "user") d.textContent = html; else d.innerHTML = html;
    log.appendChild(d); scroll(); save();
    return d;
  }
  function chips(list) { // list of [action, label]
    if (!list.length) return;
    var wrap = document.createElement("div");
    wrap.className = "fb-chips";
    list.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "fb-chip" + (c[2] ? " " + c[2] : "");
      b.setAttribute("data-fb", c[0]); b.textContent = c[1];
      wrap.appendChild(b);
    });
    log.appendChild(wrap); scroll(); save();
  }
  function intentChips() { return INTENT_ORDER.map(function (k) { return ["intent:" + k, INTENTS[k].label, "fb-chip-strong"]; }); }

  function card(id, why, step) {
    var p = P[id];
    var price = p.price ? '<span class="fb-price">$' + p.price + '</span> <s>$' + p.msrp + "</s>" : '<span class="fb-price">Free</span>';
    var btns = p.price
      ? '<a class="fb-btn fb-btn-try" href="' + p.trial + '">Try free 14 days</a><a class="fb-btn fb-btn-buy" href="' + p.buy + '">Buy $' + p.price + "</a>"
      : '<a class="fb-btn fb-btn-buy" href="' + p.trial + '">Download free</a>';
    return '<div class="fb-card">' + (step ? '<div class="fb-step">' + step + "</div>" : "") +
      '<a class="fb-thumb' + (p.tall ? " tall" : "") + '" href="' + url(p.page) + '"><img src="' + url(p.img) + '" alt="" loading="lazy"></a>' +
      '<div class="fb-card-body"><div class="fb-card-top"><a class="fb-name" href="' + url(p.page) + '">' + p.name + '</a><span class="fb-role">' + p.role + "</span></div>" +
      '<p>' + esc(why || p.line) + "</p>" +
      '<div class="fb-card-buy"><div class="fb-cost">' + price + '</div><div class="fb-btns">' + btns + "</div></div></div></div>";
  }
  function cards(ids, whys, chain) {
    if (!ids.length) return;
    var html = ids.map(function (id, i) {
      return card(id, whys && whys[i], chain && ids.length > 1 ? i + 1 : 0);
    }).join(chain ? '<div class="fb-arrow" aria-hidden="true">↓</div>' : "");
    var d = document.createElement("div");
    d.className = "fb-cards" + (chain ? " fb-chain" : "");
    d.innerHTML = html;
    log.appendChild(d); scroll(); save();
  }

  function reply(fn) { setTimeout(fn, 280); }

  function askPlatform(next) {
    state.pendingIntent = next;
    add("Are you on a Mac or on Windows?", "bot");
    chips([["plat:mac", "Mac"], ["plat:win", "Windows"]]);
  }

  function showIntent(key) {
    var it = INTENTS[key];
    if (!state.plat) return askPlatform(key);
    var chain = it.chain.filter(function (c) { return P[c[0]][state.plat]; });
    var dropped = it.chain.length - chain.length;
    if (!chain.length) {
      add("FigVERB, our free plugin, is Mac only for now. On Windows, every paid plugin has a fully featured 14-day trial, so you can try any of them free first. What are you working on?", "bot");
      return chips(INTENT_ORDER.filter(function (k) { return k !== "free"; }).map(function (k) { return ["intent:" + k, INTENTS[k].label]; }));
    }
    var intro = "<strong>" + it.title + ".</strong> " + (chain.length > 1 ? "Here they are in signal-chain order:" : "Here it is:");
    var introEl = add(intro, "bot");
    cards(chain.map(function (c) { return c[0]; }), chain.map(function (c) { return c[1]; }), true);
    var after = [];
    if (chain.some(function (c) { return P[c[0]].price; })) after.push("Every paid plugin has a full 14-day trial, and one free Fig Pro Audio account activates them all.");
    if (dropped) after.push("FigVERB would go last, but it's Mac only for now.");
    if (it.guide) after.push('Guide: <a href="' + url(it.guide[0]) + '">' + it.guide[1] + "</a>.");
    if (after.length) add(after.join(" "), "bot");
    chips([["faq:install", "How do I install?"], ["faq:price", "All prices"],
      ["swap:" + key, state.plat === "mac" ? "I'm on Windows" : "I'm on a Mac"], ["menu", "Something else"]]);
    log.scrollTop = Math.max(0, introEl.offsetTop - log.offsetTop - 10); // start reading at the top of the chain
  }

  function answerFaq(f, product) {
    var p = P[product || state.product || pageProduct || "figamp"];
    if (f.perProduct && !product && !state.product && !pageProduct) {
      state.pendingFaq = f.id;
      add("Which plugin is it for?", "bot");
      return chips(ORDER.map(function (id) { return ["prod:" + id, P[id].name]; }));
    }
    add(f.answer(p, state.plat), "bot");
    if (f.cards) cards(f.cards(p, state.plat));
    if (f.intents) return chips(intentChips());
    var next = (f.also || []).map(function (id) { var g = byId(id); return ["faq:" + id, g.label]; });
    if (f.id !== "human") next.push(["faq:human", "Talk to a person"]);
    next.push(["menu", "Something else"]);
    chips(next);
  }
  function byId(id) { return FAQ.filter(function (x) { return x.id === id; })[0]; }

  function norm(s) { return " " + s.toLowerCase().replace(/[’']/g, "'").replace(/[?!.,]/g, " ").replace(/\s+/g, " ") + " "; }
  function mentionedProduct(t) {
    var al = { figamp: ["figamp", "fig amp"], figguteq: ["figguteq", "gut eq", "guteq", "guitar eq"], figstrip: ["figstrip", "fig strip", "channel strip"],
      figtecheq: ["figtech", "fig tech", "tech eq", "tube eq", "program eq", "pultec"], figverb: ["figverb", "fig verb", "reverb"] };
    for (var id in al) for (var i = 0; i < al[id].length; i++) if (t.indexOf(al[id][i]) >= 0) return id;
    return null;
  }
  function score(t, keys) {
    var s = 0;
    keys.forEach(function (k) {
      if (k === "\\$") { if (t.indexOf("$") >= 0) s += 1; return; }
      var kk = k.trim().length <= 3 ? " " + k.trim() + " " : k; // short keys match whole words only
      if (t.indexOf(kk) >= 0) s += k.length > 6 ? 3 : (k.trim().length <= 3 ? 1 : 2);
    });
    return s;
  }

  function ask(text) {
    add(text, "user");
    var t = norm(text);
    var prod = mentionedProduct(t);
    if (prod) state.product = prod;
    if (/\bwindows\b|\bpc\b/.test(t)) setPlat("win");
    else if (/\bmac\b|macbook|imac|macos/.test(t)) setPlat("mac");
    var best = null, bestScore = 0;
    FAQ.forEach(function (f) { var s = score(t, f.keys); if (s > bestScore) { bestScore = s; best = f; } });
    var finder = score(t, FINDER_KEYS);
    var intent = null;
    if (/\b(vocal|drum|mixing|mix)\b/.test(t)) intent = "mixing";
    if (/master/.test(t)) intent = "master";
    if (/already recorded|recorded guitar|real amp/.test(t)) intent = "recorded";
    reply(function () {
      if (intent && bestScore < 3) return showIntent(intent);
      if (best && bestScore >= finder) return answerFaq(best, prod);
      if (prod && !best) {
        add(P[prod].name + ", in short:", "bot");
        cards([prod]);
        return chips([["faq:install", "Install " + P[prod].name], ["faq:system", "Requirements"], ["menu", "Something else"]]);
      }
      if (finder > 0) { add("Happy to help you choose. What are you working on?", "bot"); return chips(intentChips()); }
      add("I'm not sure about that one. Pick what you're working on, or a common question, or email " + mail + " and a person will help.", "bot");
      chips(intentChips().concat([["faq:install", "Install"], ["faq:activate", "Activate"], ["faq:human", "Talk to a person"]]));
    });
  }

  function setPlat(p) { state.plat = p; store.set("fb-plat", p, true); }

  function greet() {
    if (onSupport) {
      add("Hi! Ask a question about installing, activating or trials, or pick one below. A person also reads " + mail + ".", "bot");
      return chips([["faq:install", "Install"], ["faq:activate", "Activate my licence"], ["faq:trial", "Free trials"], ["faq:daw", "My DAW doesn't show it"], ["faq:smartscreen", "Windows warning"], ["faq:human", "Talk to a person"]]);
    }
    if (pageProduct && !isHome) {
      var p = P[pageProduct];
      add("Hi! Ask me anything about " + p.name + ", or tell me what you're working on and I'll show you which Fig Pro Audio plugins fit.", "bot");
      return chips([["faq:install", "Install " + p.name], ["faq:activate", "Activate"], ["faq:system", "Requirements"], ["menu", "Which plugin is for me?"]]);
    }
    add("Hi! What are you working on? Pick one and I'll show you the plugins for it, in signal-chain order. Or type a question.", "bot");
    chips(intentChips());
  }

  function act(a) {
    var parts = a.split(":"), k = parts[0], v = parts[1];
    var labelFor = { "plat:mac": "Mac", "plat:win": "Windows" };
    if (k === "intent") { add(INTENTS[v].label, "user"); reply(function () { showIntent(v); }); }
    else if (k === "plat") {
      add(labelFor[a], "user"); setPlat(v);
      reply(function () { var i = state.pendingIntent; state.pendingIntent = null; if (i) showIntent(i); else { add("Got it. What are you working on?", "bot"); chips(intentChips()); } });
    }
    else if (k === "faq") { var f = byId(v); add(f.label, "user"); reply(function () { answerFaq(f); }); }
    else if (k === "prod") {
      add(P[v].name, "user"); state.product = v;
      var pf = state.pendingFaq && byId(state.pendingFaq); state.pendingFaq = null;
      reply(function () { if (pf) answerFaq(pf, v); else { cards([v]); } });
    }
    else if (k === "swap") {
      var other = state.plat === "mac" ? "win" : "mac";
      add(other === "mac" ? "I'm on a Mac" : "I'm on Windows", "user"); setPlat(other);
      reply(function () { showIntent(v); });
    }
    else if (k === "menu") { add("Something else", "user"); reply(function () { add("What are you working on? Or type any question.", "bot"); chips(intentChips().concat([["faq:compare", "How do they differ?"], ["faq:human", "Talk to a person"]])); }); }
  }

  log.addEventListener("click", function (e) {
    var b = e.target.closest("[data-fb]");
    if (b) { act(b.getAttribute("data-fb")); return; }
    if (e.target.closest("a")) store.set("fb-open", "1", true); // reopen on the next page
  });

  function isOpen() { return panel.classList.contains("open"); }
  function open(on, opts) {
    panel.classList.toggle("open", on);
    launch.setAttribute("aria-expanded", on ? "true" : "false");
    hideNudge();
    if (on) {
      store.set("fb-nudge-off", "1", true);
      if (!log.children.length && !(opts && opts.quiet)) greet();
      if (!(opts && opts.noFocus) && window.matchMedia("(pointer: fine)").matches) input.focus();
    }
  }
  function restart() {
    log.innerHTML = ""; state.pendingFaq = state.pendingIntent = null; save(); greet();
  }

  launch.addEventListener("click", function () { open(!isOpen()); });
  panel.querySelector(".fb-close").addEventListener("click", function () { open(false); launch.focus(); });
  panel.querySelector(".fb-restart").addEventListener("click", restart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen()) { open(false); launch.focus(); } });
  panel.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = "";
    ask(q);
  });

  // Anything on the page with data-fb-intent opens the finder on that answer.
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-fb-intent]");
    if (!t) return;
    e.preventDefault();
    var k = t.getAttribute("data-fb-intent");
    open(true, { quiet: true, noFocus: true });
    if (!INTENTS[k]) { if (log.children.length) act("menu"); else greet(); return; }
    act("intent:" + k);
  });

  // ---------- Nudge ----------
  function hideNudge() { nudge.classList.remove("show"); }
  function showNudge() {
    if (isOpen() || store.get("fb-nudge-off", true) || store.get("fb-nudge-x")) return;
    nudge.classList.add("show");
  }
  nudge.querySelector(".fb-nudge-go").addEventListener("click", function () { open(true); });
  nudge.querySelector(".fb-nudge-x").addEventListener("click", function () { hideNudge(); store.set("fb-nudge-x", "1"); });
  if (!onSupport) {
    setTimeout(showNudge, 25000);
    var nudged = false;
    window.addEventListener("scroll", function () {
      if (nudged) return;
      var h = document.documentElement;
      if ((h.scrollTop + h.clientHeight) / h.scrollHeight > 0.6) { nudged = true; showNudge(); }
    }, { passive: true });
  }

  // ---------- Restore the conversation from the last page ----------
  var saved = store.get("fb-log", true);
  if (saved) { log.innerHTML = saved; }
  if (state.plat === "") { var g = guessPlatform(); if (g) state.plat = g; }
  if (store.get("fb-open", true)) { store.set("fb-open", "", true); open(true, { quiet: true, noFocus: true }); scroll(); }

  window.FigChat = { open: function () { open(true); }, intent: function (k) { open(true, { quiet: true }); act("intent:" + k); } };
})();
