@echo off
title MONGODUMP DATABASE RESTORE
echo.
echo  MONGODUMP DATABASE RESTORE
echo.
echo ----------------------------------------------------------------
echo.
@echo on

mongorestore --db test mongodump/test

@echo off
echo.
cmd /k
