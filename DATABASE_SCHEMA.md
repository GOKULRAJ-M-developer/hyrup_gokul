# Database Schema Documentation

## Overview
HYRUP uses MongoDB with Mongoose for data persistence. This document describes the complete database schema.

---

## Student Collection Schema

### Collection Name: `students`

The Student schema stores all information about registered students in the system.

### Field Definitions

| Field | Type | Required | Unique | Default | Description |
|-------|------|----------|--------|---------|-------------|
| `_id` | ObjectId | ✅ | ✅ | Auto-generated | MongoDB unique identifier |
| `name` | String | ✅ | ❌ | N/A | Student's full name (trimmed) |
| `email` | String | ✅ | ✅ | N/A | Student's email (unique, lowercase) |
| `password` | String | ✅ | ❌ | N/A | Bcrypt hashed password |
| `studentId` | String | ✅ | ✅ | N/A | Unique student ID (e.g., CS2024001) |
| `course` | String | ✅ | ❌ | N/A | Course name (e.g., Computer Science) |
| `year` | Number | ✅ | ❌ | N/A | Year of study (1-5) |
| `enrollmentDate` | Date | ❌ | ❌ | `Date.now` | Date student enrolled |
| `gpa` | Number | ❌ | ❌ | N/A | Grade Point Average (0-10 range) |
| `phone` | String | ❌ | ❌ | N/A | Student's phone number |
| `address` | Object | ❌ | ❌ | N/A | Student's residential address |
| `address.door_no` | String | ❌ | ❌ | N/A | Door/House number |
| `address.street` | String | ❌ | ❌ | N/A | Street name |
| `address.city` | String | ❌ | ❌ | N/A | City |
| `address.state` | String | ❌ | ❌ | N/A | State/Province |
| `address.zip` | String | ❌ | ❌ | N/A | Postal/Zip code |
| `emergencyContact` | Object | ❌ | ❌ | N/A | Emergency contact details |
| `emergencyContact.name` | String | ❌ | ❌ | N/A | Emergency contact person's name |
| `emergencyContact.phone` | String | ❌ | ❌ | N/A | Emergency contact person's phone |
| `emergencyContact.relation` | String | ❌ | ❌ | N/A | Relation to student (e.g., Parent) |
| `role` | String | ❌ | ❌ | `"student"` | User role (Enum: "student", "admin") |
| `isActive` | Boolean | ❌ | ❌ | `true` | Account active status |
| `refreshToken` | String | ❌ | ❌ | N/A | Current refresh token for authentication |
| `createdAt` | Date | ✅ | ❌ | Auto | Timestamp when record created |
| `updatedAt` | Date | ✅ | ❌ | Auto | Timestamp when record last updated |

### Field Constraints

#### name
- **Type:** String
- **Required:** Yes
- **Trim:** Yes (removes leading/trailing whitespace)
- **Example:** "John Doe"

#### email
- **Type:** String
- **Required:** Yes
- **Unique:** Yes
- **Lowercase:** Yes (converts to lowercase automatically)
- **Example:** "john@college.edu"

#### password
- **Type:** String
- **Required:** Yes
- **Note:** Always hashed using bcrypt (salt rounds: 10)
- **Example:** `$2b$10$...` (hashed value)

#### studentId
- **Type:** String
- **Required:** Yes
- **Unique:** Yes
- **Example:** "CS2024001", "ME2023045"

#### course
- **Type:** String
- **Required:** Yes
- **Example:** "Computer Science", "Mechanical Engineering"

#### year
- **Type:** Number
- **Required:** Yes
- **Range:** 1-5
- **Min:** 1
- **Max:** 5
- **Example:** 2

#### enrollmentDate
- **Type:** Date
- **Required:** No
- **Default:** `Date.now` (current date)
- **Example:** "2024-01-15T10:30:00.000Z"

#### gpa
- **Type:** Number
- **Required:** No
- **Range:** 0-10
- **Min:** 0
- **Max:** 10
- **Example:** 8.5

#### phone
- **Type:** String
- **Required:** No
- **Example:** "+91-9876543210"

#### address (Nested Object)
- **Type:** Object
- **Required:** No
- **Nested Fields:**
  - `door_no`: String (House/Door number)
  - `street`: String (Street name)
  - `city`: String (City name)
  - `state`: String (State/Province)
  - `zip`: String (Postal code)

