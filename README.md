# 🔐 Authentication Backend

A RESTful authentication API built with **Node.js**, **Express**, and **MongoDB**. Supports user registration, login, JWT-based authorization, and password reset.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Email:** Nodemailer (ready for integration)

## API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login & get JWT token |
| `GET` | `/api/auth/me` | Protected | Get logged-in user profile |
| `POST` | `/api/auth/forgot-password` | Public | Generate password reset token |
| `PUT` | `/api/auth/reset-password/:token` | Public | Reset password with token |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/authentication-backend.git
cd authentication-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

> 💡 Generate a strong JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Run the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:5000`.

## Usage Examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "username": "john@example.com", "password": "secret123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john@example.com", "password": "secret123"}'
```

### Access Protected Route

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
backend/
├── app.js                  # Entry point — Express app & DB connection
├── controllers/
│   └── authController.js   # Route handlers (register, login, reset)
├── middleware/
│   └── authmiddleware.js   # JWT verification middleware
├── models/
│   └── User.js             # Mongoose User schema with password hashing
├── routes/
│   └── authRoutes.js       # API route definitions
├── .env                    # Environment variables (not committed)
├── .gitignore
└── package.json
```

