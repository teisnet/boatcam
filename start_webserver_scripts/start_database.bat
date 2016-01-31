@echo off
echo STARTING MONGODB SERVER

SET MONGODB_PATH=C:\Program Files\MongoDB\Server\3.2\bin
SET STARTUP_SCRIPT="%MONGODB_PATH%\mongod.exe"

%STARTUP_SCRIPT%

cmd /k