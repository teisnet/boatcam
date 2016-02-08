@echo off
setlocal
echo.
echo  HAVNEWEB RELEASE MODE
echo.
echo ----------------------------------------------------------------
echo.

set NODE_ENV=production
REM set DEBUG=express:*
set DEBUG=havneweb:*
set PORT=3000
rem set CONFIG=./config/config.json

title HAVNEWEB port: %PORT%, release mode

pushd ..
node ./bin/www
popd

cmd /k
endlocal
