const STORAGE_KEYS = {
  teachers: 'campusmate_mock_teachers_v1',
  classes: 'campusmate_mock_classes_v2',
  students: 'campusmate_mock_students_v1',
  attendance: 'campusmate_mock_attendance_v1',
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
};

// Mock data arrays (persisted)
let mockTeachers = loadFromStorage(STORAGE_KEYS.teachers, [
  {
    id: 'teacher-001',
    name: 'John Smith',
    phone: '9876543210',
    department: 'Computer Science',
    teacherKey: 'KCPT001',
    teacher_code: 'KCPT001',
    email: 'john.smith@campusmate.com',
    created_at: new Date().toISOString()
  },
  {
    id: 'teacher-002',
    name: 'Sarah Johnson',
    phone: '9876543211',
    department: 'Mathematics',
    teacherKey: 'KCPT002',
    teacher_code: 'KCPT002',
    email: 'sarah.johnson@campusmate.com',
    created_at: new Date().toISOString()
  }
]);
let mockClasses = loadFromStorage(STORAGE_KEYS.classes, [
  {
    id: '1',
    name: 'BCA 1A',
    grade: '1',
    section: 'A',
    subjects: [
      { id: 'MATH101', name: 'Mathematics', code: 'MATH101', credits: 4, teacherId: 'temp-teacher-KCPT001', teacherName: 'Teacher KCPT001', teacherKey: 'KCPT001' },
      { id: 'CS101', name: 'C Programming', code: 'CS101', credits: 3, teacherId: 'temp-teacher-KCPT001', teacherName: 'Teacher KCPT001', teacherKey: 'KCPT001' },
      { id: 'CS102', name: 'Python Programming', code: 'CS102', credits: 3, teacherId: 'temp-teacher-KCPT001', teacherName: 'Teacher KCPT001', teacherKey: 'KCPT001' }
    ],
    student_count: 25
  },
  {
    id: '2',
    name: 'BCA 2A',
    grade: '2',
    section: 'A',
    subjects: [
      { id: 'CS201', name: 'Data Structures', code: 'CS201', credits: 4, teacherId: '', teacherName: 'Not assigned', teacherKey: '' },
      { id: 'CS202', name: 'Algorithms', code: 'CS202', credits: 4, teacherId: '', teacherName: 'Not assigned', teacherKey: '' }
    ],
    student_count: 30
  },
  {
    id: '3',
    name: 'BCA 3A',
    grade: '3',
    section: 'A',
    subjects: [
      { id: 'ETECH301', name: 'e-Tech', code: 'ETECH301', credits: 4, teacherId: '', teacherName: 'Not assigned', teacherKey: '', attendancePct: 88 },
      { id: 'WEBTECH302', name: 'Web Technologies', code: 'WEBTECH302', credits: 4, teacherId: '', teacherName: 'Not assigned', teacherKey: '', attendancePct: 92 },
      { id: 'CS203', name: 'Database Systems', code: 'CS203', credits: 3, teacherId: '', teacherName: 'Not assigned', teacherKey: '', attendancePct: 85 },
      { id: 'CS204', name: 'Computer Networks', code: 'CS204', credits: 3, teacherId: '', teacherName: 'Not assigned', teacherKey: '', attendancePct: 79 },
      { id: 'CS205', name: 'Software Engineering', code: 'CS205', credits: 4, teacherId: '', teacherName: 'Not assigned', teacherKey: '', attendancePct: 91 },
      { id: 'CS206', name: 'Operating Systems', code: 'CS206', credits: 3, teacherId: '', teacherName: 'Not assigned', teacherKey: '', attendancePct: 76 }
    ],
    student_count: 28
  }
]);
let mockStudents = loadFromStorage(STORAGE_KEYS.students, [
  { id: 'student-001', name: 'Alice Johnson', roll_number: 'BCA001', dob: '2000-01-15', class_id: '1', role: 'student' },
  { id: 'student-002', name: 'Bob Smith', roll_number: 'BCA002', dob: '2000-02-20', class_id: '1', role: 'student' },
  { id: 'student-003', name: 'Charlie Brown', roll_number: 'BCA003', dob: '2000-03-10', class_id: '1', role: 'student' },
  { id: 'student-004', name: 'Diana Prince', roll_number: 'BCA004', dob: '2000-04-05', class_id: '1', role: 'student' },
  { id: 'student-005', name: 'Edward Norton', roll_number: 'BCA005', dob: '2000-05-12', class_id: '1', role: 'student' }
]);
let mockAttendance = loadFromStorage(STORAGE_KEYS.attendance, []);
let mockSubjects = [
  { id: 'MATH101', name: 'Mathematics', code: 'MATH101', credits: 4 },
  { id: 'CS101', name: 'C Programming', code: 'CS101', credits: 3 },
  { id: 'CS102', name: 'Python Programming', code: 'CS102', credits: 3 },
  { id: 'CS201', name: 'Data Structures', code: 'CS201', credits: 4 },
  { id: 'CS202', name: 'Algorithms', code: 'CS202', credits: 4 },
  { id: 'CS203', name: 'Database Systems', code: 'CS203', credits: 3 },
  { id: 'CS204', name: 'Web Development', code: 'CS204', credits: 3 },
  { id: 'PHY101', name: 'Physics', code: 'PHY101', credits: 3 }
];