#### emergencyContact (Nested Object)
- **Type:** Object
- **Required:** No
- **Nested Fields:**
  - `name`: String (Contact person's name)
  - `phone`: String (Contact person's phone)
  - `relation`: String (Relation - e.g., "Mother", "Father")

#### role
- **Type:** String
- **Enum:** ["student", "admin"]
- **Default:** "student"
- **Example:** "student"

#### isActive
- **Type:** Boolean
- **Default:** true
- **Example:** true

#### refreshToken
- **Type:** String
- **Required:** No
- **Note:** Stored for session management, invalidated on logout
- **Example:** `eyJhbGc...` (JWT token)

#### createdAt & updatedAt
- **Type:** Date
- **Auto-generated:** Yes
- **Note:** Automatically added by Mongoose timestamps option

---

## Database Relationships

```
┌─────────────────┐
│    Students     │
├─────────────────┤
│ _id (PK)        │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ studentId (UNIQUE)
│ course          │
│ year            │
│ enrollmentDate  │
│ gpa             │
│ phone           │
│ address { }     │
│ emergencyContact{ }
│ role            │
│ isActive        │
│ refreshToken    │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

---

## Indexes

### Automatic Indexes
- `_id` - Primary key (auto-indexed)
- `email` - Unique index
- `studentId` - Unique index

### Creation Time Index
- `createdAt` - Useful for sorting and filtering

### Recommended Additional Indexes
```javascript
// For better query performance
db.students.createIndex({ email: 1 })
db.students.createIndex({ studentId: 1 })
db.students.createIndex({ course: 1 })
db.students.createIndex({ year: 1 })
db.students.createIndex({ createdAt: -1 })
```

---

## Data Validation Rules

### Registration Fields (Required)
```javascript
{
  name: String (not empty),
  email: String (valid email, unique),
  password: String (not empty),
  studentId: String (unique),
  course: String (not empty),
  year: Number (1-5)
}
```

### Password Requirements
- Minimum length: No specific requirement (should be enforced frontend)
- Hashing: bcrypt with 10 salt rounds
- Storage: Never plain text

### Year Validation
- Minimum: 1
- Maximum: 5
- Type: Number (not string)

### GPA Validation
- Minimum: 0
- Maximum: 10
- Decimal values allowed

---

## Example Documents

### Complete Student Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86sLZLtI2Pe",
  "studentId": "CS2024001",
  "course": "Computer Science",
  "year": 2,
  "enrollmentDate": "2024-01-15T10:30:00.000Z",
  "gpa": 8.5,
  "phone": "+91-9876543210",
  "address": {
    "door_no": "42",
    "street": "Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "zip": "560001"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+91-9876543200",
    "relation": "Mother"
  },
  "role": "student",
  "isActive": true,
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-02-19T15:45:30.000Z"
}
```

### Minimal Student Document
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Jane Smith",
  "email": "jane@college.edu",
  "password": "$2b$10$...",
  "studentId": "CS2024002",
  "course": "Computer Science",
  "year": 1,
  "enrollmentDate": "2024-02-01T00:00:00.000Z",
  "role": "student",
  "isActive": true,
  "createdAt": "2024-02-01T14:20:00.000Z",
  "updatedAt": "2024-02-01T14:20:00.000Z"
}
```

---

## Query Examples

### Find student by email
```javascript
db.students.findOne({ email: "john@college.edu" })
```

### Find all active students in a course
```javascript
db.students.find({ 
  course: "Computer Science", 
  isActive: true 
})
```

### Find students in specific year
```javascript
db.students.find({ year: 2 })
```

### Update GPA
```javascript
db.students.updateOne(
  { studentId: "CS2024001" },
  { $set: { gpa: 9.0 } }
)
```

### Count students per course
```javascript
db.students.aggregate([
  { $group: { _id: "$course", count: { $sum: 1 } } }
])
```

---

## Database Connection String

### Local MongoDB
```
mongodb://localhost:27017/hyrup
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/hyrup?retryWrites=true&w=majority
```

---

## Backup & Restore

### Backup
```bash
mongodump --uri="mongodb://localhost:27017/hyrup" --out=./backups
```

### Restore
```bash
mongorestore --uri="mongodb://localhost:27017/hyrup" ./backups/hyrup
```

---

## Design Decisions

1. **Timestamps:** Using Mongoose `timestamps: true` option for automatic `createdAt` and `updatedAt` fields for audit trails.

2. **Password Hashing:** Bcrypt with 10 salt rounds provides strong security against brute-force attacks.

3. **Unique Fields:** Email and studentId are unique to prevent duplicates and ensure data integrity.

4. **Role-Based Access:** Role field enables future implementation of role-based access control (RBAC).

5. **RefreshToken Storage:** Storing refresh token allows server-side token invalidation on logout.

6. **Nested Objects:** Address and Emergency Contact stored as nested objects for better data relationships.

7. **Soft Delete Ready:** `isActive` field allows implementing soft deletes without data loss.

8. **Flexible Address:** Address stored as object allows international address formats.

---

## Future Enhancements

- Add TTL index on refreshToken for automatic expiration
- Implement change streams for real-time updates
- Add full-text search on student names and courses
- Implement document versioning for audit logs
- Add geospatial indexing for location-based queries
