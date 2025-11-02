@echo off
title Iniciando SmartSpace Project

echo Iniciando backend...
echo ================================
cd backend
start cmd /k "npm run dev"
cd ..

echo Iniciando frontend...
echo ================================
cd frontend
start cmd /k "npm run dev"
cd ..

echo Todos los servicios han sido iniciados.
pause
