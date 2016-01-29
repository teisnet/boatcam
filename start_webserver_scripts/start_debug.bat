@echo off
setlocal
echo.
echo  HANVEWEB DEBUG MODE
echo.
echo ----------------------------------------------------------------
echo.
set NODE_ENV=development
REM set DEBUG=express:*
set DEBUG=kejdApp
set PORT=3000
set CONFIG=./sites/kejd/config.json

title HAVNEWEB port: %PORT%, debug mode
pushd ..
node --debug=5858 ./bin/www
rem node --debug-brk=5858 ./bin/www
popd
cmd /k
endlocal