// Helper function to generate unique teacher key
const generateTeacherKey = () => {
  const maxNumber = mockTeachers.reduce((max, teacher) => {
    const key = teacher.teacherKey || teacher.teacher_code || '';
    const match = String(key).toUpperCase().match(/^KCPT(\d{3,})$/);
    if (!match) return max;
    const value = Number(match[1]);
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `KCPT${String(maxNumber + 1).padStart(3, '0')}`;
};

// Fallback Mock API Service for when backend is not available
class MockApiService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api';
    this.isBackendAvailable = false;
  }

  async checkBackendAvailability() {
    try {
      const response = await fetch('http://localhost:8000/public/test.php');
      this.isBackendAvailable = response.ok;
      return this.isBackendAvailable;
    } catch (_error) { // eslint-disable-line no-unused-vars
      this.isBackendAvailable = false;
      return false;
    }
  }

  async request(endpoint, options = {}) {
    // Skip backend check for mock mode - always use mock data
    console.log('=== MOCK API REQUEST ===');
    console.log('Endpoint:', endpoint);
    console.log('Options:', options);
    console.log('Using mock data for:', endpoint);
    const result = this.getMockResponse(endpoint, options);
    console.log('Mock result:', result);
    console.log('=== END MOCK API REQUEST ===');
    return result;
  }

  getMockResponse(endpoint, options = {}) {
    const mockResponses = {
      '/auth/login': (credentials) => {
        const { role, adminKey, teacherKey, phone, dob, roll_number } = credentials;
        
        // Mock authentication logic
        if (role === 'admin' && adminKey === 'Kcpadmin123') {
          return {
            success: true,
            token: 'mock-admin-token',
            user: {
              id: 'admin-1',
              name: 'Admin User',
              email: 'admin@campusmate.com',
              role: 'admin'
            }
          };
        } else if (role === 'teacher' && teacherKey) {
          // Find teacher by key only (case-insensitive)
          const teacher = mockTeachers.find(
            (t) => String(t.teacher_code || t.teacherKey).toUpperCase() === String(teacherKey).toUpperCase()
          );
          if (teacher) {
            return {
              success: true,
              token: 'mock-teacher-token',
              user: {
                id: teacher.id,
                name: teacher.name,
                phone: teacher.phone,
                teacherKey: teacher.teacherKey,
                email: teacher.email,
                role: 'teacher',
                teacher_code: teacher.teacher_code
              }
            };
          } else {
            throw new Error('Invalid teacher key. Please check and try again.');
          }
        } else if (role === 'teacher') {
          throw new Error('Teacher key is required.');
        } else if (role === 'student' && dob && roll_number) {
          // Find student by roll number and DOB (mock data uses 'dob' field)
          const student = mockStudents.find(s => s.roll_number === roll_number && (s.dob === dob || s.date_of_birth === dob));
          if (student) {
            return {
              success: true,
              token: 'mock-student-token',
              user: {
                id: student.id,
                name: student.name,
                roll_number: student.roll_number,
                class_id: student.class_id,
                role: 'student'
              }
            };
          } else {
            throw new Error('Student not found. Please check your roll number and date of birth.');
          }
        }
        
        throw new Error('Invalid credentials');
      },

      '/admin/dashboard': () => ({
        success: true,
        stats: {
          total_students: 120,
          total_teachers: mockTeachers.length,
          total_classes: mockClasses.length,
          total_subjects: mockSubjects.length
        },
        recent_activities: [
          { id: 1, type: 'system_cleared', message: 'All mock data cleared', time: 'Just now', icon: '???' },
          { id: 2, type: 'ready', message: 'System ready for fresh setup', time: 'Just now', icon: '???' },
          { id: 3, type: 'admin', message: 'Admin can now create classes', time: 'Just now', icon: '??' }
        ]
      }),

      '/classes': () => ({
        success: true,
        data: mockClasses,
        count: mockClasses.length,
        message: 'Classes retrieved successfully',
        timestamp: new Date().toISOString()
      }),

      '/admin/teachers': (teacherData, options) => {
        console.log('Mock API /admin/teachers called with:', teacherData, 'options:', options);
        
        // Handle GET request (fetch teachers)
        if (!options || !options.method || options.method === 'GET') {
          console.log('Returning teachers:', mockTeachers);
          return {
            success: true,
            data: mockTeachers
          };
        }
        
        // Handle POST request (add teacher)
        const { name, phone, department } = teacherData;
        const cleanedPhone = String(phone || '').replace(/\D/g, '');

        if (!name?.trim() || !department?.trim() || !cleanedPhone) {
          throw new Error('Name, phone and department are required');
        }
        if (!/^\d{10}$/.test(cleanedPhone)) {
          throw new Error('Phone number must be 10 digits');
        }
        const duplicatePhone = mockTeachers.some(
          (t) => String(t.phone || '').replace(/\D/g, '') === cleanedPhone
        );
        if (duplicatePhone) {
          throw new Error('A teacher with this phone number already exists');
        }

        const teacherKey = generateTeacherKey();
        const newTeacher = {
          id: 'teacher-' + Date.now(),
          name: name.trim(),
          phone: cleanedPhone,
          department: department.trim(),
          teacherKey,
          teacher_code: teacherKey, // Add teacher_code for login compatibility
          email: `${name.trim().toLowerCase().replace(/\s+/g, '.')}@campusmate.com`,
          created_at: new Date().toISOString()
        };
        
        console.log('Adding new teacher:', newTeacher);
        mockTeachers.push(newTeacher);
        saveToStorage(STORAGE_KEYS.teachers, mockTeachers);
        
        console.log('Updated teachers list:', mockTeachers);
        
        return {
          success: true,
          message: 'Teacher added successfully',
          teacher: newTeacher,
          data: mockTeachers // Return updated list
        };
      },

      '/admin/create-class': (classData) => {
        const { className } = classData;
        const newClass = {
          id: 'class-' + Date.now(),
          name: className,
          subjects: [],
          created_at: new Date().toISOString()
        };
        mockClasses.push(newClass);
        return {
          success: true,
          message: 'Class created successfully',
          class_id: newClass.id
        };
      },

      '/admin/classes/:classId': (options) => {
        const classId = options.url.split('/').pop();
        const classItem = mockClasses.find(c => c.id === classId);
        if (classItem) {
          // Get students for this class
          const classStudents = mockStudents.filter(s => s.class_id === classId);
          return {
            success: true,
            data: {
              ...classItem,
              students: classStudents
            }
          };
        } else {
          throw new Error('Class not found');
        }
      },

      '/admin/add-student': (studentData) => {
        const { name, roll_number, date_of_birth, class_id } = studentData;
        // Check if roll number already exists in the class
        const existingStudent = mockStudents.find(s => s.roll_number === roll_number && s.class_id === class_id);
        if (existingStudent) {
          throw new Error('Roll number already exists in this class');
        }
        const newStudent = {
          id: 'student-' + Date.now(),
          name,
          roll_number,
          date_of_birth,
          class_id,
          created_at: new Date().toISOString()
        };
        mockStudents.push(newStudent);
        saveToStorage(STORAGE_KEYS.students, mockStudents);
        return {
          success: true,
          message: 'Student added successfully',
          student: newStudent
        };
      },

      '/admin/assign-teacher': (assignmentData) => {
        const { class_id, teacher_id } = assignmentData;
        const classItem = mockClasses.find(c => c.id === class_id);
        const teacher = mockTeachers.find(t => t.id === teacher_id);
        
        if (!classItem) throw new Error('Class not found');
        if (!teacher) throw new Error('Teacher not found');
        
        classItem.assigned_teacher = teacher_id;
        teacher.assigned_classes.push(class_id);
        
        return {
          success: true,
          message: 'Teacher assigned to class successfully'
        };
      },

      '/admin/add-subject-to-class': (subjectData) => {
        const { class_id, subject_id, subject_name } = subjectData;
        const classItem = mockClasses.find(c => c.id === class_id);
        
        if (!classItem) throw new Error('Class not found');

        // If subject_id is provided, attach an existing subject from catalog
        if (subject_id) {
          const subject = mockSubjects.find(s => s.id === subject_id);
          if (!subject) throw new Error('Subject not found');

          if (classItem.subjects.find(s => s.id === subject_id)) {
            throw new Error('Subject already added to this class');
          }

          classItem.subjects.push({
            ...subject,
            teacherId: '',
            teacherName: 'Not assigned',
            teacherKey: ''
          });

          saveToStorage(STORAGE_KEYS.classes, mockClasses);
          return { success: true, message: 'Subject added to class successfully' };
        }

        // Otherwise create a simple subject by name
        const name = String(subject_name || '').trim();
        if (!name) throw new Error('Subject name is required');

        const normalized = name.toLowerCase();
        if ((classItem.subjects || []).some((s) => String(s.name || '').toLowerCase() === normalized)) {
          throw new Error('Subject already added to this class');
        }

        const newSubject = {
          id: `SUBJ-${Date.now()}`,
          name,
          code: '',
          credits: '',
          teacherId: '',
          teacherName: 'Not assigned',
          teacherKey: ''
        };

        classItem.subjects = classItem.subjects || [];
        classItem.subjects.push(newSubject);

        saveToStorage(STORAGE_KEYS.classes, mockClasses);
        
        return {
          success: true,
          message: 'Subject added to class successfully'
        };
      },

      '/teacher/dashboard': () => ({
        success: true,
        stats: {
          assigned_classes: 0,
          total_students: 0,
          classes_today: 0,
          hours_per_week: 0
        },
        assigned_classes: []
      }),

      '/teacher/subjects': () => ({
        success: true,
        subjects: []
      }),

      '/student/dashboard': () => ({
        success: true,
        stats: {
          enrolled_classes: 0,
          total_credits: 0,
          attendance_rate: 0,
          upcoming_classes: 0
        },
        enrolled_classes: []
      }),

      '/subjects': (options, endpoint) => {
        // endpoint looks like '/subjects?classId=3'
        const qs = (endpoint || '').split('?')[1] || '';
        const params = new URLSearchParams(qs);
        const classId = params.get('classId');
        console.log('Mock API: /subjects called, classId:', classId);

        if (!classId) {
          return { success: false, message: 'Class ID is required' };
        }

        const classItem = mockClasses.find(c => c.id === classId);
        if (!classItem) {
          return { success: false, message: 'Class not found' };
        }

        const subjectsData = (classItem.subjects || []).map(subject => ({
          ...subject,
          attendancePct: subject.attendancePct ?? (Math.floor(Math.random() * 30) + 70),
        }));

        return {
          success: true,
          data: subjectsData
        };
      },

      '/subjects/assign-teacher': (assignmentData) => {
        console.log('Mock API: Assign teacher called with:', assignmentData);
        const { classId, subjectId, teacherId } = assignmentData;
        
        // Find the teacher
        const teacher = mockTeachers.find(t => t.id === teacherId);
        if (!teacher) {
          return {
            success: false,
            message: 'Teacher not found'
          };
        }
        
        // Update subject in mock classes
        const classToUpdate = mockClasses.find(c => c.id === classId);
        if (classToUpdate && classToUpdate.subjects) {
          const subjectToUpdate = classToUpdate.subjects.find(s => s.id === subjectId);
          if (subjectToUpdate) {
            subjectToUpdate.teacherId = teacherId;
            subjectToUpdate.teacherName = teacher.name;
            subjectToUpdate.teacherKey = teacher.teacherKey;
          }
        }

        saveToStorage(STORAGE_KEYS.classes, mockClasses);
        
        return {
          success: true,
          message: 'Teacher assigned successfully',
          teacher: {
            id: teacher.id,
            name: teacher.name,
            teacherKey: teacher.teacherKey
          }
        };
      }
    };

    // Return mock response or error
    // Strip query string for key lookup, but pass full endpoint for param parsing
    const path = endpoint.split('?')[0];
    const mockHandler = mockResponses[path] || mockResponses[endpoint];
    if (mockHandler) {
      if (typeof mockHandler === 'function') {
        // For login, we need to pass the request body
        const body = options.body ? JSON.parse(options.body) : {};
        return mockHandler(body, endpoint);
      }
      return mockHandler;
    }

    throw new Error(`Mock response not available for endpoint: ${endpoint}`);
  }

  // Authentication methods
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  }

  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getClasses() {
    return {
      success: true,
      data: mockClasses
    };
  }

  async getClassById(classId) {
    const classItem = mockClasses.find(c => c.id === classId);
    if (classItem) {
      // Get students for this class
      const classStudents = mockStudents.filter(s => s.class_id === classId);
      return {
        success: true,
        data: {
          ...classItem,
          students: classStudents
        }
      };
    } else {
      throw new Error('Class not found');
    }
  }

  async getTeachers() {
    return {
      success: true,
      data: mockTeachers
    };
  }

  async assignTeacherToSubject(assignmentData) {
    return this.request('/subjects/assign-teacher', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async getTeacherSubjects(_endpoint = '/teacher/subjects') { // eslint-disable-line no-unused-vars
    // Return demo subjects directly for any teacher request
    return {
      success: true,
      subjects: [
        {
          id: 'MATH101',
          name: 'Mathematics',
          code: 'MATH101',
          credits: 4,
          teacherId: 'temp-teacher-KCPT001',
          teacherName: 'Teacher KCPT001',
          teacherKey: 'KCPT001',
          classId: '1',
          className: 'BCA 1A',
          students: 5
        },
        {
          id: 'CS101',
          name: 'C Programming',
          code: 'CS101',
          credits: 3,
          teacherId: 'temp-teacher-KCPT001',
          teacherName: 'Teacher KCPT001',
          teacherKey: 'KCPT001',
          classId: '1',
          className: 'BCA 1A',
          students: 5
        },
        {
          id: 'CS102',
          name: 'Python Programming',
          code: 'CS102',
          credits: 3,
          teacherId: 'temp-teacher-KCPT001',
          teacherName: 'Teacher KCPT001',
          teacherKey: 'KCPT001',
          classId: '1',
          className: 'BCA 1A',
          students: 5
        }
      ]
    };
  }

  async getSubjects() {
    return {
      success: true,
      subjects: mockSubjects
    };
  }

  async addTeacher(teacherData) {
    return this.request('/admin/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  }

  async deleteTeacher(teacherId) {
    const updated = mockTeachers.filter((teacher) => String(teacher.id) !== String(teacherId));
    mockTeachers = updated;
    saveToStorage(STORAGE_KEYS.teachers, mockTeachers);
    return {
      success: true,
      message: 'Teacher deleted successfully',
    };
  }

  async createClass(classData) {
    return this.request('/admin/create-class', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async addStudent(studentData) {
    return this.request('/admin/add-student', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async assignTeacher(assignmentData) {
    return this.request('/admin/assign-teacher', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async addSubjectToClass(subjectData) {
    return this.request('/admin/add-subject-to-class', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  async getAttendanceContext(subjectId) {
    let classForSubject = null;
    let subject = null;

    for (const cls of mockClasses) {
      const found = (cls.subjects || []).find((s) => String(s.id) === String(subjectId));
      if (found) {
        classForSubject = cls;
        subject = found;
        break;
      }
    }

    if (!classForSubject || !subject) {
      throw new Error('Subject not found');
    }

    const students = mockStudents.filter((student) => String(student.class_id) === String(classForSubject.id));

    return {
      success: true,
      data: {
        subject: {
          subjectId: subject.id,
          subjectName: subject.name,
          classId: classForSubject.id,
          className: classForSubject.name,
        },
        students,
      },
    };
  }

  async submitAttendance(attendanceRows = []) {
    if (!Array.isArray(attendanceRows) || attendanceRows.length === 0) {
      throw new Error('Attendance data is required');
    }

    const { subjectId, date } = attendanceRows[0];
    const duplicate = mockAttendance.some(
      (row) => String(row.subjectId) === String(subjectId) && String(row.date) === String(date)
    );

    if (duplicate) {
      throw new Error('Attendance already submitted for this subject today');
    }

    const timestamp = new Date().toISOString();
    const rowsToSave = attendanceRows.map((row) => ({
      subjectId: row.subjectId,
      classId: row.classId,
      studentId: row.studentId,
      status: row.status === 'present' ? 'present' : 'absent',
      date: row.date,
      created_at: timestamp,
    }));

    mockAttendance = [...mockAttendance, ...rowsToSave];
    saveToStorage(STORAGE_KEYS.attendance, mockAttendance);

    return {
      success: true,
      message: 'Attendance submitted successfully',
      count: rowsToSave.length,
    };
  }
}

// Create and export the service
const mockApiService = new MockApiService();
export default mockApiService;
