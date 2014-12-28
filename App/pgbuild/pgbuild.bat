set SOURCE=..\bld\Distribution
set ZIP=com.deadlinegamedev.DeadlineGameDev.zip
set FILES=tmp

rmdir /S /Q %FILES%
del %ZIP%

mkdir %FILES%
mkdir %FILES%\res\icons\android
mkdir %FILES%\res\screens\android
xcopy %SOURCE%\config.xml %FILES%\
xcopy /E %SOURCE%\res\icons\android\* %FILES%\res\icons\android\
xcopy /E %SOURCE%\res\screens\android\* %FILES%\res\screens\android\
xcopy /E /EXCLUDE:ignore.txt %SOURCE%\www\* %FILES%\

cd %FILES%
"C:\Program Files\7-Zip\7z.exe" a -tzip ..\%ZIP% *
cd ..

rmdir /S /Q %FILES%

if exist %ZIP% (
	curl.exe --insecure -u info@deadlinegamedev.com -X PUT -F file=@%ZIP% https://build.phonegap.com/api/v1/apps/1092306
	del %ZIP%
) else (
	@echo ERROR
	@pause>nul
)