# Ethara – Team Task Manager

Ethara is a full-stack SaaS-based Team Task Management application designed to streamline project execution, enforce role-based access control, and provide real-time insights into team performance.

---

## 📌 Overview

Ethara acts as a centralized platform where teams can:

* Create and manage projects
* Assign structured roles (Manager, Team Lead, Developers)
* Track tasks with real-time updates
* Monitor project progress through dynamic dashboards

---

## 🎯 Key Features

### 🔐 Authentication

* Secure Signup/Login system
* Password hashing using bcrypt
* JWT-based authentication
* Protected routes

---

### 👥 Project & Team Management

* Create projects using dynamic workflow
* Assign team members with roles:

  * Manager (1 per project)
  * Team Lead (1 per project)
  * Developers (Frontend, Backend, R&D)
* Role-based constraints enforced

---

### ✅ Task Management

* Create, assign, update, and delete tasks
* Task fields:

  * Title
  * Assigned user
  * Status (Todo / In Progress / Done)
  * Due date
* Real-time task updates

---

### 📊 Dashboard & Analytics

* Real-time metrics:

  * Total Tasks
  * Completed Tasks
  * Active Tasks
  * Overdue Tasks
* Dynamic progress tracking
* Data-driven UI (no static values)

---

### 📈 Smart Progress System

* Project progress calculated dynamically:
  Progress = (Completed Tasks / Total Tasks) × 100
* No stored progress → always accurate
* Auto-updates on task changes

---

### 🔒 Role-Based Access Control (RBAC)

* Admin / Manager / Team Lead / Member roles
* Backend + frontend enforced permissions
* Restricted access based on role

---

### ⚡ Resilient Backend (Advanced Feature)

* Detects MongoDB connection failure
* Switches to in-memory fallback mode
* Ensures uninterrupted demo and usage

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* Framer Motion

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## 📁 Project Structure

```bash
/server
 ├── models/
 ├── routes/
 ├── middleware/
 └── server.js

/client
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── services/
 │   ├── App.jsx
 │   └── main.jsx
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Deployment

This project is fully deployable on Railway.

### Deployment Requirements:

* Use environment variables
* Avoid hardcoded localhost URLs
* Ensure backend uses dynamic PORT

---

## 🧪 API Overview

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| POST   | /api/auth/signup | Register user    |
| POST   | /api/auth/login  | Login user       |
| GET    | /api/projects    | Get all projects |
| POST   | /api/projects    | Create project   |
| GET    | /api/tasks       | Get all tasks    |
| POST   | /api/tasks       | Create task      |
| PUT    | /api/tasks/:id   | Update task      |

---

## 🔥 Engineering Highlights

* Derived state (Single Source of Truth for progress)
* Role-based access control (RBAC)
* Dynamic schema flexibility for teams
* Fault-tolerant backend design
* Clean REST API architecture

---

## 🎥 Demo

👉 Add your demo video link here

---

## 🔗 Live Application

👉 Add your deployed app link here

---

## 👨‍💻 Author

Developed as part of a job assessment project to demonstrate:

* Full-stack development
* System design thinking
* Clean UI/UX
* Production-level architecture

---

## 📌 Final Note

Ethara is not just a task manager—it is a structured execution system that aligns team roles, project goals, and real-time task tracking into a cohesive SaaS platform.
