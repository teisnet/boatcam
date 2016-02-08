@echo off
mongoimport --db test --collection cameras --file mongoexport/cameras.json
mongoImport --db test --collection berths --file mongoexport/berths.json
cmd /k