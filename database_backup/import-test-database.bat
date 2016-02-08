@echo off
setlocal
title IMPORT JSON INTO DATABASE
echo.
echo  IMPORT JSON INTO DATABASE
echo.
echo ----------------------------------------------------------------
echo.

set DB=test
set PARAMS=--jsonArray
set FILE_PATH=mongoexport

@echo on
mongoimport --db %DB% --collection cameras --file %FILE_PATH%/cameras.json %PARAMS%
mongoimport --db %DB% --collection berths --file %FILE_PATH%/berths.json %PARAMS%
@echo off

cmd /k
endlocal
