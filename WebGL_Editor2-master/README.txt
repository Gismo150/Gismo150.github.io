Die Ausführung des WebGL-Editors ohne Webserver wird von vielen Browsern aus Sicherheitsgründen
blockiert. Grund hierfür ist, dass im WebGL-Editor verwendete Funktionen Dateien einlesen. 
Ohne Nutzung eines Webserver werden diese vom Lokalen system ausgelesen, was ohne explizite Zustimmung 
des Anwenders von fast allen Browsern nicht gestattet ist. 

Firefox ist einer der wenigen Browser die dies nicht blockieren 
und somit der WebGL-Editor ohne Webserver funktionsfähig ist. 
Um den WebGL-Editor im Browser vom lokalen System aus zu starten, so wählen Sie die "index.html"-Datei
mit Rechtsklick aus. Navigieren Sie zu "Öffnen mit" -> "Firefox".

Wird der Editor auf einen Server hochgeladen und anschließend per URL abgerufen,
so ist auch die Ausführung mit vollem Funktionsumfang unter Chrome möglich.
