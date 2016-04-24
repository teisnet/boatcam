@echo off
setlocal
title EXPORT DATABASE TO JSON
echo.
echo  EXPORT DATABASE TO JSON
echo.
echo ----------------------------------------------------------------
echo.

set DB=test
set PARAMS=--pretty --jsonArray
set OUT_PATH=mongoexport

@echo on
mongoexport --db %DB% --collection users --out %OUT_PATH%/users.json %PARAMS%
mongoexport --db %DB% --collection cameras --out %OUT_PATH%/cameras.json %PARAMS%
mongoexport --db %DB% --collection berths --out %OUT_PATH%/berths.json %PARAMS%
mongoexport --db %DB% --collection camera_positions --out %OUT_PATH%/cameraPositions.json %PARAMS%
@echo off

cmd /k
endlocal
