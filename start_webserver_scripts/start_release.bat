@echo off
setlocal
echo.
echo  BOATCAM RELEASE MODE
echo.
echo ----------------------------------------------------------------
echo.

set NODE_ENV=production
REM set DEBUG=express:*
set DEBUG=boatcam:*
set PORT=3000
rem set CONFIG=./config/config.json

title BOATCAM port: %PORT%, release mode

pushd ..
node ./bin/www
popd

cmd /k
endlocal
