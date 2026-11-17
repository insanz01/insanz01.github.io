(function () {
  // 1. Playground Tab Controller
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));
  var tabPanels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));

  function activateTab(tabId) {
    var valid = ["terminal", "utils", "ratelimit", "markdown"];
    if (valid.indexOf(tabId) === -1) return;
    tabButtons.forEach(function (btn) {
      var isMatch = btn.getAttribute("data-tab") === tabId;
      btn.setAttribute("aria-selected", isMatch ? "true" : "false");
      btn.setAttribute("tabindex", isMatch ? "0" : "-1");
    });
    tabPanels.forEach(function (panel) {
      var isMatch = panel.id === "panel-" + tabId;
      panel.hidden = !isMatch;
    });
  }

  window.__openPlaygroundTab = activateTab;

  function syncTabFromHash() {
    var hash = (window.location.hash || "").replace(/^#/, "");
    if (hash) activateTab(hash);
  }

  syncTabFromHash();
  window.addEventListener("hashchange", syncTabFromHash);

  tabButtons.forEach(function (btn, idx) {
    btn.addEventListener("click", function () {
      var tabId = btn.getAttribute("data-tab");
      activateTab(tabId);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#" + tabId);
      }
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        var dir = e.key === "ArrowRight" ? 1 : -1;
        var nextIdx = (idx + dir + tabButtons.length) % tabButtons.length;
        var nextBtn = tabButtons[nextIdx];
        activateTab(nextBtn.getAttribute("data-tab"));
        nextBtn.focus();
      }
    });
  });

  // 2. Interactive Terminal
  var termOutput = document.getElementById("terminal-output");
  var termForm = document.getElementById("terminal-form");
  var termInput = document.getElementById("terminal-input");
  var quickChips = Array.prototype.slice.call(document.querySelectorAll(".chip-btn"));

  if (termOutput && termForm && termInput) {
    var history = [];
    var historyIdx = -1;

    function appendTermLine(text, variant) {
      var div = document.createElement("div");
      div.className = "term-line" + (variant ? " " + variant : "");
      div.textContent = text;
      termOutput.appendChild(div);
      termOutput.scrollTop = termOutput.scrollHeight;
    }

    appendTermLine("Welcome to Insan Kamil's interactive shell. Type 'help' to begin.", "is-muted");

    function runCommand(raw) {
      var trimmed = raw.trim();
      if (!trimmed) return;

      history.unshift(trimmed);
      historyIdx = -1;
      appendTermLine("kamil@web:~$ " + trimmed, "is-cmd");

      var parts = trimmed.split(/\s+/);
      var cmd = parts[0].toLowerCase();
      var arg = parts.slice(1).join(" ").toLowerCase();

      switch (cmd) {
        case "help":
          appendTermLine(
            "Commands: whoami, projects, experience, stack, contact, theme [light|dark], open [utils|ratelimit|markdown], date, clear",
            "is-muted"
          );
          break;
        case "whoami":
          appendTermLine(
            "Insan Kamil — Software Engineer (Full-Stack) based in Indonesia.",
            "is-muted"
          );
          break;
        case "projects":
          appendTermLine(
            "1. Memofy (TypeScript, React, PostgreSQL)\n2. Pulse API Gateway (Go, Redis, Docker)\n3. Ledger CLI (Node.js, SQLite)",
            "is-muted"
          );
          break;
        case "experience":
          appendTermLine(
            "2024–Present  Full-Stack Software Engineer @ Independent\n2022–2024     Software Engineer @ Product Studio",
            "is-muted"
          );
          break;
        case "stack":
          appendTermLine(
            "Languages: TypeScript, JS, Go, SQL, Python\nFrontend:  HTML/CSS, React, Next.js\nBackend:   Node.js, PostgreSQL, Redis, Docker",
            "is-muted"
          );
          break;
        case "contact":
          appendTermLine(
            "Email:  insankamil002@gmail.com\nGitHub: https://github.com/insanz01",
            "is-muted"
          );
          break;
        case "date":
          appendTermLine(new Date().toString(), "is-muted");
          break;
        case "theme":
          if (typeof window.__setTheme === "function") {
            var applied = window.__setTheme(arg === "light" || arg === "dark" ? arg : undefined);
            appendTermLine("Theme set to " + applied + ".", "is-muted");
          }
          break;
        case "open":
          if (arg === "utils" || arg === "ratelimit" || arg === "markdown" || arg === "terminal") {
            activateTab(arg);
            appendTermLine("Switched to " + arg + ".", "is-muted");
          } else {
            appendTermLine("Usage: open [utils | ratelimit | markdown]", "is-err");
          }
          break;
        case "clear":
          termOutput.textContent = "";
          break;
        default:
          appendTermLine("Command not found: " + cmd + ". Try 'help'.", "is-err");
      }
    }

    termForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = termInput.value;
      termInput.value = "";
      runCommand(val);
    });

    termInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIdx + 1 < history.length) {
          historyIdx += 1;
          termInput.value = history[historyIdx];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIdx > 0) {
          historyIdx -= 1;
          termInput.value = history[historyIdx];
        } else {
          historyIdx = -1;
          termInput.value = "";
        }
      }
    });

    quickChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        runCommand(chip.getAttribute("data-cmd") || "");
        termInput.focus();
      });
    });
  }

  // 3. Dev Utilities Workbench
  var subtabButtons = Array.prototype.slice.call(document.querySelectorAll(".subtab-btn"));
  var utilPanes = Array.prototype.slice.call(document.querySelectorAll(".util-pane"));

  subtabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-util");
      subtabButtons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
      utilPanes.forEach(function (pane) {
        pane.hidden = pane.id !== "util-" + target;
      });
    });
  });

  // 3a. JSON Formatter
  var jsonInput = document.getElementById("json-input");
  var jsonStatus = document.getElementById("json-status");
  var jsonFormatBtn = document.getElementById("json-format");
  var jsonMinifyBtn = document.getElementById("json-minify");
  var jsonSampleBtn = document.getElementById("json-sample");
  var jsonCopyBtn = document.getElementById("json-copy");

  function setJsonStatus(msg, state) {
    if (!jsonStatus) return;
    jsonStatus.textContent = msg;
    jsonStatus.className = "util-status" + (state ? " " + state : "");
  }

  function processJson(indent) {
    if (!jsonInput) return;
    var raw = jsonInput.value.trim();
    if (!raw) {
      setJsonStatus("Input is empty", "");
      return;
    }
    try {
      var parsed = JSON.parse(raw);
      jsonInput.value = JSON.stringify(parsed, null, indent);
      setJsonStatus(indent ? "Valid JSON · Formatted" : "Valid JSON · Minified", "is-ok");
    } catch (err) {
      setJsonStatus("Invalid JSON: " + err.message, "is-err");
    }
  }

  if (jsonFormatBtn) jsonFormatBtn.addEventListener("click", function () { processJson(2); });
  if (jsonMinifyBtn) jsonMinifyBtn.addEventListener("click", function () { processJson(0); });
  if (jsonSampleBtn && jsonInput) {
    jsonSampleBtn.addEventListener("click", function () {
      jsonInput.value = JSON.stringify(
        {
          engineer: "Insan Kamil",
          stack: ["TypeScript", "Go", "PostgreSQL"],
          available: true,
        },
        null,
        2
      );
      setJsonStatus("Sample loaded · Valid JSON", "is-ok");
    });
  }
  if (jsonCopyBtn && jsonInput) {
    jsonCopyBtn.addEventListener("click", function () {
      if (!jsonInput.value) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(jsonInput.value).then(function () {
          setJsonStatus("Copied to clipboard", "is-ok");
        });
      }
    });
  }

  // 3b. JWT Decoder
  var jwtInput = document.getElementById("jwt-input");
  var jwtHeader = document.getElementById("jwt-header");
  var jwtPayload = document.getElementById("jwt-payload");
  var jwtExp = document.getElementById("jwt-exp");
  var jwtSampleBtn = document.getElementById("jwt-sample");
  var jwtClearBtn = document.getElementById("jwt-clear");

  function decodeBase64Url(str) {
    var base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    var pad = base64.length % 4;
    if (pad) base64 += "====".slice(pad);
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  function renderJwt() {
    if (!jwtInput || !jwtHeader || !jwtPayload || !jwtExp) return;
    var token = jwtInput.value.trim();
    if (!token) {
      jwtHeader.textContent = "—";
      jwtPayload.textContent = "—";
      jwtExp.textContent = "";
      jwtExp.className = "exp-badge";
      return;
    }

    var parts = token.split(".");
    if (parts.length < 2) {
      jwtHeader.textContent = "Invalid JWT format (expected 3 dot-separated parts)";
      jwtPayload.textContent = "—";
      jwtExp.textContent = "";
      return;
    }

    try {
      var h = JSON.parse(decodeBase64Url(parts[0]));
      var p = JSON.parse(decodeBase64Url(parts[1]));
      jwtHeader.textContent = JSON.stringify(h, null, 2);
      jwtPayload.textContent = JSON.stringify(p, null, 2);

      if (typeof p.exp === "number") {
        var isExpired = p.exp * 1000 < Date.now();
        jwtExp.textContent = isExpired ? "Expired" : "Valid";
        jwtExp.className = "exp-badge " + (isExpired ? "is-err" : "is-ok");
      } else {
        jwtExp.textContent = "No exp";
        jwtExp.className = "exp-badge";
      }
    } catch (err) {
      jwtHeader.textContent = "Failed to decode JWT";
      jwtPayload.textContent = err.message;
      jwtExp.textContent = "";
    }
  }

  if (jwtInput) jwtInput.addEventListener("input", renderJwt);
  if (jwtSampleBtn && jwtInput) {
    jwtSampleBtn.addEventListener("click", function () {
      jwtInput.value =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        "eyJzdWIiOiJpbnNhbnowMSIsIm5hbWUiOiJJbnNhbiBLYW1pbCIsInJvbGUiOiJlbmdpbmVlciIsImV4cCI6MTg5MzQ1NjAwMH0." +
        "dGVzdC1zaWduYXR1cmU";
      renderJwt();
    });
  }
  if (jwtClearBtn && jwtInput) {
    jwtClearBtn.addEventListener("click", function () {
      jwtInput.value = "";
      renderJwt();
    });
  }

  // 3c. Timestamp Converter
  var timeLive = document.getElementById("time-live");
  var timeUseNow = document.getElementById("time-use-now");
  var timeUnix = document.getElementById("time-unix");
  var timeIso = document.getElementById("time-iso");
  var timeLocal = document.getElementById("time-local");

  function updateLiveEpoch() {
    if (timeLive) {
      timeLive.textContent = String(Math.floor(Date.now() / 1000));
    }
  }
  updateLiveEpoch();
  setInterval(updateLiveEpoch, 1000);

  function syncFromDate(date) {
    if (isNaN(date.getTime())) {
      if (timeLocal) timeLocal.textContent = "Local: Invalid date";
      return;
    }
    if (timeLocal) {
      timeLocal.textContent = "Local: " + date.toLocaleString();
    }
  }

  if (timeUseNow && timeUnix && timeIso) {
    timeUseNow.addEventListener("click", function () {
      var now = new Date();
      timeUnix.value = String(Math.floor(now.getTime() / 1000));
      timeIso.value = now.toISOString();
      syncFromDate(now);
    });

    timeUnix.addEventListener("input", function () {
      var raw = timeUnix.value.trim();
      if (!raw) return;
      var num = Number(raw);
      if (isNaN(num)) {
        if (timeLocal) timeLocal.textContent = "Local: Invalid Unix timestamp";
        return;
      }
      var ms = Math.abs(num) < 1e12 ? num * 1000 : num;
      var d = new Date(ms);
      if (!isNaN(d.getTime())) {
        timeIso.value = d.toISOString();
      }
      syncFromDate(d);
    });

    timeIso.addEventListener("input", function () {
      var raw = timeIso.value.trim();
      if (!raw) return;
      var d = new Date(raw);
      if (!isNaN(d.getTime())) {
        timeUnix.value = String(Math.floor(d.getTime() / 1000));
      }
      syncFromDate(d);
    });
  }

  // 4. Rate Limiter (Token Bucket) Simulator
  var rlCap = document.getElementById("rl-cap");
  var rlRate = document.getElementById("rl-rate");
  var rlCapVal = document.getElementById("rl-cap-val");
  var rlRateVal = document.getElementById("rl-rate-val");
  var rlTokenCount = document.getElementById("rl-token-count");
  var rlSlots = document.getElementById("rl-slots");
  var rlSend = document.getElementById("rl-send");
  var rlBurst = document.getElementById("rl-burst");
  var rlReset = document.getElementById("rl-reset");
  var rlLog = document.getElementById("rl-log");

  if (rlCap && rlRate && rlSlots && rlLog) {
    var capacity = Number(rlCap.value);
    var refillRate = Number(rlRate.value);
    var tokens = capacity;
    var lastTick = Date.now();
    var reqSeq = 0;

    function renderBucket() {
      if (rlCapVal) rlCapVal.textContent = String(capacity);
      if (rlRateVal) rlRateVal.textContent = refillRate.toFixed(1);
      if (rlTokenCount) {
        rlTokenCount.textContent = Math.floor(tokens) + " / " + capacity;
      }

      rlSlots.textContent = "";
      var filled = Math.floor(tokens);
      for (var i = 0; i < 10; i++) {
        var slot = document.createElement("div");
        slot.className = "rl-slot";
        if (i >= capacity) {
          slot.classList.add("is-disabled");
        } else if (i < filled) {
          slot.classList.add("is-filled");
        }
        rlSlots.appendChild(slot);
      }
    }

    function refillTokens() {
      var now = Date.now();
      var elapsed = (now - lastTick) / 1000;
      lastTick = now;
      tokens = Math.min(capacity, tokens + elapsed * refillRate);
      renderBucket();
    }

    setInterval(refillTokens, 100);

    function sendOneRequest() {
      refillTokens();
      reqSeq += 1;
      var allowed = tokens >= 1;
      if (allowed) tokens -= 1;
      renderBucket();

      var li = document.createElement("li");
      var left = document.createElement("span");
      left.textContent =
        "#" + reqSeq + " · " + new Date().toLocaleTimeString();

      var right = document.createElement("span");
      right.className = allowed ? "rl-status-200" : "rl-status-429";
      right.textContent = allowed ? "200 OK" : "429 Too Many Requests";

      li.appendChild(left);
      li.appendChild(right);
      rlLog.insertBefore(li, rlLog.firstChild);

      while (rlLog.children.length > 15) {
        rlLog.removeChild(rlLog.lastChild);
      }
    }

    rlCap.addEventListener("input", function () {
      capacity = Number(rlCap.value);
      tokens = Math.min(tokens, capacity);
      renderBucket();
    });

    rlRate.addEventListener("input", function () {
      refillRate = Number(rlRate.value);
      renderBucket();
    });

    if (rlSend) rlSend.addEventListener("click", sendOneRequest);
    if (rlBurst) {
      rlBurst.addEventListener("click", function () {
        for (var i = 0; i < 5; i++) sendOneRequest();
      });
    }
    if (rlReset) {
      rlReset.addEventListener("click", function () {
        tokens = capacity;
        reqSeq = 0;
        rlLog.textContent = "";
        renderBucket();
      });
    }

    renderBucket();
  }

  // 5. Quick Markdown Scratchpad
  var mdInput = document.getElementById("md-input");
  var mdPreview = document.getElementById("md-preview");
  var mdWorkspace = document.getElementById("md-workspace");
  var mdSplitBtn = document.getElementById("md-mode-split");
  var mdEditBtn = document.getElementById("md-mode-edit");
  var mdPreviewBtn = document.getElementById("md-mode-preview");
  var mdCopyBtn = document.getElementById("md-copy");
  var mdResetBtn = document.getElementById("md-reset");

  var MD_STORAGE_KEY = "kamil_portfolio_md";
  var DEFAULT_MD =
    "# Quick Notes\n\n" +
    "A lightweight **Markdown scratchpad** saved locally in your browser.\n\n" +
    "## Try editing\n" +
    "- Supports `inline code`, **bold**, and *italic*\n" +
    "- Safe link rendering like [GitHub](https://github.com/insanz01)\n\n" +
    "> Simplicity is prerequisite for reliability.\n\n" +
    "```js\nconst greet = (name) => `Hello, ${name}`;\n```";

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatInline(escaped) {
    return escaped
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, text, url) {
        var cleanUrl = url.trim();
        if (/^(https?:\/\/|mailto:)/i.test(cleanUrl)) {
          return (
            '<a href="' +
            cleanUrl +
            '" target="_blank" rel="noopener noreferrer">' +
            text +
            "</a>"
          );
        }
        return text;
      });
  }

  function renderMarkdown(src) {
    var lines = src.replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var inCode = false;
    var inList = false;

    function closeList() {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (line.trim().indexOf("```") === 0) {
        closeList();
        if (!inCode) {
          inCode = true;
          html.push("<pre><code>");
        } else {
          inCode = false;
          html.push("</code></pre>");
        }
        continue;
      }

      if (inCode) {
        html.push(escapeHtml(line) + "\n");
        continue;
      }

      var escaped = escapeHtml(line);

      if (/^###\s+/.test(line)) {
        closeList();
        html.push("<h3>" + formatInline(escaped.replace(/^###\s+/, "")) + "</h3>");
      } else if (/^##\s+/.test(line)) {
        closeList();
        html.push("<h2>" + formatInline(escaped.replace(/^##\s+/, "")) + "</h2>");
      } else if (/^#\s+/.test(line)) {
        closeList();
        html.push("<h1>" + formatInline(escaped.replace(/^#\s+/, "")) + "</h1>");
      } else if (/^>\s+/.test(line)) {
        closeList();
        html.push("<blockquote>" + formatInline(escaped.replace(/^&gt;\s+/, "")) + "</blockquote>");
      } else if (/^[-*]\s+/.test(line)) {
        if (!inList) {
          inList = true;
          html.push("<ul>");
        }
        html.push("<li>" + formatInline(escaped.replace(/^[-*]\s+/, "")) + "</li>");
      } else if (line.trim() === "") {
        closeList();
      } else {
        closeList();
        html.push("<p>" + formatInline(escaped) + "</p>");
      }
    }

    closeList();
    if (inCode) html.push("</code></pre>");
    return html.join("");
  }

  if (mdInput && mdPreview && mdWorkspace) {
    var savedMd = null;
    try {
      savedMd = localStorage.getItem(MD_STORAGE_KEY);
    } catch (e) {}
    mdInput.value = savedMd !== null ? savedMd : DEFAULT_MD;
    mdPreview.innerHTML = renderMarkdown(mdInput.value);

    mdInput.addEventListener("input", function () {
      mdPreview.innerHTML = renderMarkdown(mdInput.value);
      try {
        localStorage.setItem(MD_STORAGE_KEY, mdInput.value);
      } catch (e) {}
    });

    function setMdMode(mode) {
      mdWorkspace.setAttribute("data-mode", mode);
      [
        [mdSplitBtn, "split"],
        [mdEditBtn, "edit"],
        [mdPreviewBtn, "preview"],
      ].forEach(function (pair) {
        if (pair[0]) pair[0].classList.toggle("is-active", pair[1] === mode);
      });
    }

    if (mdSplitBtn) mdSplitBtn.addEventListener("click", function () { setMdMode("split"); });
    if (mdEditBtn) mdEditBtn.addEventListener("click", function () { setMdMode("edit"); });
    if (mdPreviewBtn) mdPreviewBtn.addEventListener("click", function () { setMdMode("preview"); });

    if (mdCopyBtn) {
      mdCopyBtn.addEventListener("click", function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(mdInput.value).then(function () {
            var prev = mdCopyBtn.textContent;
            mdCopyBtn.textContent = "Copied";
            setTimeout(function () {
              mdCopyBtn.textContent = prev;
            }, 1400);
          });
        }
      });
    }

    if (mdResetBtn) {
      mdResetBtn.addEventListener("click", function () {
        mdInput.value = DEFAULT_MD;
        mdPreview.innerHTML = renderMarkdown(DEFAULT_MD);
        try {
          localStorage.setItem(MD_STORAGE_KEY, DEFAULT_MD);
        } catch (e) {}
      });
    }
  }
})();
