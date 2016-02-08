@echo off
mongoexport --pretty --db test --collection cameras --out mongoexport/cameras.json
mongoexport --pretty --db test --collection berths --out mongoexport/berths.json
cmd /k