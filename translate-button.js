/* Sprachbutton · Language button
   Fügt einen dezenten „🌐 English"-Knopf hinzu, der die aktuelle Seite über den
   Google-Übersetzer ins Englische bringt. Eine Datei, auf allen Seiten eingebunden.
   Auf der bereits übersetzten Google-Ansicht (translate.goog) erscheint er nicht –
   dort bietet Google selbst den Weg zurück zum Original. */
(function () {
  "use strict";
  try {
    if (location.hostname.indexOf("translate.goog") !== -1) return;
  } catch (e) { return; }

  function build() {
    if (!document.body || document.getElementById("lang-translate-btn")) return;

    var a = document.createElement("a");
    a.id = "lang-translate-btn";
    a.href = "https://translate.google.com/translate?sl=de&tl=en&u=" +
             encodeURIComponent(location.href);
    a.rel = "noopener";
    a.title = "Diese Seite auf Englisch · Translate this page to English";
    a.setAttribute("aria-label", "Translate this page to English");
    a.textContent = "🌐 English";

    var s = a.style;
    s.position = "fixed";
    s.bottom = "18px";
    s.right = "18px";
    s.zIndex = "9999";
    s.font = '600 14px/1 "Lora", Georgia, serif';
    s.background = "#5B3A29";
    s.color = "#faf6ef";
    s.textDecoration = "none";
    s.padding = "11px 15px";
    s.borderRadius = "999px";
    s.boxShadow = "0 6px 18px rgba(44,24,16,0.28)";
    s.letterSpacing = "0.3px";
    s.border = "1px solid rgba(250,246,239,0.25)";
    s.transition = "transform .15s ease, box-shadow .15s ease";
    s.webkitTapHighlightColor = "transparent";

    a.addEventListener("mouseenter", function () {
      s.transform = "translateY(-2px)";
      s.boxShadow = "0 10px 24px rgba(44,24,16,0.34)";
    });
    a.addEventListener("mouseleave", function () {
      s.transform = "none";
      s.boxShadow = "0 6px 18px rgba(44,24,16,0.28)";
    });

    document.body.appendChild(a);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
