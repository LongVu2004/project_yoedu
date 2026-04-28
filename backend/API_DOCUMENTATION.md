# YOEDU Backend API Documentation

## Overview
YOEDU Backend là REST API được xây dựng với Express.js và Sequelize ORM cho hệ thống quản lý giáo dục.

## Tech Stack
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **Sequelize** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## Project Structure
```
backend/
├── src/
│   ├── app.js                    # Main application file
│   ├── config/
│   │   └── database.js          # Database configuration
│   └── controllers/              # Business logic
│       ├── AuthController.js
│       ├── UserController.js
│       ├── CourseController.js
│       ├── ClassroomController.js
│       ├── EnrollmentController.js
│       ├── AttendanceController.js
│       ├── GradeController.js
│       ├── InvoiceController.js
│       └── NotificationController.js
├── models/                       # Sequelize models
│   ├── Role.js
│   ├── User.js
│   ├── UserProfile.js
│   ├── ParentStudent.js
│   ├── Course.js
│   ├── ScheduleTemplate.js
│   ├── Classroom.js
│   ├── Enrollment.js
│   ├── Attendance.js
│   ├── Grade.js
│   ├── Invoice.js
│   ├── Notification.js
│   ├── UserNotification.js
│   └── index.js                 # Model associations
├── routes/                       # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── courseRoutes.js
│   ├── classroomRoutes.js
│   ├── enrollmentRoutes.js
│   ├── attendanceRoutes.js
│   ├── gradeRoutes.js
│   ├── invoiceRoutes.js
│   └── notificationRoutes.js
├── middlewares/                  # Custom middlewares
│   ├── corsMiddleware.js
│   └── authMiddleware.js
├── .env                          # Environment variables
└── package.json

```

## Environment Variables (.env)
```
PORT=3000
DB_HOST=mysql
DB_USER=yoedu_user
DB_PASSWORD=yoedu@123
DB_NAME=yoedu_db
DB_DIALECT=mysql

SALT_PASSWORD=10

ACCESS_TOKEN_SECRET=yoedu_access_secret
REFRESH_TOKEN_SECRET=yoedu_refresh_secret
ACCESS_TOKEN_EXPIRES_MINUTES=15
REFRESH_TOKEN_EXPIRES_DAYS=7

FRONTEND_URL=http://localhost:5173
```

