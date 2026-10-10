#!/bin/sh
# Inicia el Centro de Control La Calera en http://localhost:8080 (requiere Python 3)
cd "$(dirname "$0")"
( sleep 1; (xdg-open http://localhost:8080/index.html || open http://localhost:8080/index.html) >/dev/null 2>&1 ) &
python3 -m http.server 8080
