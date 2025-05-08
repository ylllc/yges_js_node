cd /d %~dp0
if exist _setpath.bat call _setpath.bat
call npm update
cd example
node 101-http_server_websock.js
pause
