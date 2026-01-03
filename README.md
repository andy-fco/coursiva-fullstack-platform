# Coursiva – Full-Stack Course Platform

Coursiva is a full-stack online course platform developed with **Next.js** and **Node.js**, designed to allow students to browse, enroll in, and complete courses, while administrators can manage courses and categories.

This project was developed as an **individual academic project**, but it was designed and implemented following real-world full-stack application practices.

---

## Application Type

- Full-stack web application
- Frontend built with Next.js and TypeScript
- Backend built with Node.js and Express
- RESTful API architecture
- Responsive UI styled with Tailwind CSS

---

## Architecture and Structure

The project follows a monorepo structure with a clear separation of concerns:

- **Client**: Next.js frontend application
- **Server**: Node.js + Express backend API
- **Authentication**: JWT-based authentication
- **State Management**: React Context API
- **Database Access**: Prisma ORM

---

## Authentication and Authorization

- User registration and login
- JWT-based authentication
- Role-based access control
- Two roles supported:
  - `student`
  - `admin`

---

## Database

- SQLite database
- Managed using Prisma ORM
- Relational schema with persisted data
- Database included for development and demo purposes

---

## Main Features

### Student Features

- User registration and login
- Browse and search available courses
- View course details
- Enroll in courses
- Mark courses as completed

### Admin Features

- Create and manage courses
- Create and manage course categories
- Administrative access control

---

## Technologies Used

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- React Context API

### Backend

- Node.js
- Express
- Prisma ORM
- JWT Authentication

### Database

- SQLite

---

## Project Context and Status

- Individual academic project
- Final project for the course _Plataformas de Desarrollo_
- Core system fully functional
- Designed with scalability and maintainability in mind

---

## Language

- English version (this file)
- Spanish version available in [README.es.md](README.es.md)
