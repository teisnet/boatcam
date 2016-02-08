@echo off
setlocal
echo.
echo  MONGODB SERVER
echo.
echo ----------------------------------------------------------------
echo.
title MONGODB SERVER

SET MONGODB_PATH=C:\Program Files\MongoDB\Server\3.2\bin
SET DB_PATH=..\database\data\db
SET CONFIG_PATH=..\database\mongod.cfg
SET LOG_PATH=..\database\log\mongod.log
SET STARTUP_SCRIPT=mongod.exe --config %CONFIG_PATH% --dbpath %DB_PATH% --logpath %LOG_PATH%

%STARTUP_SCRIPT%

cmd /k
endlocal