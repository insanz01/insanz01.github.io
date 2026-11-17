(function () {
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var copyBtn = document.getElementById("copy-email");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function applyTheme(next) {
    root.dataset.theme = next;
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
    }
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  }

  window.__setTheme = function (mode) {
    if (mode === "light" || mode === "dark") {
      applyTheme(mode);
      return mode;
    }
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    return next;
  };

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", root.dataset.theme === "dark" ? "true" : "false");
    themeToggle.addEventListener("click", function () {
      window.__setTheme();
    });
  }

  function copyText(text, onSuccess) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(function () {});
    }
  }

  if (copyBtn) {
    var defaultLabel = copyBtn.textContent;
    var timerId = null;

    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      if (!email) return;

      copyText(email, function () {
        copyBtn.textContent = "Copied";
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(function () {
          copyBtn.textContent = defaultLabel;
        }, 1800);
      });
    });
  }

  // Command Palette (Cmd+K / Ctrl+K)
  var cmdDialog = document.getElementById("cmd-dialog");
  var cmdTrigger = document.getElementById("cmd-trigger");
  var cmdClose = document.getElementById("cmd-close");
  var cmdInput = document.getElementById("cmd-input");
  var cmdList = document.getElementById("cmd-list");

  if (cmdDialog && cmdInput && cmdList) {
    var commands = [
      {
        label: "Open Playground: Terminal",
        hint: "app",
        run: function () {
          jumpToPlayground("terminal");
        },
      },
      {
        label: "Open Playground: Dev Utils (JSON / JWT / Time)",
        hint: "app",
        run: function () {
          jumpToPlayground("utils");
        },
      },
      {
        label: "Open Playground: Rate Limiter Simulator",
        hint: "app",
        run: function () {
          jumpToPlayground("ratelimit");
        },
      },
      {
        label: "Open Playground: Markdown Scratchpad",
        hint: "app",
        run: function () {
          jumpToPlayground("markdown");
        },
      },
      {
        label: "Jump to Selected Projects",
        hint: "section",
        run: function () {
          scrollToId("projects");
        },
      },
      {
        label: "Jump to Experience",
        hint: "section",
        run: function () {
          scrollToId("experience");
        },
      },
      {
        label: "Jump to Contact",
        hint: "section",
        run: function () {
          scrollToId("contact");
        },
      },
      {
        label: "Toggle Light / Dark Theme",
        hint: "theme",
        run: function () {
          window.__setTheme();
        },
      },
      {
        label: "Copy Email (insankamil002@gmail.com)",
        hint: "action",
        run: function () {
          copyText("insankamil002@gmail.com", function () {});
        },
      },
      {
        label: "Open GitHub Profile",
        hint: "external",
        run: function () {
          window.open("https://github.com/insanz01", "_blank", "noopener,noreferrer");
        },
      },
    ];

    var filtered = commands.slice();
    var activeIdx = 0;

    function scrollToId(id) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function jumpToPlayground(tabId) {
      if (typeof window.__openPlaygroundTab === "function") {
        window.__openPlaygroundTab(tabId);
      }
      scrollToId("playground");
    }

    function renderList() {
      cmdList.textContent = "";
      if (filtered.length === 0) {
        var empty = document.createElement("li");
        empty.className = "cmd-empty";
        empty.textContent = "No matching commands";
        cmdList.appendChild(empty);
        return;
      }

      filtered.forEach(function (item, idx) {
        var li = document.createElement("li");
        li.className = "cmd-item";
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", idx === activeIdx ? "true" : "false");

        var label = document.createElement("span");
        label.textContent = item.label;

        var hint = document.createElement("span");
        hint.className = "cmd-item-hint";
        hint.textContent = item.hint;

        li.appendChild(label);
        li.appendChild(hint);

        li.addEventListener("mouseenter", function () {
          activeIdx = idx;
          updateSelection();
        });

        li.addEventListener("click", function () {
          executeIndex(idx);
        });

        cmdList.appendChild(li);
      });
    }

    function updateSelection() {
      var items = cmdList.querySelectorAll(".cmd-item");
      items.forEach(function (el, idx) {
        el.setAttribute("aria-selected", idx === activeIdx ? "true" : "false");
      });
    }

    function executeIndex(idx) {
      var item = filtered[idx];
      if (!item) return;
      cmdDialog.close();
      item.run();
    }

    function openPalette() {
      cmdInput.value = "";
      filtered = commands.slice();
      activeIdx = 0;
      renderList();
      if (!cmdDialog.open) {
        cmdDialog.showModal();
      }
      cmdInput.focus();
    }

    if (cmdTrigger) {
      cmdTrigger.addEventListener("click", openPalette);
    }

    if (cmdClose) {
      cmdClose.addEventListener("click", function () {
        cmdDialog.close();
      });
    }

    cmdDialog.addEventListener("click", function (e) {
      if (e.target === cmdDialog) {
        cmdDialog.close();
      }
    });

    cmdInput.addEventListener("input", function () {
      var q = cmdInput.value.trim().toLowerCase();
      filtered = commands.filter(function (c) {
        return c.label.toLowerCase().indexOf(q) !== -1 || c.hint.toLowerCase().indexOf(q) !== -1;
      });
      activeIdx = 0;
      renderList();
    });

    cmdInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (filtered.length > 0) {
          activeIdx = (activeIdx + 1) % filtered.length;
          updateSelection();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (filtered.length > 0) {
          activeIdx = (activeIdx - 1 + filtered.length) % filtered.length;
          updateSelection();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeIndex(activeIdx);
      }
    });

    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (cmdDialog.open) {
          cmdDialog.close();
        } else {
          openPalette();
        }
      }
    });
  }
})();
