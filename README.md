# FitGym - Sistema de Gestión de Gimnasio

## 1. Descripción del Proyecto y Ámbito de Implantación

FitGym es una aplicación web integral diseñada para la administración y el control centralizado de los recursos de un centro deportivo. Esta herramienta está dirigida al personal de administración y gerencia del gimnasio, permitiendo digitalizar procesos como la gestión de miembros, tarifas y clases.

Este proyecto ha sido estructurado siguiendo el modelo de **Proyecto Intermodular del Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)** para el Centro de Formación Profesional Afundación - ABANCA, cumpliendo estrictamente con las especificaciones de la **Modalidad Tipo 2**: una interfaz de usuario cliente enriquecida y desacoplada que consume de forma asíncrona una **API REST** de arquitectura propia.

## 2. Objetivos del Proyecto

* **Objetivo General:** Desarrollar una aplicación web funcional tipo panel de administración (Dashboard) para gestionar de forma integral los recursos del gimnasio.
* **Objetivos Específicos:**
  * Crear un sistema de gestión (CRUD) automatizado para socios y monitores.
  * Implementar una gestión de socios vinculados a distintas tarifas modulares.
  * Diseñar una interfaz intuitiva, accesible y adaptable utilizando HTML semántico, CSS y JavaScript Vanilla.
  * Desarrollar y exponer una API REST segura con el framework Django (Python) para el backend.

---

## 3. Arquitectura de la Aplicación

El diseño de FitGym se basa en una arquitectura cliente-servidor, separando claramente la capa de presentación (Frontend) de la lógica de negocio y persistencia de datos (Backend).

### 3.1. Arquitectura Frontend (HTML, CSS y JS)
* **Estructura HTML Semántica:** Se han empleado etiquetas semánticas de HTML5 en todas las vistas (`<aside>`, `<nav>`, `<main>`, `<header>`) para garantizar una correcta accesibilidad y estructuración del contenido.
* **CSS Modular y Diseño Adaptativo:** El diseño visual se ha construido utilizando Flexbox, organizando el CSS de forma modular por funcionalidades (ej. `socios.css`). Se emplean clases reutilizables y el sistema está preparado para implementar *media queries* que garanticen un diseño responsivo.
* **JavaScript Asíncrono:** La lógica del lado del cliente implementa un buscador en tiempo real para optimizar el filtrado y utiliza peticiones asíncronas (`fetch`) para consumir la API e intercambiar datos en formato JSON.

### 3.2. Arquitectura Backend (Django)
* **Diseño de Base de Datos:** El sistema se apoya en una base de datos relacional (SQLite) con modelos para `Socio`, `Monitor`, `Tarifa` y `Clase`. El esquema incluye relaciones 1:N (un Socio pertenece a una Tarifa) y relaciones N:M (Clases y Socios asistentes).
* **Fachada REST (Endpoints):** La API de FitGym se comunica exclusivamente mediante JSON e implementa métodos HTTP estándar (GET, POST, PUT, PATCH, DELETE), cubriendo las necesidades completas del CRUD y gestionando de forma segura las políticas CORS.

---

## 4. Requisitos del Sistema (Hardware y Software)

### Requisitos del Servidor (Backend y BBDD)
* **Hardware:** Procesador de doble núcleo (1.5 GHz o superior), mínimo 2 GB de RAM (recomendado 4 GB) y 5 GB de espacio libre en disco.
* **Software:** SO Windows 10/11, macOS o Linux. Python 3.10 o superior instalado globalmente. Framework Django y motor SQLite integrado.

### Requisitos del Cliente (Frontend)
* **Hardware:** Dispositivo estándar (escritorio, tablet o móvil) con mínimo 2 GB de RAM y pantalla con resolución mínima de 360px de ancho.
* **Software:** Navegador web moderno (Chrome, Firefox, Edge, Safari) con **la ejecución de JavaScript habilitada** obligatoriamente.

---

## 5. Estructura del Repositorio

```text
proyecto_intermodular/
├── backend/                 # Arquitectura de la API REST (Python/Django)
│   ├── core/                # Configuración global del proyecto de Django
│   ├── gimnasio/            # Aplicación encargada del negocio del gimnasio
│   │   ├── models.py        # Modelos relacionales de datos
│   │   ├── views.py         # Controladores de la API y endpoints expuestos
│   │   └── urls.py          # Enrutamiento de la fachada REST
│   ├── db.sqlite3           # Archivo de base de datos relacional SQLite
│   └── manage.py            # Utilidad de comandos de gestión de Django
├── frontend/                # Capa de Interfaz de Usuario (UI)
│   ├── html/                # Vistas y modales (index.html, socios.html, etc.)
│   ├── css/                 # Estilos en cascada modulares y reutilizables
│   └── js/                  # Controladores de eventos e integración con API REST
└── venv/                    # Entorno virtual de dependencias (excluido en Git)
