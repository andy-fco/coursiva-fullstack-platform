# Coursiva – Plataforma de Cursos Full-Stack

Coursiva es una plataforma de cursos online full-stack desarrollada con **Next.js** y **Node.js**, diseñada para permitir que los estudiantes exploren, se inscriban y completen cursos, mientras que los administradores pueden gestionar cursos y categorías.

Este proyecto fue desarrollado como un **proyecto académico individual**, pero fue diseñado e implementado siguiendo buenas prácticas de aplicaciones full-stack del mundo real.

---

## Tipo de Aplicación

- Aplicación web full-stack
- Frontend construido con Next.js y TypeScript
- Backend construido con Node.js y Express
- Arquitectura API RESTful
- Interfaz responsiva estilizada con Tailwind CSS

---

## Arquitectura y Estructura

El proyecto sigue una estructura monorepo con una clara separación de responsabilidades:

- **Cliente**: aplicación frontend con Next.js
- **Servidor**: API backend con Node.js + Express
- **Autenticación**: autenticación basada en JWT
- **Gestión de Estado**: React Context API
- **Acceso a Base de Datos**: Prisma ORM

---

## Autenticación y Autorización

- Registro y login de usuarios
- Autenticación basada en JWT
- Control de acceso basado en roles
- Dos roles soportados:
  - `student` (estudiante)
  - `admin` (administrador)

---

## Base de Datos

- Base de datos SQLite
- Gestionada usando Prisma ORM
- Esquema relacional con datos persistidos
- Base de datos incluida para desarrollo y demostración

---

## Funcionalidades Principales

### Funcionalidades para Estudiantes

- Registro y login de usuarios
- Explorar y buscar cursos disponibles
- Ver detalles de los cursos
- Inscribirse en cursos
- Marcar cursos como completados

### Funcionalidades para Administradores

- Crear y gestionar cursos
- Crear y gestionar categorías de cursos
- Control administrativo de acceso

---

## Tecnologías Utilizadas

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- React Context API

### Backend

- Node.js
- Express
- Prisma ORM
- Autenticación JWT

### Base de Datos

- SQLite

---

## Contexto y Estado del Proyecto

- Proyecto académico individual
- Proyecto final del curso _Plataformas de Desarrollo_
- Sistema principal completamente funcional
- Diseñado pensando en escalabilidad y mantenibilidad

---

## Idioma

- Versión en español (este archivo)
- Versión en inglés disponible en [README.md](README.md)
