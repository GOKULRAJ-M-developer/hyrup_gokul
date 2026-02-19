# **HYRUP - Student Authentication System Documentation**

## **1. Project Overview**

Your project is a **Student Authentication System** - a backend API that allows students to:
- Register with their credentials
- Login securely
- Access protected routes using JWT tokens
- Maintain sessions with refresh tokens

Think of it like a **campus login system** where students create accounts and then authenticate themselves to access student-only features.

---

## **2. Tech Stack (Technologies Used)**

| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework to create API endpoints |
| **MongoDB** | Database to store student information |
| **Mongoose** | Makes it easier to interact with MongoDB |
| **JWT (JsonWebToken)** | Creates secure tokens for user authentication |
| **bcrypt** | Encrypts passwords so they're not stored in plain text |
| **CORS** | Allows requests from different domains |
| **dotenv** | Manages secret keys safely |
| **nodemon** | Auto-restarts server when code changes (development only) |

---

## **3. Project Structure Explained**

```
hyrup/
├── server.js                    (Main entry point - starts the app)
├── package.json                 (Project dependencies)
├── config/
│   └── db.js                   (Connects to MongoDB)
├── models/
│   └── students.js             (Defines student data structure)
├── controllers/
│   └── authControl.js          (All authentication logic)
├── middleware/
│   └── authmiddleware.js       (Checks if user is logged in)
├── routes/
│   └── authRoutes.js           (API endpoint definitions)
└── utils/
    └── generateTokens.js       (Creates JWT tokens)
```

---

## **4. How Each File Works**

### **📦 package.json**
- Lists all dependencies your project needs
- Defines npm scripts: `npm run dev` (development) and `npm start` (production)
- Uses `"type": "module"` to enable modern JavaScript syntax

### **🚀 server.js** (Main File)
**What it does:**
1. Imports Express and other libraries
2. Connects to MongoDB database
3. Sets up CORS (allows cross-origin requests)
4. Defines API routes:
   - `GET /` → Returns "API is running..."
   - `POST /api/v1/auth/register` → Register new student
   - `POST /api/v1/auth/login` → Login student
   - `GET /api/v1/protected` → Protected route (needs token)
5. Starts the server on port 5000

### **🔌 config/db.js** (Database Connection)
**What it does:**
- Uses Mongoose to connect to MongoDB
- Reads `MONGO_URI` from `.env` file
- Prints connection status to console
- Exits if connection fails

### **👤 models/students.js** (Data Structure)
**Defines what information is stored about each student:**
- `name` - Student's full name
- `email` - Must be unique
- `password` - Encrypted with bcrypt
- `studentId` - Unique ID (like roll number)
- `course` - What course they're enrolled in
- `year` - Year of study (1-5)
- `enrollmentDate` - When they joined
- `gpa` - Grade point average
- `refreshToken` - Stored for session management

### **🔐 controllers/authControl.js** (Business Logic)
**Contains 3 functions:**

#### **registerStudent()**
When a student signs up:
1. Checks if all fields are provided
2. Checks if email/studentId already exists
3. Encrypts password using bcrypt
4. Creates new student in database
5. Generates access token (short-lived) and refresh token (long-lived)
6. Returns tokens to frontend

**Example Flow:**
```
User enters: name, email, password, studentId, course, year
      ↓
Check if email exists? NO → Continue
      ↓
Hash password using bcrypt
      ↓
Save to database
      ↓
Generate JWT tokens
      ↓
Return tokens to user
```

#### **loginStudent()**
When a student logs in:
1. Checks if email and password provided
2. Finds student by email
3. Compares provided password with encrypted password in DB
4. If correct, generates new tokens
5. Returns tokens

**Example Flow:**
```
User enters: email, password
      ↓
Find student with that email
      ↓
Does password match? YES → Continue
      ↓
Generate tokens
      ↓
Return tokens to user
```

#### **refreshAccessToken()**
When access token expires:
1. Takes refresh token from request
2. Verifies it's valid
3. Generates new access token
4. Returns new token

### **🛡️ middleware/authmiddleware.js** (Security Check)
**What it does:**
- Acts like a bouncer at a club
- Checks if request has valid JWT token
- If valid: lets request continue, attaches student data to request
- If invalid: blocks request with 401 error

**Flow:**
```
User sends request with Bearer Token in header
      ↓
Extract token from "Authorization: Bearer <token>"
      ↓
Verify token with JWT_ACCESS_SECRET
      ↓
Token valid? → Get student data, continue
Token invalid? → Return 401 Unauthorized
```

