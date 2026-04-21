import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import AddTeacherModal from '../components/AddTeacherModal';
import apiService from '../services/api';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTeacher, setAddingTeacher] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forceUpdate, setForceUpdate] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiService.getTeachers();
      
      let teachersData = [];
      
      if (response && response.data) {
        teachersData = response.data;
      } else if (response && response.teachers) {
        teachersData = response.teachers;
      } else if (Array.isArray(response)) {
        teachersData = response;
      } else {
        teachersData = [];
      }
      
      setTeachers(teachersData);
      
    } catch (error) {
      setError('Failed to fetch teachers: ' + error.message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = () => {
    setShowAddModal(true);
  };

  
  const handleAddTeacherSubmit = async (formData) => {
    try {
      setAddingTeacher(true);
      setError('');
      const response = await apiService.addTeacher(formData);
      
      if (response?.success) {
        const teacherKey = response.teacher?.teacherKey || response.teacher?.teacher_code || 'Generated';
        setSuccess(`Teacher added successfully! Teacher Key: ${teacherKey}`);
        setShowAddModal(false);
        
        // Refresh the teachers list
        await fetchTeachers();
        setForceUpdate(Date.now());
        return { success: true };
      } else {
        setError(response?.message || 'Failed to add teacher');
        return { success: false, message: response?.message || 'Failed to add teacher' };
      }
      
    } catch (error) {
      setError('Failed to add teacher: ' + error.message);
      return { success: false, message: error.message };
    } finally {
      setAddingTeacher(false);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiService.deleteTeacher(teacherId);
      
      if (response?.success) {
        setSuccess('Teacher deleted successfully');
        await fetchTeachers();
        setForceUpdate(Date.now());
      } else {
        setError(response?.message || 'Failed to delete teacher');
      }
      
    } catch (error) {
      setError('Failed to delete teacher: ' + error.message);
    }
  };

  const filteredTeachers = teachers?.filter(teacher =>
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacherKey?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <AdminNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading teachers...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <AdminNavbar />
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Teachers</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Manage all teachers in the system</p>
              </div>
              <button
                onClick={handleAddTeacher}
                className="mt-4 sm:mt-0 px-4 py-2.5 bg-green-600 dark:bg-green-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center space-x-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Teacher</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700 dark:text-green-300">{success}</span>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="relative max-w-lg">
              <input
                type="text"
                placeholder="Search teachers by name, email, teacher key, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Teachers List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Teachers ({filteredTeachers.length})
              </h2>
            </div>
            
            {/* Structured Teacher Rows */}
            <div className="p-4 sm:p-6 space-y-3">
              {filteredTeachers.map((teacher, index) => (
                <div
                  key={`${teacher.id || `teacher-${index}`}-${forceUpdate}`}
                  className="bg-gray-50/70 dark:bg-gray-700/60 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
                    <div className="md:col-span-4 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {teacher.name || 'Unknown'}
                      </h3>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</p>
                      <p className="text-sm text-gray-900 dark:text-white">{teacher.department || 'Not assigned'}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Teacher Key</p>
                      <p className="text-xs sm:text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded inline-block">
                        {teacher.teacherKey || teacher.teacher_code || 'N/A'}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</p>
                      <p className="text-sm text-gray-900 dark:text-white">{teacher.phone || 'No phone'}</p>
                    </div>

                    <div className="md:col-span-2 flex justify-start md:justify-end space-x-2">
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="mt-2 text-sm">
                    {teachers.length === 0 ? 'No teachers found. Add your first teacher!' : 'No teachers match your search.'}
                  </p>
                  {teachers.length === 0 && (
                    <button
                      onClick={handleAddTeacher}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add First Teacher
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTeacherSubmit}
        isLoading={addingTeacher}
      />
    </>
  );
}
