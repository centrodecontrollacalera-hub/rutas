@echo off
rem Inicia el Centro de Control La Calera en http://localhost:8080 (requiere Python instalado)
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 ( start "" http://localhost:8080/index.html & py -m http.server 8080 & goto :eof )
where python >nul 2>nul
if %errorlevel%==0 ( start "" http://localhost:8080/index.html & python -m http.server 8080 & goto :eof )
echo No se encontro Python. Instalelo desde https://www.python.org/downloads/ (marque "Add Python to PATH") o publique la carpeta en un hosting estatico (ver LEEME.md).
pause
