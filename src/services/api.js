import mockApiService from './mockApi.js';

// API Configuration
// Fallback to localhost if the environment variable is not defined
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// API Service Class with fallback to mock data
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
    this.useMock = false; // Real API by default
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('teacherData');
    localStorage.removeItem('userData');
  }

  // Get auth headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method with fallback to mock data
  async request(endpoint, options = {}) {
    // Special handling for temp-login.php - always use real API
    if (endpoint === '/temp-login.php') {
      return await this.tryRealApi(endpoint, options);
    }

    // If mock mode is enabled, use mock API directly
    if (this.useMock) {
      console.log(`Using mock API for: ${endpoint}`);
      return this.tryMockApi(endpoint, options);
    }

    // Try real API first
    try {
      const result = await this.tryRealApi(endpoint, options);
      this.useMock = false; // Reset mock flag on success
      return result;
    } catch (_error) { // eslint-disable-line no-unused-vars
      return this.tryMockApi(endpoint, options);
    }
  }

  async tryRealApi(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log(`Trying real API: ${url}`);
    
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error(`Server returned non-JSON response: ${text}`);
    }

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  }

  async tryMockApi(endpoint, options = {}) {
    console.log(`Using mock API for: ${endpoint}`);

    // Handle dynamic endpoints (query strings, ids)
    if (endpoint.startsWith('/admin/classes/')) {
      const classId = endpoint.split('/').pop();
      return await mockApiService.getClassById(classId);
    }
    if (endpoint.startsWith('/admin/teachers/') && options.method === 'DELETE') {
      const teacherId = endpoint.split('/').pop();
      return await mockApiService.deleteTeacher(teacherId);
    }
    if (endpoint === '/admin/teachers' && options.method === 'POST') {
      const payload = options.body ? JSON.parse(options.body) : {};
      return await mockApiService.addTeacher(payload);
    }
    if (endpoint === '/admin/teachers' && (!options.method || options.method === 'GET')) {
      return await mockApiService.getTeachers();
    }
    if (endpoint.startsWith('/teacher/subjects')) {
      return await mockApiService.getTeacherSubjects(endpoint);
    }
    if (endpoint.startsWith('/teacher/attendance-context/')) {
      const subjectId = endpoint.split('/').pop();
      return await mockApiService.getAttendanceContext(subjectId);
    }
    if (endpoint === '/teacher/attendance' && options.method === 'POST') {
      const payload = options.body ? JSON.parse(options.body) : [];
      return await mockApiService.submitAttendance(payload);
    }
    if (endpoint.startsWith('/subjects/assign-teacher')) {
      const payload = options.body ? JSON.parse(options.body) : {};
      return await mockApiService.assignTeacherToSubject(payload);
    }
    if (endpoint.startsWith('/admin/add-student')) {
      const payload = options.body ? JSON.parse(options.body) : {};
      return await mockApiService.addStudent(payload);
    }
    if (endpoint.startsWith('/admin/add-subject-to-class')) {
      const payload = options.body ? JSON.parse(options.body) : {};
      return await mockApiService.addSubjectToClass(payload);
    }
    if (endpoint.startsWith('/classes')) {
      return await mockApiService.getClasses();
    }
    if (endpoint.startsWith('/subjects')) {
      return await this.tryMockApi(endpoint, { url: endpoint });
    }
    
    // Use mock service
    const mockMethods = {
      '/auth/login': () => {
        const credentials = options.body ? JSON.parse(options.body) : {};
        return mockApiService.login(credentials);
      },
      '/admin/dashboard': () => mockApiService.getAdminDashboard(),
      '/admin/classes': () => mockApiService.getClasses(),
      '/admin/add-student': () => {
        const payload = options.body ? JSON.parse(options.body) : {};
        return mockApiService.addStudent(payload);
      },
      '/admin/assign-teacher-to-subject': () => ({ success: true, message: 'Teacher assigned successfully' }),
      '/teacher/dashboard': () => mockApiService.getTeacherDashboard(),
      '/teacher/subjects': () => mockApiService.getTeacherSubjects('/teacher/subjects'),
      '/student/dashboard': () => mockApiService.getStudentDashboard(),
    };

    const mockMethod = mockMethods[endpoint];
    if (mockMethod) {
      return await mockMethod();
    }

    throw new Error(`Mock response not available for endpoint: ${endpoint}`);
  }

  // Authentication methods
  async login(credentials) {
    try {
      // Try the real backend first
      const response = await fetch(`${API_BASE_URL}/temp-login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      // Backend is offline or unreachable — fall back to mock API
      console.warn('Backend unavailable, falling back to mock login:', error.message);
      const data = await this.tryMockApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data.success && data.token) {
        this.setToken(data.token);
      }

      return data;
    }
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (data.success && data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  // Admin methods
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getClassById(classId) {
    return this.request(`/admin/classes/${classId}`);
  }

  async addSubjectToClass(data) {
    return this.request('/admin/add-subject-to-class', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async addStudent(studentData) {
    return this.request('/admin/add-student', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async addTeacher(teacherData) {
    return this.request('/admin/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  }

  async deleteTeacher(teacherId) {
    return this.request(`/admin/teachers/${teacherId}`, {
      method: 'DELETE',
    });
  }

  async getTeachers() {
    return this.request('/admin/teachers');
  }

  async getClasses() {
    return this.request('/classes');
  }

  async getStudents() {
    return this.request('/admin/students');
  }

  async createClass(classData) {
    return this.request('/admin/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async assignTeacherToSubject(assignmentData) {
    return this.request('/subjects/assign-teacher', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  // Teacher methods
  async getTeacherDashboard() {
    return this.request('/teacher/dashboard');
  }

  async getTeacherClasses(teacherId) {
    return this.request(`/teacher/classes/${teacherId}`);
  }

  async getTeacherSubjects(teacherId) {
    const id = teacherId ? encodeURIComponent(String(teacherId)) : '';
    const endpoint = id ? `/teacher/subjects?teacherId=${id}` : '/teacher/subjects';
    return this.request(endpoint);
  }

  async getTeacherStudents(classId) {
    return this.request(`/teacher/students?classId=${classId}`);
  }

  async markAttendance(attendanceData) {
    return this.request('/teacher/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  async getAttendanceContext(subjectId) {
    return this.request(`/teacher/attendance-context/${encodeURIComponent(String(subjectId))}`);
  }

  async submitAttendance(attendanceData) {
    return this.request('/teacher/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Student methods
  async getStudentDashboard() {
    return this.request('/student/dashboard');
  }

  async getStudentSubjects(studentId, classId) {
    const endpoint = classId ? `/subjects?classId=${classId}` : '/subjects';
    return this.request(endpoint);
  }

  async getAttendanceSummary(studentId) {
    return this.request(`/student/attendance-summary/${studentId}`);
  }

  async getAttendanceDetails(studentId) {
    return this.request(`/student/attendance-details/${studentId}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for easier importing
export const login = (credentials) => apiService.login(credentials);
export const getAdminDashboard = () => apiService.getAdminDashboard();
export const getClasses = () => apiService.getClasses();
export const getClassById = (classId) => apiService.getClassById(classId);
export const getTeachers = () => apiService.getTeachers();
export const addTeacher = (teacherData) => apiService.addTeacher(teacherData);
export const createClass = (classData) => apiService.createClass(classData);
export const addSubjectToClass = (subjectData) => apiService.addSubjectToClass(subjectData);
export const addStudent = (studentData) => apiService.addStudent(studentData);
export const assignTeacherToSubject = (assignmentData) => apiService.assignTeacherToSubject(assignmentData);
export const deleteTeacher = (teacherId) => {
  return fetch(`${API_BASE_URL}/admin/teachers/${teacherId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());
};
export const getTeacherDashboard = () => apiService.getTeacherDashboard();
export const getTeacherSubjects = () => apiService.getTeacherSubjects();
export const getStudentDashboard = () => apiService.getStudentDashboard();
