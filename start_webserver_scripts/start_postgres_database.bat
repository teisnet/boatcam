@echo off
setlocal

set PORT=5432
rem set DB_PATH=..\database\data\postgres
set DB_PATH="C:\Program Files\DATABASE\PostgreSQL\9.6\data"
set LOG_PATH=..\database\log\postgres.log

title START POSTGRES DATABASE, port %PORT%
echo.
echo  START POSTGRES DATABASE, port %PORT%
echo.
echo ----------------------------------------------------------------
echo.

rem runservice -N "postgresql-x64-9.6" -D "C:\Program Files\DATABASE\PostgreSQL\9.6\data" -w

pg_ctl -D %DB_PATH% -l %LOG_PATH% -o "-F -p %PORT%" start

echo.
echo ----------------------------------------------------------------
echo.
if errorlevel 1 echo ERROR STARTING DATABASE
echo.
echo.

cmd /k
endlocal
