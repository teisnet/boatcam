@echo off
title MONGODUMP DATABASE BACKUP
echo.
echo  MONGODUMP DATABASE BACKUP
echo.
echo ----------------------------------------------------------------
echo.
@echo on

mongodump --db test -o mongodump

@echo off
echo.
cmd /k
