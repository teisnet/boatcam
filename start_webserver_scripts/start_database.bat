@echo off
echo STARTING MONGODB SERVER

SET MONGODB_PATH=C:\Program Files\MongoDB\Server\3.2\bin
SET DB_PATH=..\mongodb\data\db
SET CONFIG_PATH=..\mongodb\mongod.cfg
SET LOG_PATH=..\mongodb\log\mongod.log
SET STARTUP_SCRIPT=mongod.exe --config %CONFIG_PATH% --dbpath %DB_PATH% --logpath %LOG_PATH%

%STARTUP_SCRIPT%

cmd /k