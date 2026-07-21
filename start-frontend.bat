@echo off
echo Starting ExamInsight Frontend dev server using portable Node...
SET "PATH=%~dp0node-portable\node-v20.11.1-win-x64;%PATH%"
npm run dev
