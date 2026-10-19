/* Sprachbutton · Language button (v2)
   Bringt die Seite ins Englische – robust, auch wenn Googles Übersetzer-Proxy
   in einer Region gesperrt ist.
   1) Beim Tippen: Googles In-Page-Übersetzer (übersetzt direkt auf der Seite,
      KEINE Weiterleitung auf die regional gesperrte translate.goog-Ansicht).
   2) Klappt das nicht (gesperrt/nicht erreichbar), erscheint eine kurze
      englische Anleitung, wie der Browser selbst übersetzt – das geht überall.
   Auf der bereits übersetzten Ansicht erscheint der Knopf nicht. */
(function () {
  "use strict";
  try { if (location.hostname.indexOf("translate.goog") !== -1) return; } catch (e) { return; }

  var LABEL = "🌐 English";
  var btn, widgetRequested = false;

  /* ---------- Googles In-Page-Widget (lazy, erst beim ersten Tippen) ---------- */
  function requestWidget() {
    if (widgetRequested) return;
    widgetRequested = true;
    try {
      var holder = document.createElement("div");
      holder.id = "google_translate_element";
      holder.style.display = "none";
      document.body.appendChild(holder);
      window.googleTranslateElementInit = function () {
        try {
          new google.translate.TranslateElement(
            { pageLanguage: "de", includedLanguages: "en", autoDisplay: false },
            "google_translate_element");
        } catch (e) {}
      };
      var s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.onerror = function () { widgetRequested = "failed"; };
      document.body.appendChild(s);
    } catch (e) { widgetRequested = "failed"; }
  }

  function combo() { return document.querySelector(".goog-te-combo"); }

  function translateNow() {
    var c = combo();
    if (!c) return false;
    c.value = "en";
    c.dispatchEvent(new Event("change"));
    return true;
  }

  function onClick(ev) {
    ev.preventDefault();
    if (translateNow()) return;            // Widget schon bereit → sofort übersetzen
    btn.textContent = "⏳ …";
    requestWidget();
    var waited = 0;
    var iv = setInterval(function () {
      waited += 300;
      if (translateNow()) { clearInterval(iv); btn.textContent = LABEL; return; }
      if (widgetRequested === "failed" || waited >= 6000) {
        clearInterval(iv); btn.textContent = LABEL; showHelp();
      }
    }, 300);
  }

  /* ---------- Fallback: freundliche englische Anleitung (geht in jeder Region) ---------- */
  function showHelp() {
    if (document.getElementById("lang-help-overlay")) return;

    var back = document.createElement("div");
    back.id = "lang-help-overlay";
    var bs = back.style;
    bs.position = "fixed"; bs.inset = "0"; bs.zIndex = "10000";
    bs.background = "rgba(44,24,16,0.55)";
    bs.display = "flex"; bs.alignItems = "center"; bs.justifyContent = "center";
    bs.padding = "20px"; bs.boxSizing = "border-box";

    var card = document.createElement("div");
    var cs = card.style;
    cs.background = "#faf6ef"; cs.color = "#3a2a1a";
    cs.maxWidth = "420px"; cs.width = "100%";
    cs.borderRadius = "16px"; cs.padding = "26px 24px";
    cs.boxShadow = "0 20px 60px rgba(44,24,16,0.4)";
    cs.font = '400 16px/1.6 "Lora", Georgia, serif';
    cs.boxSizing = "border-box";

    card.innerHTML =
      '<div style="font:600 20px/1.3 \'Cormorant Garamond\',\'Lora\',Georgia,serif;color:#5B3A29;margin-bottom:6px;">Read this page in English</div>' +
      '<p style="margin:0 0 14px;color:#7a6b5a;font-size:14px;">Your browser can translate the whole page for you — this works everywhere, for free:</p>' +
      '<ul style="margin:0 0 18px;padding-left:20px;">' +
        '<li style="margin:6px 0;"><strong>iPhone (Safari):</strong> tap <strong>aA</strong> in the address bar → <em>Translate to English</em>.</li>' +
        '<li style="margin:6px 0;"><strong>Android (Chrome):</strong> tap the <strong>⋮</strong> menu → <em>Translate…</em></li>' +
        '<li style="margin:6px 0;"><strong>Computer (Chrome / Edge):</strong> right-click the page → <em>Translate to English</em>.</li>' +
      '</ul>' +
      '<button id="lang-help-close" style="display:block;width:100%;border:0;cursor:pointer;background:#5B3A29;color:#faf6ef;font:600 15px/1 \'Lora\',Georgia,serif;padding:12px 14px;border-radius:999px;">Got it · Schließen</button>';

    back.appendChild(card);
    back.addEventListener("click", function (e) { if (e.target === back) back.remove(); });
    document.body.appendChild(back);
    var close = document.getElementById("lang-help-close");
    if (close) close.addEventListener("click", function () { back.remove(); });
  }

  /* ---------- Der Knopf ---------- */
  function build() {
    if (!document.body || document.getElementById("lang-translate-btn")) return;

    btn = document.createElement("a");
    btn.id = "lang-translate-btn";
    btn.href = "#";
    btn.title = "Diese Seite auf Englisch · Read this page in English";
    btn.setAttribute("aria-label", "Read this page in English");
    btn.textContent = LABEL;

    var s = btn.style;
    s.position = "fixed"; s.bottom = "18px"; s.right = "18px"; s.zIndex = "9999";
    s.font = '600 14px/1 "Lora", Georgia, serif';
    s.background = "#5B3A29"; s.color = "#faf6ef"; s.textDecoration = "none";
    s.padding = "11px 15px"; s.borderRadius = "999px";
    s.boxShadow = "0 6px 18px rgba(44,24,16,0.28)";
    s.letterSpacing = "0.3px"; s.border = "1px solid rgba(250,246,239,0.25)";
    s.transition = "transform .15s ease, box-shadow .15s ease";
    s.webkitTapHighlightColor = "transparent"; s.cursor = "pointer";

    btn.addEventListener("mouseenter", function () {
      s.transform = "translateY(-2px)"; s.boxShadow = "0 10px 24px rgba(44,24,16,0.34)";
    });
    btn.addEventListener("mouseleave", function () {
      s.transform = "none"; s.boxShadow = "0 6px 18px rgba(44,24,16,0.28)";
    });
    btn.addEventListener("click", onClick);

    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
