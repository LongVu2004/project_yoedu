const Role = require('./Role');
const User = require('./User');
const UserProfile = require('./UserProfile');
const ParentStudent = require('./ParentStudent');
const Course = require('./Course');
const ScheduleTemplate = require('./ScheduleTemplate');
const Classroom = require('./Classroom');
const Enrollment = require('./Enrollment');
const Attendance = require('./Attendance');
const Grade = require('./Grade');
const Invoice = require('./Invoice');
const Notification = require('./Notification');
const UserNotification = require('./UserNotification');

// User - Role relationship
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// User - UserProfile relationship (1:1)
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Parent - Student relationship (Many to Many)
User.belongsToMany(User, {
  through: ParentStudent,
  as: 'students',
  foreignKey: 'parent_id',
  otherKey: 'student_id'
});
User.belongsToMany(User, {
  through: ParentStudent,
  as: 'parents',
  foreignKey: 'student_id',
  otherKey: 'parent_id'
});

// Course - Classroom relationship
Course.hasMany(Classroom, { foreignKey: 'course_id', as: 'classrooms' });
Classroom.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Teacher - Classroom relationship
User.hasMany(Classroom, { foreignKey: 'teacher_id', as: 'taught_classes' });
Classroom.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

// ScheduleTemplate - Classroom relationship
ScheduleTemplate.hasMany(Classroom, { foreignKey: 'schedule_template_id', as: 'classrooms' });
Classroom.belongsTo(ScheduleTemplate, { foreignKey: 'schedule_template_id', as: 'schedule' });

// Student - Enrollment relationship
User.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Course - Enrollment relationship
Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

// Classroom - Enrollment relationship
Classroom.hasMany(Enrollment, { foreignKey: 'class_id', as: 'enrollments' });
Enrollment.belongsTo(Classroom, { foreignKey: 'class_id', as: 'classroom' });

// Classroom - Attendance relationship
Classroom.hasMany(Attendance, { foreignKey: 'class_id', as: 'attendances' });
Attendance.belongsTo(Classroom, { foreignKey: 'class_id', as: 'classroom' });

// Student - Attendance relationship
User.hasMany(Attendance, { foreignKey: 'student_id', as: 'attendances' });
Attendance.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Classroom - Grade relationship
Classroom.hasMany(Grade, { foreignKey: 'class_id', as: 'grades' });
Grade.belongsTo(Classroom, { foreignKey: 'class_id', as: 'classroom' });

// Student - Grade relationship
User.hasMany(Grade, { foreignKey: 'student_id', as: 'grades' });
Grade.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Student - Invoice relationship
User.hasMany(Invoice, { foreignKey: 'student_id', as: 'invoices' });
Invoice.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

// Enrollment - Invoice relationship
Enrollment.hasMany(Invoice, { foreignKey: 'enrollment_id', as: 'invoices' });
Invoice.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });

// User - Notification relationship (created_by)
User.hasMany(Notification, { foreignKey: 'created_by', as: 'created_notifications' });
Notification.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Notification - UserNotification relationship
Notification.hasMany(UserNotification, { foreignKey: 'notification_id', as: 'user_notifications' });
UserNotification.belongsTo(Notification, { foreignKey: 'notification_id', as: 'notification' });

// User - UserNotification relationship
User.hasMany(UserNotification, { foreignKey: 'user_id', as: 'notifications' });
UserNotification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  Role,
  User,
  UserProfile,
  ParentStudent,
  Course,
  ScheduleTemplate,
  Classroom,
  Enrollment,
  Attendance,
  Grade,
  Invoice,
  Notification,
  UserNotification
};
