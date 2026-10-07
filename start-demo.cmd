@echo off
title INzicht demo - localhost:8160
cd /d "%~dp0"
start "" http://localhost:8160/
node "%~dp0..\serve.cjs" "%~dp0." 8160
