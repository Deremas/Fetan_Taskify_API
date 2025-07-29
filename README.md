# 📝 Fetan Systems Taskify API

A simple Task Manager RESTful API built with **Node.js**, **Express.js**, **Prisma ORM**, and **MySQL**. It supports user authentication, task management, and profile access.

---

## 📁 Project Structure
<pre> 📁 controllers/ │ ├── authController.js │ ├── taskController.js │ └── profileController.js 📁 routes/ │ ├── auth.js │ ├── tasks.js │ └── profile.js 📁 middlewares/ │ ├── authMiddleware.js │ ├── signUpMiddleware.js │ └── loginMiddleware.js 📁 prisma/ │ └── schema.prisma 📄 .env 📄 .env.sample 📄 app.js 📄 README.md </pre>


---

## 🚀 Features

- User Registration and Login (with password hashing)
- JWT-based Authentication
- Task Creation, Retrieval, Update, Deletion
- Task Filtering by Status (pending/completed)
- User Profile Access
- Input Validation with `express-validator`
- Pagination Support for Tasks
- Prisma ORM + MySQL for database management

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- Prisma ORM
- MySQL (or SQLite for development)
- JWT (JSON Web Tokens)
- Bcrypt
- dotenv
- express-validator
- etc...
---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash

git clone https://github.com/yourusername/Fetan_Taskify_API
cd Fetan_Taskify_API

### 2. Install Dependencies
npm install

### 3. Configure Environment Variables
Create a .env file at the root and copy Environmetal Variables from .env.sample and edit with your correct variables.

### 4. Setup the Database
npx prisma migrate dev --name init
npx prisma generate

### 5. Start the Server
npm run dev


📬 API Endpoints
Auth
--> POST /auth/signup – Register new user
--> POST /auth/login – Login and receive JWT

Tasks
--> GET /tasks – Get user tasks (with pagination)
--> POST /tasks – Create a task
--> PATCH /tasks/:id – Update a task
--> DELETE /tasks/:id – Delete a task

Profile
GET /profile – Get current user's profile

✅ Validation
--> Validation handled by express-validator in middlewares:
--> signUpMiddleware.js – Validates name, email, password
--> loginMiddleware.js – Validates email, password format

🔐 Authentication
All task and profile routes are protected by JWT authentication middleware (authMiddleware.js).

🧪 Testing
--> You can use Postman, Thunder Client, or cURL to test the API.

🧑‍💻 Author
Dereje Masresha – [GitHub](https://github.com/Deremas)




