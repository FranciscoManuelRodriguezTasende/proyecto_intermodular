# 🏋️‍♂️ FitGym - Sistema de Gestión de Gimnasio

![Estado: Finalizado](https://img.shields.io/badge/Estado-Finalizado-success)
![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Django](https://img.shields.io/badge/Django-4.x-092E20?logo=django)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript)

## 📝 Descripción del Proyecto

FitGym es una aplicación web integral diseñada para la administración y el control centralizado de los recursos de un centro deportivo. Esta herramienta está dirigida al personal de administración y gerencia del gimnasio, permitiendo digitalizar procesos manuales y tener un control total sobre los miembros, las tarifas y el equipo de monitores.

Este proyecto ha sido estructurado como el **Proyecto Intermodular del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)**, cumpliendo con la modalidad de interfaz de usuario cliente enriquecida y desacoplada que consume de forma asíncrona una API REST.

## 🚀 Estado del Proyecto

✔️ **MVP (Producto Mínimo Viable) Completado.** El proyecto cumple con todos los requisitos básicos de gestión y conexión asíncrona entre cliente y servidor.

## ✨ Características de la Aplicación

- **Control de Acceso (Roles):** Sistema de visualización dinámico dependiendo de si el usuario es un socio estándar o un administrador.
- **Gestión de Socios (CRUD):** Creación, lectura, actualización y eliminación de miembros, con asignación de tarifas personalizadas.
- **Gestión de Monitores (CRUD):** Panel de control para administrar la plantilla de trabajadores y las clases que imparten.
- **Búsqueda en tiempo real:** Filtrado dinámico de usuarios desde el cliente sin necesidad de recargar la página.
- **Interfaz SPA (Single Page Application):** Navegación fluida y ventanas modales generadas dinámicamente con JavaScript.

## 💻 Tecnologías Utilizadas

El diseño de FitGym se basa en una arquitectura cliente-servidor estricta:

**Frontend (Capa de Presentación)**
- HTML5 (Estructura semántica)
- CSS3 (Diseño modular, Flexbox y Grid, Responsive Design)
- JavaScript Vanilla (Peticiones asíncronas `fetch`, manipulación del DOM)

**Backend (Capa de Negocio y Datos)**
- Python 3.10+
- Django (Framework backend para la creación de la API REST)
- SQLite (Base de datos relacional integrada)
- Librerías adicionales: `django-cors-headers` (Para permitir la comunicación cruzada entre el puerto del frontend y el del backend).

---

## 🛠️ Acceso y Configuración del Proyecto (Guía paso a paso)

Sigue estos pasos para arrancar el proyecto en tu máquina local desde cero. No necesitas conocimientos previos avanzados.

### Requisitos previos
Debes tener instalado en tu ordenador:
1. **Python** (versión 3.10 o superior). [Descargar aquí](https://www.python.org/downloads/).
2. **Visual Studio Code** (o tu editor de código favorito).

### Paso 1: Descargar el proyecto
Clona este repositorio en tu ordenador o descarga el archivo `.zip` y descomprímelo.
```bash
git clone <url-de-tu-repositorio>
```

### Paso 2: Arrancar el Servidor (Backend)
Abre una terminal en Visual Studio Code, navega hasta la carpeta `backend` y ejecuta los siguientes comandos:

1. **Crear un entorno virtual** (para aislar las dependencias):
   ```bash
   python -m venv venv
   ```
2. **Activar el entorno virtual**:
   - En Windows: `.\venv\Scripts\activate`
   - En Mac/Linux: `source venv/bin/activate`
3. **Instalar las librerías necesarias**:
   ```bash
   pip install django django-cors-headers
   ```
   *(Nota: Si existe un archivo `requirements.txt`, ejecuta directamente `pip install -r requirements.txt`)*
4. **Preparar la base de datos SQLite**:
   ```bash
   python manage.py migrate
   ```
5. **Encender el servidor**:
   ```bash
   python manage.py runserver
   ```
   *⚠️ Importante: Deja esta terminal abierta y corriendo en segundo plano. El servidor local estará funcionando en `http://127.0.0.1:8000/`.*

### Paso 3: Arrancar la Interfaz Web (Frontend)
1. Abre una nueva terminal o utiliza el explorador de archivos para ir a la carpeta `frontend/html/`.
2. Busca el archivo `login.html` (o `index.html`).
3. Para una mejor experiencia, ábrelo utilizando la extensión **Live Server** de Visual Studio Code (Click derecho sobre el archivo -> *Open with Live Server*). 
4. Utiliza las siguientes credenciales de prueba para acceder:
   - **Administrador:** Usuario: `admin` / Contraseña: `1234`
   - **Socio:** Usuario: `pepe` / Contraseña: `1234`

---

## 📁 Estructura del Repositorio

```text
proyecto_intermodular/
├── backend/                 # Arquitectura de la API REST (Python/Django)
│   ├── core/                # Configuración global del proyecto de Django
│   ├── gimnasio/            # Aplicación encargada del negocio del gimnasio
│   ├── db.sqlite3           # Archivo de base de datos relacional SQLite
│   └── manage.py            # Utilidad de comandos de gestión de Django
├── frontend/                # Capa de Interfaz de Usuario (UI)
│   ├── html/                # Vistas y modales
│   ├── css/                 # Estilos en cascada modulares
│   └── js/                  # Controladores de eventos e integración con API REST
└── README.md                # Documentación del proyecto
```

## ✒️ Autor

* **Francisco Manuel Rodríguez Tasende** - *Desarrollo Full Stack (DAW)*
