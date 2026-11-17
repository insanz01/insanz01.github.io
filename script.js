(function () {
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var copyBtn = document.getElementById("copy-email");
  var yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (themeToggle) {
    var syncToggleState = function (theme) {
      themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    };

    syncToggleState(root.dataset.theme || "light");

    themeToggle.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      syncToggleState(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  if (copyBtn) {
    var defaultLabel = copyBtn.textContent;
    var timerId = null;

    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      if (!email) return;

      var onCopied = function () {
        copyBtn.textContent = "Copied";
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(function () {
          copyBtn.textContent = defaultLabel;
        }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(onCopied).catch(function () {});
      }
    });
  }
})();