## Installation & Running

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install
npm start
```

## CORS Configuration
CORS được cấu hình cho các origin sau:
- http://localhost:3000
- http://localhost:5173
- http://localhost:8080
- http://127.0.0.1:3000
- http://127.0.0.1:5173
- ${FRONTEND_URL}

## API Response Format
```json
{
  "success": true/false,
  "message": "string",
  "data": "object or array",
  "error": "string (optional)"
}
```

## Database Tables & Models

### 1. Roles
Quản lý các vai trò trong hệ thống.

**Enum Values:**
- ADMIN - Quản trị viên
- TEACHER - Giáo viên
- STUDENT - Học viên
- PARENT - Phụ huynh

### 2. Users
Tài khoản đăng nhập.

**Fields:**
- id (BIGINT, Primary Key)
- username (VARCHAR 50, Unique)
- password_hash (VARCHAR 255)
- role_id (INT, Foreign Key)
- status (ENUM: ACTIVE, INACTIVE, BANNED)
- created_at, updated_at (TIMESTAMP)

### 3. User Profiles
Hồ sơ chi tiết của người dùng.

**Fields:**
- id (BIGINT, Primary Key)
- user_id (BIGINT, Foreign Key, Unique)
- full_name (VARCHAR 100)
- dob (DATE)
- phone (VARCHAR 20)
- email (VARCHAR 100, Unique)
- avatar_url (VARCHAR 255)
- address (TEXT)

### 4. Parents-Students
Liên kết phụ huynh-học sinh (Many-to-Many).

### 5. Courses
Danh mục khóa học.

**Fields:**
- id (BIGINT, Primary Key)
- name (VARCHAR 150)
- description (TEXT)
- tuition_fee (DECIMAL 12,2)
- status (ENUM: ACTIVE, DRAFT, ARCHIVED)
- created_at, updated_at (TIMESTAMP)

### 6. Schedule Templates
Lịch học mẫu.

**Fields:**
- id (BIGINT, Primary Key)
- name (VARCHAR 100)
- days_of_week (VARCHAR 50) - Format: '2,4,6'
- start_time (TIME)
- end_time (TIME)

### 7. Classrooms
Lớp học thực tế.

**Fields:**
- id (BIGINT, Primary Key)
- name (VARCHAR 100)
- course_id (BIGINT, Foreign Key)
- teacher_id (BIGINT, Foreign Key)
- schedule_template_id (BIGINT, Foreign Key)
- room_name (VARCHAR 50)
- max_students (INT)
- status (ENUM: OPEN, IN_PROGRESS, CLOSED)
- created_at (TIMESTAMP)

### 8. Enrollments
Đơn ghi danh.

**Fields:**
- id (BIGINT, Primary Key)
- student_id (BIGINT, Foreign Key)
- course_id (BIGINT, Foreign Key)
- class_id (BIGINT, Foreign Key, Nullable)
- status (ENUM: PENDING, APPROVED, REJECTED, CANCELED)
- created_at, updated_at (TIMESTAMP)

### 9. Attendances
Bảng điểm danh.

**Fields:**
- id (BIGINT, Primary Key)
- class_id (BIGINT, Foreign Key)
- student_id (BIGINT, Foreign Key)
- attendance_date (DATE)
- status (ENUM: PRESENT, ABSENT, EXCUSED)
- note (VARCHAR 255)
- created_at (TIMESTAMP)

### 10. Grades
Bảng điểm số.

**Fields:**
- id (BIGINT, Primary Key)
- class_id (BIGINT, Foreign Key)
- student_id (BIGINT, Foreign Key)
- midterm_score (DECIMAL 4,2)
- final_score (DECIMAL 4,2)
- total_score (DECIMAL 4,2)
- is_locked (BOOLEAN)
- updated_at (TIMESTAMP)

### 11. Invoices
Hóa đơn học phí.

**Fields:**
- id (BIGINT, Primary Key)
- student_id (BIGINT, Foreign Key)
- enrollment_id (BIGINT, Foreign Key)
- amount (DECIMAL 12,2)
- due_date (DATE)
- status (ENUM: UNPAID, PARTIAL, PAID, OVERDUE)
- paid_at (TIMESTAMP, Nullable)
- created_at (TIMESTAMP)

### 12. Notifications
Thông báo (nội dung gốc).

**Fields:**
- id (BIGINT, Primary Key)
- title (VARCHAR 255)
- content (TEXT)
- created_by (BIGINT, Foreign Key)
- created_at (TIMESTAMP)

### 13. User Notifications
Hộp thư người dùng (phân phối thông báo).

**Fields:**
- id (BIGINT, Primary Key)
- user_id (BIGINT, Foreign Key)
- notification_id (BIGINT, Foreign Key)
- is_read (BOOLEAN)
- read_at (TIMESTAMP, Nullable)

## API Endpoints

### Authentication
#### Register
```
POST /api/auth/register
Body: {
  username: string (required),
  password: string (required),
  full_name: string (required),
  email: string (optional),
  phone: string (optional),
  role_name: string (optional, default: STUDENT)
}
Response: {
  success: true,
  message: "Đăng ký thành công",
  data: { id, username, role }
}
```

#### Login
```
POST /api/auth/login
Body: {
  username: string (required),
  password: string (required)
}
Response: {
  success: true,
  message: "Đăng nhập thành công",
  data: {
    user: { id, username, role },
    accessToken: string,
    refreshToken: string
  }
}
```

#### Refresh Token
```
POST /api/auth/refresh-token
Body: {
  refreshToken: string (required)
}
Response: {
  success: true,
  message: "Refresh token thành công",
  data: { accessToken: string }
}
```

### Users (Protected)
All user endpoints require authentication via JWT token in header:
```
Authorization: Bearer {accessToken}
```

#### Get Current User Profile
```
GET /api/users/profile
Response: { success: true, data: { user } }
```

#### Get All Users
```
GET /api/users?role={role}&status={status}&limit=10&offset=0
Response: {
  success: true,
  data: { rows, count },
  pagination: { total, limit, offset }
}
```

#### Get User by ID
```
GET /api/users/{id}
Response: { success: true, data: { user } }
```

#### Update User
```
PUT /api/users/{id}
Body: {
  full_name: string,
  email: string,
  phone: string,
  avatar_url: string,
  address: string,
  status: enum
}
Response: { success: true, message: "Cập nhật user thành công", data: { user } }
```

#### Delete User (Admin only)
```
DELETE /api/users/{id}
Response: { success: true, message: "Xóa user thành công" }
```

### Courses
#### Get All Courses (Public)
```
GET /api/courses?status={status}&limit=10&offset=0
Response: {
  success: true,
  data: { rows, count },
  pagination: { total, limit, offset }
}
```

#### Get Course by ID (Public)
```
GET /api/courses/{id}
Response: { success: true, data: { course } }
```

#### Create Course (Admin only)
```
POST /api/courses
Authorization: Bearer {accessToken}
Body: {
  name: string (required),
  description: string,
  tuition_fee: number,
  status: enum
}
Response: { success: true, message: "Tạo khóa học thành công", data: { course } }
```

#### Update Course (Admin only)
```
PUT /api/courses/{id}
Authorization: Bearer {accessToken}
Body: {
  name: string,
  description: string,
  tuition_fee: number,
  status: enum
}
Response: { success: true, message: "Cập nhật khóa học thành công", data: { course } }
```

#### Delete Course (Admin only)
```
DELETE /api/courses/{id}
Authorization: Bearer {accessToken}
Response: { success: true, message: "Xóa khóa học thành công" }
```

### Classrooms
#### Get All Classrooms (Public)
```
GET /api/classrooms?course_id={id}&status={status}&limit=10&offset=0
Response: {
  success: true,
  data: { rows, count },
  pagination: { total, limit, offset }
}
```

#### Get Classroom by ID (Public)
```
GET /api/classrooms/{id}
Response: { success: true, data: { classroom } }
```

#### Create Classroom (Admin only)
```
POST /api/classrooms
Authorization: Bearer {accessToken}
Body: {
  name: string (required),
  course_id: number (required),
  teacher_id: number (required),
  schedule_template_id: number (required),
  room_name: string,
  max_students: number
}
Response: { success: true, message: "Tạo lớp học thành công", data: { classroom } }
```

#### Update Classroom (Admin, Teacher)
```
PUT /api/classrooms/{id}
Authorization: Bearer {accessToken}
Body: {
  name: string,
  room_name: string,
  max_students: number,
  status: enum
}
Response: { success: true, message: "Cập nhật lớp học thành công", data: { classroom } }
```

#### Delete Classroom (Admin only)
```
DELETE /api/classrooms/{id}
Authorization: Bearer {accessToken}
Response: { success: true, message: "Xóa lớp học thành công" }
```

### Enrollments (Protected)
#### Get All Enrollments
```
GET /api/enrollments?student_id={id}&course_id={id}&status={status}&limit=10&offset=0
Authorization: Bearer {accessToken}
Response: {
  success: true,
  data: { rows, count },
  pagination: { total, limit, offset }
}
```

#### Get Enrollment by ID
```
GET /api/enrollments/{id}
Authorization: Bearer {accessToken}
Response: { success: true, data: { enrollment } }
```

#### Create Enrollment (Student, Admin)
```
POST /api/enrollments
Authorization: Bearer {accessToken}
Body: {
  student_id: number (required),
  course_id: number (required),
  class_id: number (optional)
}
Response: { success: true, message: "Tạo ghi danh thành công", data: { enrollment } }
```

#### Update Enrollment (Admin only)
```
PUT /api/enrollments/{id}
Authorization: Bearer {accessToken}
Body: {
  class_id: number,
  status: enum
}
Response: { success: true, message: "Cập nhật ghi danh thành công", data: { enrollment } }
```

#### Delete Enrollment (Admin only)
```
DELETE /api/enrollments/{id}
Authorization: Bearer {accessToken}
Response: { success: true, message: "Xóa ghi danh thành công" }
```

### Attendances (Protected)
#### Get All Attendances
```
GET /api/attendances?class_id={id}&student_id={id}&status={status}&limit=10&offset=0
Authorization: Bearer {accessToken}
Response: {
  success: true,
  data: { rows, count },
  pagination: { total, limit, offset }
}
```

#### Get Attendance by ID
```
GET /api/attendances/{id}
Authorization: Bearer {accessToken}
Response: { success: true, data: { attendance } }
```

#### Create Attendance (Teacher, Admin)
```
POST /api/attendances
Authorization: Bearer {accessToken}
Body: {
  class_id: number (required),
  student_id: number (required),
  attendance_date: date (required),
  status: enum (required), // PRESENT, ABSENT, EXCUSED
  note: string (optional)
}
Response: { success: true, message: "Tạo điểm danh thành công", data: { attendance } }
```

#### Update Attendance (Teacher, Admin)
```
PUT /api/attendances/{id}
Authorization: Bearer {accessToken}
Body: {
  status: enum,
  note: string
}
Response: { success: true, message: "Cập nhật điểm danh thành công", data: { attendance } }
```

#### Delete Attendance (Admin only)
```
DELETE /api/attendances/{id}
Authorization: Bearer {accessToken}
Response: { success: true, message: "Xóa điểm danh thành công" }
```

### Grades (Protected)
#### Get All Grades
```
GET /api/grades?class_id={id}&student_id={id}&limit=10&offset=0
Authorization: Bearer {accessToken}
Response: {
  success: true,
  data: { rows, count },
  pagination: { total, limit, offset }
}
```

#### Get Grade by ID
```
GET /api/grades/{id}
Authorization: Bearer {accessToken}
Response: { success: true, data: { grade } }
```

#### Create Grade (Teacher, Admin)
```
POST /api/grades
Authorization: Bearer {accessToken}
Body: {
  class_id: number (required),
  student_id: number (required),
  midterm_score: decimal (optional),
  final_score: decimal (optional)
}
Response: { success: true, message: "Tạo điểm số thành công", data: { grade } }
```

#### Update Grade (Teacher, Admin)
```
PUT /api/grades/{id}
Authorization: Bearer {accessToken}
Body: {
  midterm_score: decimal,
  final_score: decimal,
  is_locked: boolean
}
Response: { success: true, message: "Cập nhật điểm số thành công", data: { grade } }
```

#### Delete Grade (Admin only)
```
DELETE /api/grades/{id}
Authorization: Bearer {accessToken}
Response: { success: true, message: "Xóa điểm số thành công" }
```

### Invoices (Protected)
#### Get All Invoices
```
GET /api/invoices?student_id={id}&status={status}&limit=10&offset=0
Authorization: Bearer {accessToken}
Response: {
  success: true,
  data: { rows, count },
  pagination: { total, limit, offset }
}
```

#### Get Invoice by ID
```
GET /api/invoices/{id}
Authorization: Bearer {accessToken}
Response: { success: true, data: { invoice } }
```

#### Create Invoice (Admin only)
```
POST /api/invoices
Authorization: Bearer {accessToken}
Body: {
  student_id: number (required),
  enrollment_id: number (required),
  amount: decimal (required),
  due_date: date (required)
}
Response: { success: true, message: "Tạo hóa đơn thành công", data: { invoice } }
```

#### Update Invoice (Admin only)
```
PUT /api/invoices/{id}
Authorization: Bearer {accessToken}
Body: {
  amount: decimal,
  due_date: date,
  status: enum,
  paid_at: timestamp
}
Response: { success: true, message: "Cập nhật hóa đơn thành công", data: { invoice } }
```

#### Delete Invoice (Admin only)
```
DELETE /api/invoices/{id}
Authorization: Bearer {accessToken}
Response: { success: true, message: "Xóa hóa đơn thành công" }
```

### Notifications
#### Get All Notifications (Public)
```
GET /api/notifications?limit=10&offset=0
Response: {
  success: true,
  data: { rows, count },
  pagination: { total, limit, offset }
}
```

#### Get Notification by ID (Public)
```
GET /api/notifications/{id}
Response: { success: true, data: { notification } }
```

#### Get User Notifications (Protected)
```
GET /api/notifications/user/notifications?limit=10&offset=0
Authorization: Bearer {accessToken}
Response: {
  success: true,
  data: { rows, count },
  pagination: { total, limit, offset }
}
```

#### Create Notification (Admin only)
```
POST /api/notifications
Authorization: Bearer {accessToken}
Body: {
  title: string (required),
  content: string (required),
  user_ids: array (optional) // Array of user IDs to send notification
}
Response: { success: true, message: "Tạo thông báo thành công", data: { notification } }
```

#### Update Notification (Admin only)
```
PUT /api/notifications/{id}
Authorization: Bearer {accessToken}
Body: {
  title: string,
  content: string
}
Response: { success: true, message: "Cập nhật thông báo thành công", data: { notification } }
```

#### Delete Notification (Admin only)
```
DELETE /api/notifications/{id}
Authorization: Bearer {accessToken}
Response: { success: true, message: "Xóa thông báo thành công" }
```

#### Mark Notification as Read (Protected)
```
PATCH /api/notifications/{notificationId}/mark-as-read
Authorization: Bearer {accessToken}
Response: { success: true, message: "Đánh dấu thông báo thành công", data: { userNotification } }
```

## Error Handling
- **400**: Bad Request - Validation errors
- **401**: Unauthorized - Missing or invalid token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Duplicate resource
- **500**: Internal Server Error

## Best Practices

### 1. Authentication
Always include token in header for protected routes:
```
Authorization: Bearer {accessToken}
```

### 2. Pagination
Use limit and offset for large result sets:
```
GET /api/users?limit=20&offset=0
```

### 3. Filtering
Use query parameters to filter:
```
GET /api/enrollments?status=PENDING&student_id=1
```

### 4. Rate Limiting
(To be implemented) - Consider adding rate limiting in production

### 5. Validation
All inputs are validated server-side before processing

## Testing
Run development server with auto-reload:
```bash
npm run dev
```

## Support
For issues or questions, contact the development team.
