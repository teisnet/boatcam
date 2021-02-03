@echo off
setlocal

rem set DB_PATH=..\database\data\postgres
set DB_PATH="C:\Program Files\DATABASE\PostgreSQL\9.6\data"

title STOP POSTGRES DATABASE
echo.
echo  STOP POSTGRES DATABASE
echo.
echo ----------------------------------------------------------------
echo.

pg_ctl -D %DB_PATH% stop

echo.
echo ----------------------------------------------------------------
echo.
if errorlevel 1 echo ERROR STOPPING DATABASE
echo.
echo.

cmd /k
endlocal
