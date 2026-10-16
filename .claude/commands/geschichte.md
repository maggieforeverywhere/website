---
description: Neue „Wer hätte das gedacht?"-Korea-Geschichte – von der Idee bis live
argument-hint: "[Thema, optional – z. B. Schuhe]"
---
Du hilfst Maggie (Autorin „Foreverywhere") beim Erstellen einer neuen Geschichte für
die Rubrik „Wer hätte das gedacht?" (Seite: wer-haette-das-gedacht-korea.html).

Vom Nutzer genanntes Thema (optional): $ARGUMENTS

Führe den gewohnten Ablauf aus:

1. **Thema wählen:** Wenn oben kein Thema steht, schlage per AskUserQuestion 3–4 reife
   Themen aus der Google-Drive-Ideensammlung („Eingang"/„Ideen-Pool") vor und lass Maggie wählen.
2. **Recherchieren:** Fakten gründlich prüfen (WebSearch, bei Bedarf „extended"). Keine
   KI-Floskeln. Ton: lebendig, humorvoll, persönlich – Muster: Beobachtung → neugierige
   Frage → gut recherchierte Antwort. Umfang ca. 500–800 Wörter.
3. **Einbauen** als neues `<article class="story" id="...">` in wer-haette-das-gedacht-korea.html, inklusive:
   - Sprungnavigations-Link oben
   - JSON-LD: neuer `Article`-Knoten + Eintrag in `hasPart`
   - Hub-Seite wer-haette-das-gedacht.html: Zähler, Teaser und Listeneintrag aktualisieren
   - Hero: Maggies EIGENES Foto, sonst eine Statistik-Karte (`.agecard`) oder ein Zitatblock (`.quotehero`).
     FOTO-REGELN: nur eigene oder frei lizenzierte Bilder, KEINE erkennbaren fremden Gesichter
     (bei Bedarf zuschneiden und das Ergebnis per Read-Tool prüfen). Keine Presse-/Internetfotos.
4. **Validieren:** Wortzahl und JSON-LD mit node prüfen; wer-haette-das-gedacht.txt neu erzeugen
   (make_whdg_txt-Skript im Scratchpad).
5. **Deployen:** committen auf `claude/website-development-err4qt`, dann ff-Merge nach `main`,
   pushen mit Retry (2s/4s/8s/16s). KEIN Modellname in Commit-Nachrichten.
6. **Ideensammlung aktualisieren:** die Geschichte in der Drive-Datei von „Eingang" nach
   „Veröffentlicht" verschieben (recreate-and-trash-Muster; bei Freigabe-Nachfrage Maggie fragen).
7. **Abschluss:** Maggie kurz und warm zusammenfassen, was live ist – mit Link und Wortzahl.
