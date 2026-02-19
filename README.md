# HYRUP - Student Authentication System

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.1-green)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.2-blue)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue)](LICENSE)

A secure backend API for student registration, login, and session management using JWT authentication. Built with Express.js, MongoDB, and modern Node.js practices.

## 🎯 Features

- ✅ Student Registration with comprehensive validation
- ✅ Secure Login with bcrypt password encryption
- ✅ JWT-based Authentication (Access & Refresh tokens)
- ✅ Token Refresh mechanism for extended sessions
- ✅ Logout functionality with token invalidation
- ✅ Protected Routes with middleware verification
- ✅ MongoDB database with Mongoose ODM
- ✅ CORS enabled for cross-origin requests
- ✅ Comprehensive error handling and validation
- ✅ Environment variable configuration
- ✅ Full API documentation

---

## 📋 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 14+ | JavaScript runtime |
| **Express.js** | 5.2.1 | Web framework |
| **MongoDB** | 7.1 | NoSQL database |
| **Mongoose** | 9.2.1 | MongoDB ODM |
| **JWT** | n/a | Authentication tokens |
| **bcrypt** | n/a | Password hashing |
| **CORS** | 2.8.6 | Cross-origin requests |
| **dotenv** | 17.3.1 | Environment variables |
| **nodemon** | 3.1.11 | Dev auto-restart |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** v7.0 or higher:
  - **Option 1:** [Local MongoDB](https://www.mongodb.com/try/download/community)
  - **Option 2:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud - Recommended)

**Verify installation:**
```bash
node --version    # Should be v14+
npm --version     # Should be v6+
mongod --version  # Should be v7+
```

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/hyrup.git
cd hyrup

# Install all dependencies
npm install
```

### 2. Database Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service (Windows)
mongod

# Or on macOS/Linux
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/hyrup?retryWrites=true&w=majority`

### 3. Setup Environment Variables

Create a `.env` file in the root directory with these variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/hyrup
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/hyrup?retryWrites=true&w=majority

# Server Configuration
PORT=5000

# JWT Secrets (Use strong, random strings)
JWT_ACCESS_SECRET=your_super_secret_access_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production

# Token Expiration
JWT_EXPIRE_TIME=15m
```

**⚠️ IMPORTANT:** 
- Never commit `.env` to version control
- Use strong, unique secrets in production
- The `.gitignore` file already excludes `.env`

### 4. Run the Server

```bash
# Development mode (with auto-restart on file changes)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
MongoDB Connected: localhost
Server running on port 5000
API is running...
```

Visit `http://localhost:5000` to verify the API is running.

---

## 📚 Student Model Field Explanations

The Student schema stores the following information:

### Required Fields (Must be provided during registration)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | String | Student's full name | "John Doe" |
| `email` | String | Unique email address (case-insensitive) | "john@college.edu" |
| `password` | String | User password (hashed with bcrypt) | Input: "SecurePass123" |
| `studentId` | String | Unique student ID | "CS2024001" |
| `course` | String | Course/Major name | "Computer Science" |
| `year` | Number | Year of study (1-5) | 2 |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `phone` | String | Student's phone number | "+91-9876543210" |
| `gpa` | Number | Grade Point Average (0-10) | 8.5 |
| `enrollmentDate` | Date | Date of enrollment (auto-set) | "2024-01-15" |
| `address` | Object | Residential address details | { city: "Bangalore", state: "Karnataka" } |
| `emergencyContact` | Object | Emergency contact information | { name: "Jane Doe", relation: "Mother" } |

### System Fields (Auto-managed)

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | MongoDB unique identifier |
| `role` | String | User role (default: "student") |
| `isActive` | Boolean | Account status (default: true) |
| `refreshToken` | String | Current refresh token |
| `createdAt` | Date | Account creation timestamp |
| `updatedAt` | Date | Last update timestamp |

For complete database schema details, see [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

---

## 🔐 API & Authentication Endpoints

### 1. Register Student
Create a new student account

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "SecurePass123",
  "studentId": "CS2024001",
  "course": "Computer Science",
  "year": 2
}
```

**Response (201 - Created):**
```json
{
  "message": "Student registered successfully",
  "accesstoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - All fields are required
- `400` - Email already in use
- `400` - Student ID already exists
- `500` - Server error

---

### 2. Login Student
Authenticate with email and password

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@college.edu",
  "password": "SecurePass123"
}
```

**Response (200 - OK):**
```json
{
  "message": "Login successful",
  "accesstoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Email and password are required
- `401` - invalid credentials (wrong email or password)
- `500` - Server error

---

### 3. Refresh Access Token
Get a new access token when the current one expires

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 - OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 4. Logout Student
Invalidate refresh token and logout

```http
POST /api/v1/auth/logout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 - OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Access Protected Route
Get student data from a protected endpoint

```http
GET /api/v1/protected
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 - OK):**
```json
{
  "message": "This is a protected route",
  "student": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@college.edu",
    "studentId": "CS2024001",
    "course": "Computer Science",
    "year": 2,
    "role": "student",
    "gpa": 8.5,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 6. Health Check
Verify API is running

```http
GET /
```

**Response (200 - OK):**
```
"API is running..."
```

---

## 🧪 Testing with Postman

### Import Postman Collection

1. Open [Postman](https://www.postman.com/downloads/)
2. Click **Import** (top left)
3. Select [POSTMAN_COLLECTION.json](POSTMAN_COLLECTION.json)
4. Set environment variables in Postman:
   - `base_url` = `http://localhost:5000`
   - `access_token` = (obtained from login)
   - `refresh_token` = (obtained from login)