### **🛣️ routes/authRoutes.js** (URL Paths)
Defines which URLs trigger which functions:
- `POST /register` → calls `registerStudent()`
- `POST /login` → calls `loginStudent()`

### **🔑 utils/generateTokens.js** (Token Creation)
Creates two types of tokens:

1. **Access Token** (short-lived, expires based on `JWT_EXPIRE_TIME`)
   - Contains: user ID, email, role
   - Used to access protected routes

2. **Refresh Token** (long-lived, expires in 7 days)
   - Contains: user ID only
   - Used to get new access token when old one expires

---

## **5. Key Concepts Explained**

### **JWT (JSON Web Token)**
```
Structure: header.payload.signature

Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyJ9.kxl8...

- Header: Algorithm type (HS256)
- Payload: User data (id, email, role)
- Signature: Secret to verify token wasn't tampered
```

### **bcrypt**
- One-way encryption for passwords
- You can't decrypt it back (that's the point!)
- `bcrypt.hash()` encrypts password when registering
- `bcrypt.compare()` checks if provided password matches encrypted one

### **Access vs Refresh Token**

| Token | Lifetime | Use |
|-------|----------|-----|
| Access | Short (e.g., 15 min) | Check if user is logged in |
| Refresh | Long (7 days) | Get new access token when expired |

**Why?** Safety - if access token leaks, it's only valid for a short time.

---

## **6. How Authentication Works (Step-by-Step)**

### **Registration Flow:**
```
1. Student fills form: name, email, password, studentId, course, year
                          ↓
2. POST /api/v1/auth/register
                          ↓
3. Server validates all fields provided
                          ↓
4. Server checks if email/studentId already exists
                          ↓
5. Server encrypts password (bcrypt.hash)
                          ↓
6. Server saves to MongoDB
                          ↓
7. Server creates Access Token + Refresh Token
                          ↓
8. Server sends tokens back to student
                          ↓
9. Student saves tokens in browser storage
```

### **Login Flow:**
```
1. Student enters: email, password
                          ↓
2. POST /api/v1/auth/login
                          ↓
3. Server finds student by email
                          ↓
4. Server compares password (bcrypt.compare)
                          ↓
5. If match → Create new tokens
                          ↓
6. Send tokens back
                          ↓
7. Student uses tokens for future requests
```

### **Accessing Protected Routes:**
```
1. Student wants to access /api/v1/protected
                          ↓
2. Sends request with: Authorization: Bearer <access_token>
                          ↓
3. Middleware checks token validity
                          ↓
4. Token valid? → Let request through
                          ↓
5. Return: { message: "...", student: {...} }
```

---

## **7. API Endpoints**

### **1. Register**
```
POST /api/v1/auth/register

Request Body:
{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "secure123",
  "studentId": "CS2024001",
  "course": "Computer Science",
  "year": 2
}

Response:
{
  "message": "Student registered successfully",
  "accesstoken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### **2. Login**
```
POST /api/v1/auth/login

Request Body:
{
  "email": "john@college.edu",
  "password": "secure123"
}

Response:
{
  "message": "Login successful",
  "accesstoken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### **3. Protected Route**
```
GET /api/v1/protected

Header:
Authorization: Bearer <access_token>

Response:
{
  "message": "This is a protected route",
  "student": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@college.edu",
    ...
  }
}
```

---

## **8. Required Environment Variables (.env file)**

Create a `.env` file in your root directory:

```env
MONGO_URI=mongodb://localhost:27017/hyrup
PORT=5000
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE_TIME=15m
```

---

## **9. Common Questions**

**Q: Why encrypt passwords?**
A: So if hackers get database, they can't read actual passwords.

**Q: Why two tokens (access + refresh)?**
A: If access token is stolen, it expires quickly. Attacker can't use it long.

**Q: What is middleware?**
A: Code that runs between receiving request and sending response. Like a security checkpoint.

**Q: What's CORS?**
A: Allows your frontend (different domain) to talk to your backend.

**Q: Why use JWT instead of storing sessions?**
A: JWT is stateless - server doesn't need to store anything, more scalable.

---

## **10. How to Run**

```bash
# Install dependencies
npm install

# Development (auto-restart on code change)
npm run dev

# Production
npm start
```

Server will run on http://localhost:5000

---

This is your complete student authentication system! It's a secure way to let students register, login, and access protected resources. 🎓
