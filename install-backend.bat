@echo off
echo Installing backend dependencies...
cd /d "C:\Users\justi\Downloads\GISMININGAPP\backend"
echo Current directory: %CD%
echo Installing npm packages...
npm install express
npm install pg
npm install cors
npm install nodemon --save-dev
echo.
echo Dependencies installation complete!
echo.
echo To start the backend server, run:
echo npm start
echo.
echo Or for development with auto-restart:
echo npm run dev
pause
