cd /d %~dp0
if exist _setpath.bat call _setpath.bat
call npm update
pause