### Using curl

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@college.edu",
    "password": "pass123",
    "studentId": "CS2024002",
    "course": "Computer Science",
    "year": 1
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@college.edu",
    "password": "pass123"
  }'
```

**Protected Route:**
```bash
curl -X GET http://localhost:5000/api/v1/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Refresh Token:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

---

## 📁 Enhanced Project Structure

```
hyrup/
├── .github/                  (GitHub configuration)
│   └── workflows/           (CI/CD pipelines - optional)
├── config/
│   └── db.js                (MongoDB connection setup)
├── controllers/
│   └── authControl.js       (Authentication logic)
├── middleware/
│   └── authmiddleware.js    (JWT verification middleware)
├── models/
│   └── students.js          (Student schema definition)
├── routes/
│   └── authRoutes.js        (API route definitions)
├── utils/
│   └── generateTokens.js    (JWT token generation)
├── server.js                (Main entry point)
├── package.json             (Dependencies & scripts)
├── package-lock.json        (Locked versions)
├── .env                     (Environment variables - DO NOT COMMIT)
├── .gitignore               (Git exclusion rules)
├── README.md                (This file)
├── DOCUMENTATION.md         (Detailed technical documentation)
├── DATABASE_SCHEMA.md       (Database schema & ER diagram)
├── POSTMAN_COLLECTION.json  (Postman API collection)
└── GITHUB_SETUP.md          (GitHub repository instructions)
```

---

## 🔑 Token Management

### JWT Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjEyMyIsImVtYWlsIjoiam9obkBjb2xsZWdlLmVkdSIsInJvbGUiOiJzdHVkZW50In0.
kxl8qB7v3...

[Header].[Payload].[Signature]
```

### Token Lifecycle

| Token | Lifetime | Content | Use Case |
|-------|----------|---------|----------|
| **Access Token** | 15 minutes | id, email, role | API authentication |
| **Refresh Token** | 7 days | id only | Get new access token |

### Token Flow Diagram

```
┌─────────────┐
│ User Login  │
└──────┬──────┘
       │
       ├─► Check credentials
       │
       ├─► Valid ✓
       │
       ├─► Generate Access Token (15 min)
       ├─► Generate Refresh Token (7 days)
       │
       └─► Return both tokens
           │
           ├─► Client stores tokens
           │
           ├─► API requests use Access Token
           │
           └─► When Access Token expires:
               └─► Use Refresh Token → Get new Access Token
