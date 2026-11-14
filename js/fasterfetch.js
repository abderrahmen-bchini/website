// ===== FASTERFETCH (browser edition) =====
// JS port of github.com/abderrahmen-bchini/fasterfetch — same layout
// (logo, bordered card, bars, swatch row), but the "system" it fetches
// is the visitor's browser. No network calls, nothing stored or sent.
(() => {
  const terminal = document.getElementById("ff-terminal");
  const themesBar = document.getElementById("ff-themes");
  if (!terminal) return;

  // xterm-256 colors used by the C logos/themes, mapped to hex
  const C = {
    33: "#0087ff", 34: "#00af00", 93: "#8700ff", 110: "#87afd7",
    136: "#af8700", 141: "#af87ff", 147: "#afafff", 153: "#afd7ff",
    167: "#d75f5f", 172: "#d78700", 179: "#d7af5f", 183: "#d7afff",
    161: "#d7005f", 196: "#ff0000", 208: "#ff8700", 212: "#ff87d7", 214: "#ffaf00",
    220: "#ffd700", 226: "#ffff00", 238: "#444444",
    cyan: "#00d7d7"
  };

  // themes.c: { name, border, label }
  const THEMES = {
    nord: [C[110], C[153]],
    dracula: [C[141], C[212]],
    gruvbox: [C[172], C[214]],
    catppuccin: [C[147], C[183]],
    amber: [C[136], C[220]]
  };

  // ---------- detection (every value is shown only to the visitor) ----------

  function detectBrowser() {
    const ua = navigator.userAgent;
    const brands = navigator.userAgentData && navigator.userAgentData.brands;
    if (brands) {
      const b = brands.find((x) => !/Not.A.Brand|Chromium/i.test(x.brand));
      if (b) return { name: b.brand, version: b.version };
      const c = brands.find((x) => /Chromium/i.test(x.brand));
      if (c) return { name: "Chromium", version: c.version };
    }
    let m;
    if ((m = ua.match(/Edg\/(\d+)/))) return { name: "Edge", version: m[1] };
    if ((m = ua.match(/OPR\/(\d+)/))) return { name: "Opera", version: m[1] };
    if ((m = ua.match(/Firefox\/(\d+)/))) return { name: "Firefox", version: m[1] };
    if ((m = ua.match(/Chrome\/(\d+)/))) return { name: "Chrome", version: m[1] };
    if (/Safari\//.test(ua) && (m = ua.match(/Version\/(\d+)/))) return { name: "Safari", version: m[1] };
    return { name: "Browser", version: "" };
  }

  function detectOS() {
    const ua = navigator.userAgent;
    const plat = (navigator.userAgentData && navigator.userAgentData.platform) || "";
    let m;
    if (/Windows/i.test(plat) || /Windows NT/.test(ua)) return { name: "Windows", logo: "windows", color: C[33] };
    if (/Android/i.test(plat) || /Android/.test(ua)) return { name: "Android", logo: "linux", color: C.cyan };
    if (/iPhone|iPad|iPod/.test(ua)) return { name: "iOS", logo: "macos", color: C[33] };
    if (/mac/i.test(plat) || /Mac OS X/.test(ua)) {
      let name = "macOS";
      if ((m = ua.match(/Mac OS X (\d+[._]\d+)/))) name += " " + m[1].replace("_", ".");
      return { name, logo: "macos", color: C[33] };
    }
    if (/Linux/i.test(plat) || /Linux/.test(ua)) return { name: "Linux", logo: "linux", color: C[161] };
    return { name: "", logo: "default", color: C.cyan };
  }

  function detectGPU() {
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      if (!gl) return null;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (!ext) return null;
      let r = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      if (!r) return null;
      // strip ANGLE wrapper noise: "ANGLE (Vendor, Device (...), Driver)"
      const m = r.match(/^ANGLE \((?:[^,]*), ?([^,(]*)/);
      if (m) r = m[1].trim();
      return r.replace(/\s*\(.*$/, "").trim() || null;
    } catch (e) {
      return null;
    }
  }

  function formatUptime() {
    const s = Math.floor(performance.now() / 1000);
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + "h " : "") + (h || m ? m + "m " : "") + sec + "s";
  }

  // ---------- rendering helpers ----------

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // utils.c build_bar: ━ glyphs, thresholds 110/179/167 (invert flips them)
  function buildBar(pct, invert) {
    const width = 10;
    let filled = Math.round((pct / 100) * width);
    filled = Math.max(0, Math.min(width, filled));
    const color = invert
      ? (pct > 50 ? C[110] : pct > 20 ? C[179] : C[167])
      : (pct < 60 ? C[110] : pct < 80 ? C[179] : C[167]);
    const frag = document.createDocumentFragment();
    if (filled > 0) {
      const f = el("span", null, "━".repeat(filled));
      f.style.color = color;
      frag.appendChild(f);
    }
    if (filled < width) {
      const e = el("span", null, "━".repeat(width - filled));
      e.style.color = C[238];
      frag.appendChild(e);
    }
    return frag;
  }

  // ---------- logos (ported from logos.c; colors via span styles) ----------

  function span(color, text) {
    const s = el("span", null, text);
    s.style.color = color;
    return s;
  }

  // each line is a list of [color, text] segments
  function logoLines(name) {
    if (name === "macos") {
      return [
        [[C[34], "                    c.'"]],
        [[C[34], "                 ,xNMM."]],
        [[C[34], "               .OMMMMo"]],
        [[C[34], "               lMM\""]],
        [[C[34], "     .;loddo:.  .olloddol;."]],
        [[C[34], "   cKMMMMMMMMMMNWMMMMMMMMMM0:"]],
        [[C[226], " .KMMMMMMMMMMMMMMMMMMMMMMMWd."]],
        [[C[226], " XMMMMMMMMMMMMMMMMMMMMMMMX."]],
        [[C[208], ";MMMMMMMMMMMMMMMMMMMMMMMM:"]],
        [[C[208], ":MMMMMMMMMMMMMMMMMMMMMMMM:"]],
        [[C[196], ".MMMMMMMMMMMMMMMMMMMMMMMMX."]],
        [[C[196], " kMMMMMMMMMMMMMMMMMMMMMMMMWd."]],
        [[C[93], " 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk"]],
        [[C[93], "  'XMMMMMMMMMMMMMMMMMMMMMMMMK."]],
        [[C[33], "    kMMMMMMMMMMMMMMMMMMMMMMd"]],
        [[C[33], "     ;KMMMMMMMWXXWMMMMMMMk."]],
        [[C[33], "       \"cooc*\"    \"*coo'\""]]
      ];
    }
    if (name === "linux") {
      // the Debian swirl from logos.c — gray with the red accents
      const g = "#c6c6c6", r = C[161];
      return [
        [[g, "       _,met$$$$$gg."]],
        [[g, "    ,g$$$$$$$$$$$$$$$P."]],
        [[g, "  ,g$$P\"     \"\"\"Y$$.\"."]],
        [[g, " ,$$P'              `$$$."]],
        [[g, "',$$P       ,ggs.     `$$b:"]],
        [[g, "`d$$'     ,$P\"'   "], [r, "."], [g, "    $$$"]],
        [[g, " $$P      d$'     "], [r, ","], [g, "    $$P"]],
        [[g, " $$:      $$.   "], [r, "-"], [g, "    ,d$$'"]],
        [[g, " $$;      Y$b._   _,d$P'"]],
        [[g, " Y$$.    "], [r, "`."], [g, "`\"Y$$$$P\"'"]],
        [[g, " `$$b      "], [r, "\"-.__"]],
        [[g, "  `Y$$"]],
        [[g, "   `Y$$."]],
        [[g, "     `$$b."]],
        [[g, "       `Y$$b."]],
        [[g, "          `\"Y$b._"]],
        [[g, "              `\"\"\""]]
      ];
    }
    if (name === "windows") {
      // no Windows logo exists in logos.c — the four panes, in their real colors
      const r = "#f25022", gr = "#7fba00", b = "#00a4ef", y = "#ffb900";
      return [
        [[r, "  ██████"], [gr, "  ██████"]],
        [[r, "  ██████"], [gr, "  ██████"]],
        [[r, "  ██████"], [gr, "  ██████"]],
        [[r, ""]],
        [[b, "  ██████"], [y, "  ██████"]],
        [[b, "  ██████"], [y, "  ██████"]],
        [[b, "  ██████"], [y, "  ██████"]]
      ];
    }
    // default_ascii banner (wide — panel scrolls horizontally if needed)
    return [
      [[C.cyan, "███████╗ █████╗ ███████╗████████╗███████╗██████╗ ███████╗███████╗████████╗ ██████╗██╗  ██╗"]],
      [[C.cyan, "██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔════╝██║  ██║"]],
      [[C.cyan, "█████╗  ███████║███████╗   ██║   █████╗  ██████╔╝█████╗  █████╗     ██║   ██║     ███████║"]],
      [[C.cyan, "██╔══╝  ██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗██╔══╝  ██╔══╝     ██║   ██║     ██╔══██║"]],
      [[C.cyan, "██║     ██║  ██║███████║   ██║   ███████╗██║  ██║██║     ███████╗   ██║   ╚██████╗██║  ██║"]],
      [[C.cyan, "╚═╝     ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝   ╚═╝    ╚═════╝╚═╝  ╚═╝"]]
    ];
  }

  // ---------- main ----------

  const os = detectOS();
  const browser = detectBrowser();

  async function gatherRows() {
    // module_registry contract: null value = hide the row
    const rows = [
      ["OS", os.name || null],
      ["Browser", (browser.name + " " + browser.version).trim()],
      ["Engine", /Firefox/.test(browser.name) ? "Gecko" : /Safari/.test(browser.name) ? "WebKit" : "Blink"],
      ["Uptime", formatUptime(), "ff-uptime"],
      ["Screen", screen.width + "x" + screen.height + " @" + (window.devicePixelRatio || 1) + "x"],
      ["CPU", navigator.hardwareConcurrency ? navigator.hardwareConcurrency + " cores" : null],
      ["GPU", detectGPU()],
      ["Memory", navigator.deviceMemory ? (navigator.deviceMemory >= 8 ? "≥ " : "") + navigator.deviceMemory + " GB" : null],
      ["Battery", null],
      ["Lang", navigator.language || null],
      ["Theme", (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") + (navigator.maxTouchPoints > 0 ? ", touch" : "")],
      ["Online", navigator.onLine ? "connected" : "offline"]
    ];

    if (navigator.getBattery) {
      try {
        const timeout = new Promise((_, rej) => setTimeout(rej, 1000));
        const bat = await Promise.race([navigator.getBattery(), timeout]);
        const pct = Math.round(bat.level * 100);
        const row = rows.find((r) => r[0] === "Battery");
        row[1] = { bar: [pct, true], text: " " + pct + "%" + (bat.charging ? " (charging)" : "") };
      } catch (e) { /* row stays hidden */ }
    }
    return rows.filter((r) => r[1]);
  }

  function renderOutput(rows) {
    const out = el("div", "ff-output");

    const logo = el("pre", "ff-logo");
    logoLines(os.logo).forEach((segments) => {
      segments.forEach(([color, text]) => logo.appendChild(span(color, text)));
      logo.appendChild(document.createTextNode("\n"));
    });
    out.appendChild(logo);

    const card = el("div", "ff-card");
    card.appendChild(el("div", "ff-card-header", "visitor@" + browser.name.toLowerCase().replace(/\s+/g, "")));

    const body = el("div", "ff-rows");
    rows.forEach(([label, value, id]) => {
      const row = el("div", "ff-row");
      row.appendChild(el("span", "ff-label", label));
      row.appendChild(el("span", "ff-sep", "│"));
      const val = el("span", "ff-val");
      if (id) val.id = id;
      if (typeof value === "object") {
        val.appendChild(buildBar(value.bar[0], value.bar[1]));
        val.appendChild(document.createTextNode(value.text));
      } else {
        val.textContent = value;
      }
      row.appendChild(val);
      body.appendChild(row);
    });
    card.appendChild(body);
    out.appendChild(card);

    // the CLI's 8-color ANSI swatch row (bg colors 40-47)
    const swatches = el("div", "ff-swatches");
    ["#000000", "#cd0000", "#00cd00", "#cdcd00", "#0000ee", "#cd00cd", "#00cdcd", "#e5e5e5"]
      .forEach((bg) => {
        const s = el("span", "ff-swatch");
        s.style.backgroundColor = bg;
        swatches.appendChild(s);
      });
    out.appendChild(swatches);

    terminal.appendChild(out);

    setInterval(() => {
      const u = document.getElementById("ff-uptime");
      if (u) u.textContent = formatUptime();
    }, 1000);
  }

  function applyTheme(name) {
    const [border, label] = THEMES[name] || [os.color, os.color];
    terminal.style.setProperty("--ff-border", border);
    terminal.style.setProperty("--ff-label", label);
    if (themesBar) {
      themesBar.querySelectorAll("button").forEach((b) => {
        b.setAttribute("aria-pressed", b.dataset.theme === name ? "true" : "false");
      });
    }
  }

  function wireThemes() {
    if (!themesBar) return;
    themesBar.hidden = false;
    themesBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-theme]");
      if (btn) applyTheme(btn.dataset.theme);
    });
  }

  async function run() {
    applyTheme("default");
    const rows = await gatherRows();

    const prompt = el("div", "ff-prompt");
    prompt.appendChild(span(os.color, "visitor@browser"));
    prompt.appendChild(document.createTextNode(":~$ "));
    const cmd = el("span", null, "");
    prompt.appendChild(cmd);
    terminal.appendChild(prompt);

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const text = "fasterfetch";
    if (reduced) {
      cmd.textContent = text;
      renderOutput(rows);
      wireThemes();
      return;
    }
    let i = 0;
    (function type() {
      cmd.textContent = text.slice(0, ++i);
      if (i < text.length) {
        setTimeout(type, 55);
      } else {
        setTimeout(() => { renderOutput(rows); wireThemes(); }, 220);
      }
    })();
  }

  run();
})();
