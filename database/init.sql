-- ==============================================================================
-- YOEDU - DATABASE INITIALIZATION SCRIPT
-- RDBMS: MySQL 8.x
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS yoedu_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE yoedu_db;

-- ------------------------------------------------------------------------------
-- PHẦN 1: NGƯỜI DÙNG & PHÂN QUYỀN (Auth & Users)
-- ------------------------------------------------------------------------------

-- 1. Bảng Vai trò
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'
    description VARCHAR(255)
);

-- 2. Bảng Tài khoản (Đăng nhập)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. Bảng Hồ sơ chi tiết
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    dob DATE,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    avatar_url VARCHAR(255),
    address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Bảng liên kết Phụ huynh - Học sinh (Nhiều - Nhiều)
CREATE TABLE parents_students (
    parent_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    relationship_type VARCHAR(50) DEFAULT 'Parent', -- Bố, Mẹ, Người giám hộ...
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (parent_id, student_id),
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ------------------------------------------------------------------------------
-- PHẦN 2: ĐÀO TẠO CỐT LÕI (Core Academic)
-- ------------------------------------------------------------------------------

-- 5. Bảng Danh mục Khóa học
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    tuition_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status ENUM('ACTIVE', 'DRAFT', 'ARCHIVED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Bảng Khung giờ học mẫu
CREATE TABLE schedule_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- VD: Lịch Tối 2-4-6
    days_of_week VARCHAR(50) NOT NULL, -- Định dạng: '2,4,6'
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- 7. Bảng Lớp học thực tế
CREATE TABLE classrooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Tên lớp cụ thể (VD: IELTS K12)
    course_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    schedule_template_id BIGINT NOT NULL,
    room_name VARCHAR(50),
    max_students INT DEFAULT 20,
    status ENUM('OPEN', 'IN_PROGRESS', 'CLOSED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (schedule_template_id) REFERENCES schedule_templates(id) ON DELETE RESTRICT
);


-- ------------------------------------------------------------------------------
-- PHẦN 3: GHI DANH & HỌC VỤ (Enrollment & Operations)
-- ------------------------------------------------------------------------------

-- 8. Bảng Đơn ghi danh (Luồng đăng ký)
CREATE TABLE enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    class_id BIGINT NULL, -- Null khi chờ duyệt, có giá trị khi đã xếp lớp
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
    FOREIGN KEY (class_id) REFERENCES classrooms(id) ON DELETE SET NULL
);

-- 9. Bảng Điểm danh
CREATE TABLE attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('PRESENT', 'ABSENT', 'EXCUSED') NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_attendance (class_id, student_id, attendance_date),
    FOREIGN KEY (class_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. Bảng Điểm số
CREATE TABLE grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    midterm_score DECIMAL(4, 2) NULL CHECK (midterm_score >= 0 AND midterm_score <= 10),
    final_score DECIMAL(4, 2) NULL CHECK (final_score >= 0 AND final_score <= 10),
    total_score DECIMAL(4, 2) NULL,
    is_locked BOOLEAN DEFAULT FALSE, -- Để khóa không cho sửa khi đã chốt điểm
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_grade (class_id, student_id),
    FOREIGN KEY (class_id) REFERENCES classrooms(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ------------------------------------------------------------------------------
-- PHẦN 4: TÀI CHÍNH & GIAO TIẾP (Finance & Communication)
-- ------------------------------------------------------------------------------

-- 11. Bảng Hóa đơn học phí
CREATE TABLE invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    enrollment_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('UNPAID', 'PARTIAL', 'PAID', 'OVERDUE') DEFAULT 'UNPAID',
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE RESTRICT
);

-- 12. Bảng Thông báo (Nội dung gốc)
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by BIGINT NOT NULL, -- Người tạo thông báo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 13. Bảng Hộp thư người dùng (Phân phối thông báo)
CREATE TABLE user_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_id BIGINT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
);

-- ==============================================================================
-- INSERT DỮ LIỆU MẪU CƠ BẢN (SEED DATA)
-- ==============================================================================

INSERT INTO roles (name, description) VALUES 
('ADMIN', 'Quản trị viên hệ thống'),
('TEACHER', 'Giáo viên và Trợ giảng'),
('STUDENT', 'Học viên đăng ký học'),
('PARENT', 'Phụ huynh theo dõi học viên');