```

---

## 🛡️ Security Architecture

### Password Security
- ✅ **Hashing:** bcrypt with 10 salt rounds
- ✅ **Storage:** Never plain text
- ✅ **Comparison:** Constant-time comparison
- ✅ **Response:** Never returned in API responses

### Token Security
- ✅ **Signature:** HMAC SHA-256
- ✅ **Expiration:** Time-based expiration
- ✅ **Validation:** Server-side verification
- ✅ **Invalidation:** Logout clears refresh token

### Data Validation
- ✅ **Required Fields:** All validated
- ✅ **Email Validation:** Unique constraint
- ✅ **StudentId Validation:** Unique constraint
- ✅ **Year Range:** 1-5 validation
- ✅ **GPA Range:** 0-10 validation

### API Security
- ✅ **CORS:** Configured for allowed origins
- ✅ **Error Messages:** Don't leak sensitive info
- ✅ **Input Sanitization:** Trim and validate
- ✅ **Middleware:** Request validation layer

---

## 📊 Database Schema Summary

### Student Collection Structure

```javascript
{
  _id: ObjectId,                    // MongoDB ID
  name: String,                     // Required
  email: String,                    // Required, Unique
  password: String (hashed),        // Required
  studentId: String,                // Required, Unique
  course: String,                   // Required
  year: Number,                     // Required (1-5)
  phone: String,                    // Optional
  gpa: Number,                      // Optional (0-10)
  enrollmentDate: Date,             // Default: now
  address: {                        // Optional
    door_no: String,
    street: String,
    city: String,
    state: String,
    zip: String
  },
  emergencyContact: {               // Optional
    name: String,
    phone: String,
    relation: String
  },
  role: String,                     // Default: "student"
  isActive: Boolean,                // Default: true
  refreshToken: String,             // For logout
  timestamps: {                     // Auto-managed
    createdAt: Date,
    updatedAt: Date
  }
}
```

For complete schema documentation, see [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)

---

## ⚠️ Error Handling & Status Codes

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input/missing fields |
| 401 | Unauthorized | Auth failed/invalid token |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

### Error Response Format
```json
{
  "message": "User-friendly error message",
  "error": "Detailed technical error (development only)"
}
```

### Common Errors & Solutions

| Error Message | Root Cause | Solution |
|---------------|-----------|----------|
| "All fields are required" | Missing registration fields | Provide: name, email, password, studentId, course, year |
| "Email already in use" | Email exists in DB | Use different email or login |
| "Student ID already exists" | StudentId is duplicate | Use unique studentId |
| "invalid credentials" | Wrong email/password | Verify email and password |
| "Unauthorized, no token provided" | Missing Auth header | Add `Authorization: Bearer <token>` |
| "Unauthorized" | Invalid/expired token | Login again or refresh token |
| "MongoDB Connected failed" | DB not running | Start MongoDB service |

---

## 🚀 Deployment Options

### Local Development
```bash
npm run dev
```

### Production Server
```bash
npm start
```

### Environment Setup for Production
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/hyrup
PORT=8000
JWT_ACCESS_SECRET=<generate-secure-key>
JWT_REFRESH_SECRET=<generate-secure-key>
JWT_EXPIRE_TIME=15m
NODE_ENV=production
```

### Deployment Platforms
- **Heroku:** Supports Node.js, easy MongoDB Atlas integration
- **Railway:** Modern alternative with free tier
- **Render:** Simple deployment from GitHub
- **AWS EC2:** Full server control
- **DigitalOcean:** Affordable VPS option

---

## 🔄 GitHub Repository Setup

To host this project on GitHub:

1. **Initialize Git** (if not done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Student authentication system"
   ```

2. **Create Repository on GitHub**:
   - Go to https://github.com/new
   - Name: `hyrup`
   - Visibility: Public (portfolio) or Private (confidential)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hyrup.git
   git branch -M main
   git push -u origin main
   ```

For detailed GitHub setup, see [GITHUB_SETUP.md](GITHUB_SETUP.md)

---

## 🐛 Troubleshooting

### Server Issues
| Problem | Solutions |
|---------|-----------|
| Port already in use | Change PORT in .env or kill process using port |
| Cannot find module | Run `npm install` or delete node_modules and reinstall |
| Server won't connect | Check if port is open, firewall settings |

### Database Issues
| Problem | Solutions |
|---------|-----------|
| MongoDB connection failed | Start mongod service, check MONGO_URI |
| Collection not found | Connect string is correct but DB not accessing |
| Authentication failed | Check MongoDB username/password for Atlas |

### Authentication Issues
| Problem | Solutions |
|---------|-----------|
| "Unauthorized" on protected route | Token missing/invalid, refresh token |
| "invalid credentials" on login | Check email/password spelling |
| Token not in response | Ensure registration/login completed successfully |

---

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](README.md) | Quick start & overview |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Technical deep dive |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Database structure & queries |
| [POSTMAN_COLLECTION.json](POSTMAN_COLLECTION.json) | API testing collection |
| [GITHUB_SETUP.md](GITHUB_SETUP.md) | GitHub repository guide |

---

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [JWT Introduction](https://jwt.io/introduction)
- [Mongoose ODM](https://mongoosejs.com/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🎯 Design Decisions

1. **JWT Tokens:** Stateless authentication, scalable across multiple servers
2. **Separate Access/Refresh Tokens:** Enhanced security, automatic token rotation
3. **bcrypt Hashing:** Industry standard, resistant to brute-force attacks
4. **Mongoose ODM:** Type safety, validation, better query syntax
5. **Middleware Pattern:** Separation of concerns, reusable security logic
6. **Nested Objects:** Flexible schema for address and emergency contacts
7. **Timestamps:** Built-in audit trail for record creation/updates

---

## 📄 License

ISC License - See `LICENSE` file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details (create if needed)

---

## 📞 Support & Contact

- **Issues:** [Report on GitHub](https://github.com/GOKULRAJ-M-developer/hyrup/issues)
- **Email:** kannagokul827@gmail.com
- **Documentation:** See [DOCUMENTATION.md](DOCUMENTATION.md)

---

**Made with ❤️ for student management. Happy coding! 🚀**
#   h y r u p _ g o k u l 
 
 