@echo off
setlocal
echo.
echo  HANVEWEB DEBUG MODE
echo.
echo ----------------------------------------------------------------
echo.

set NODE_ENV=development
rem set DEBUG=express:*
set DEBUG=havneweb:*
set PORT=3000
rem set CONFIG=./config/config.json

title HAVNEWEB port: %PORT%, debug mode

pushd ..
node --debug=5858 ./bin/www
rem node --debug-brk=5858 ./bin/www
popd

cmd /k
endlocal
