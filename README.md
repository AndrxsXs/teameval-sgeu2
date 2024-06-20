# Proyecto TeamEval SGEU-2

Este es el repositorio del proyecto TeamEval, una aplicación web que facilita la evaluación por pares del desempeño individual dentro de equipos en contextos educativos.

Existen tres roles principales:

1. Administrador. Encargado de gestionar las cuentas de los otros tipos de usuarios, criterios predeterminados, cursos y evaluaciones.

2. Docente. Es el usuario que se encarga de administrar sus cursos y grupos para poder gestionar a sus estudiantes. Puede crear sus própias rúbricas y evaluaciones, iniciarlas o finalizaras. Puede visualizar informes detallados de cada evaluación realizada.

3. Estudiante. Donde podrá calificar a sus otros compañeros de grupo (equipo), luego, podrá visualizar los resultados de las´calificaciones que recibió de sus contrapartes de manera anónima.

## Estructura del proyecto

El proyecto se compone de dos partes principales:

1. Frontend: Desarrollado con React, React
   Router, Material-UI (MUI) y Joy UI.
2. Backend: Desarrollado con Django, Djang
   REST Framework y PostgreSQL.

## Tecnologías requeridas

Se necesita tener instalado lo siguiente para poder trabajar en cada máquina.

#### Frontend

- Node.js: https://nodejs.org/es/download

#### Backend

- Python: https://www.python.org/downloads/

## Inicialización del proyecto

#### Clonar el repositorio

Comience clonando el repositorio en su PC:

```sh
git clone https://github.com/AndrxsXs/teameval-sgeu2.git
```

#### Backend (Django)

1. Acceda al directorio del backend:

   ```sh
   cd teameval-sgeu2/backend

   ```

2. Cree y active el entorno virtual:

   ```sh
   python -m venv env
   ```

   Luego ejecute una de las siguientes líneas de código:

   ```sh
   env\Scripts\activate #Para usuarios con Windows
   ```

   ```sh
   source venv/bin/activate #Para usuarios con Linux o Mac
   ```

3. Instale las dependencias del backend:

   ```sh
   pip install -r requerimientos.txt
   ```

4. Realice las migraciones correspondientes de los modelos:

   ```sh
   python manage.py makemigrations
   ```

   ```sh
   python manage.py migrate
   ```

#### Frontend (React)

1. Acceder al directorio del frontend:

   ```sh
   cd teameval-sgeu2/frontend
   ```

2. Instalar las dependencias del frontend:
   ```sh
   npm install
   ```

## Ejecución

Para poder ejecutar en su PC tanto el backend como el frontend haga lo siquiente:

#### Backend (en `/teameval-sgeu2/backend`)

```sh
python manage.py runserver [puerto específico (opcional)]
```

Ejemplo:

`python manage.py runserver 8000`

#### Frontend (en `/teameval-sgeu2/frontend`)

```sh
npm run dev
```

## 🛠️ Stack

![React][badgeReact] - A JavaScript library for building user interfaces.

![JavaScript][badgeJavaScript] - A high-level, often just-in-time compiled language that conforms to the ECMAScript specification.

![MUI][badgeMUI] - A popular React UI framework.

![Axios][badgeAxios] - A promise-based HTTP client for the browser and Node.js.

![Django][badgeDjango] - A high-level Python Web framework that encourages rapid development and clean, pragmatic design.

![Python][badgePython] - A high-level, general-purpose programming language.

![PostgreSQL][badgePostgreSQL] - A powerful, open-source object-relational database system.

[badgeReact]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[badgeJavaScript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[badgeMUI]: https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white
[badgeAxios]: https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white
[badgeDjango]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white
[badgePython]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[badgePostgreSQL]: https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white
