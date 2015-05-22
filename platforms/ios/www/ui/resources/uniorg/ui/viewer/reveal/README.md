# Reveal 

`uo.ui.viewer.reveal`

**UI5 Version**
  
* Getestet: 1.22
* Minimum: 1.18

## Controls 

### Reveal  `uo.ui.viewer.reveal.Reveal`

Zeigt eine Präsentation mit [Reveal.js](https://github.com/hakimel/reveal.js).

**Methoden**

* next(): Nächster Schritt der Präsentation
* previous(): Vorheriger Schritt der Präsentation
* first():  Geht zur ersten Folie 
* last():  Geht zur letzten Folie 
* *Reveal* getReveal(): Gibt das zuständige Reveal-Objekt zurück. 

**Konfiguration** 

* *URI* slideSource:
    * URL zur HTML Datei mit der Präsentation. Sollte nur ein `<div class="slides">...</div>` mit allen Slides enthalten. 
    * default: null
* *boolean* controls:
    * Zeigt die Steuerung in der unteren rechten Ecke an.
    * default: true
* *boolean* progress:
    * Zeigt den Fortschritt der Präsentation an. 
    * default: true
* *boolean* slideNumber:
    * Zeigt die Nummer der Folie an. 
    * default: false
* *boolean* overview:
    * Aktiviert die Übersichtsansicht die mit ESC aufgerufen werden kann.
    * default: true
* *boolean* center:
    * Zentriert den Inhalt der Folien vertikal im Frame
    * default: true
* *boolean* loop:
    * Präsentation als Schleife darstellen
    * default: false
* *boolean* rtl:
    * RTL Support
    * default: false
* *boolean* fragments:
    * Schaltet Fragmente global an oder aus.
    * default: true
* *string* transition:
    * Definiert den Folienübergang.
    * Wertebereich: [ default | none | fade | slide | concave | zoom ]
    * default: "default"
* *string* transitionSpeed:
    * Bestimmt die Geschwindigkeit der Folienübergänge
    * Wertebereich: [ default | fast | slow ]
    * default: "default"
* *string* theme:
    * Setzt den Namen des Themes
    * default: "default"