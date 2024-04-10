# Pyoyecto TeamEval SGEU-2

Este es el repositorio del proyecto TeamEval, una aplicación web que facilita la evaluación por pares del desempeño individual dentro de equipos en contextos educativos.

## Estructura del proyecto
El proyecto se compone de dos partes principales:

1. Frontend: Desarrollado con React, React
Router, Material-UI (MUI) y Joy UI.
2. Backend: Desarrollado con Django, Djang
REST Framework y PostgreSQL.

## Tecnologías requeridas

Se necesita tener instalado lo siguiente para poder trabajar en cada máquina.

#### Frontend
1. Node.js: https://nodejs.org/es/download

#### Backend
1. Python: https://www.python.org/downloads/

## Inicialización del proyecto

#### Clonar el repositorio
Comience clonando el repositorio en su máquina local:

`git clone https://github.com/AndrxsXs/teameval-sgeu2.git`

#### Backend (Django)
1. Acceda al directorio del backend:

    - `cd teameval-sgeu2/backend`

2. Cree y active el entorno virtual:

    - `python -m venv env`
    
    - `env\Scripts\activate`

3. Instale las dependencias del backend:

    - `pip install -r requerimientos.txt`

#### Frontend (React)

1. Acceder al directorio del frontend:

    - `cd teameval-sgeu2/frontend`

2. Instalar las dependencias del frontend:
    - `npm install`

## Ejecución

Para poder ejecutar en su PC tanto el backend como el frontend haga lo siquiente:

#### Backend

`python manage.py runserver [servidor específico (opcional)]`

Ejemplo:
    
`python manage.py runserver 8000`

#### Frontend

`npm run dev`