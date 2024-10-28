cd /d %~dp0
if exist _setpath.bat call _setpath.bat
cd test
node --test
pause
