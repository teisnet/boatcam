@echo off
setlocal
title MONGODB BOATCAM SERVER
echo.
echo  MONGODB BOATCAM SERVER
echo.
echo ----------------------------------------------------------------
echo.

SET MONGODB_PATH=C:\Program Files\MongoDB\Server\3.2\bin
SET DB_PATH=..\database\data\db
SET CONFIG_PATH=..\database\mongod.cfg
SET LOG_PATH=..\database\log\mongod.log
SET STARTUP_SCRIPT=mongod.exe --config %CONFIG_PATH% --dbpath %DB_PATH% --logpath %LOG_PATH%

%STARTUP_SCRIPT%

echo.
echo ----------------------------------------------------------------
echo.
if errorlevel 1 echo ERROR STARTING DATABASE (CHECK IT IS NOT ALREADY STARTED)
echo.
echo.

cmd /k
endlocal
