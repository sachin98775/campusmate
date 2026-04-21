import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AddTeacherModal from '../components/AddTeacherModal';
import { getTeachers, addTeacher } from '../services/api';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      console.log('Starting fetchTeachers...');
      setLoading(true);
      setError(null);
      
      const response = await getTeachers();
      console.log('API Response:', response);
      
      if (response && response.data) {
        setTeachers(response.data);
        console.log('Teachers set:', response.data);
      } else {
        console.log('No data in response, setting empty array');
        setTeachers([]);
      }
      
      setError(null);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      setError('Failed to load teachers. Please try again.');
      setTeachers([]);
    } finally {
      setLoading(false);
      console.log('fetchTeachers completed, loading set to false');
    }
  };

  const handleAddTeacher = () => {
    setShowAddTeacherModal(true);
  };

  const handleAddTeacherSubmit = async (formData) => {
    try {
      console.log('Adding teacher:', formData);
      
      // Close modal immediately for better UX
      setShowAddTeacherModal(false);
      
      const response = await addTeacher(formData);
      console.log('Add teacher response:', response);

      if (response && response.success) {
        console.log('Teacher added successfully');
        
        // Refresh teachers list immediately
        await fetchTeachers();
        
        // Show success message
        alert(`Teacher added successfully!\nTeacher Key: ${response.teacher?.teacherKey || 'Generated'}`);
      } else {
        console.error('Failed to add teacher:', response?.message);
        alert('Failed to add teacher: ' + (response?.message || 'Unknown error'));
        // Refresh list anyway to ensure consistency
        await fetchTeachers();
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('Error adding teacher. Please try again.');
      // Refresh list anyway to ensure consistency
      await fetchTeachers();
    }
  };

  const handleCloseAddTeacherModal = () => {
    setShowAddTeacherModal(false);
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        console.log('Delete teacher:', teacherId);
        alert('Delete functionality coming soon');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Error deleting teacher. Please try again.');
      }
    }
  };

  const TeacherIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading teachers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Teachers</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchTeachers();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teachers Management</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Manage and view all teachers in the system</p>
            </div>
            <button
              onClick={handleAddTeacher}
              className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <TeacherIcon />
              <span>Add New Teacher</span>
            </button>
          </div>
        </div>

        {/* Teachers List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {console.log('Rendering teachers section, teachers array:', teachers)}
          {(!teachers || teachers.length === 0) ? (
            <div className="text-center py-12">
              <TeacherIcon />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No teachers added yet</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Add your first teacher to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  All Teachers ({teachers.length})
                </h2>
                <button
                  onClick={fetchTeachers}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                >
                  Refresh
                </button>
              </div>

              {/* Teachers Table */}
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teacher Key</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Subjects</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {teachers?.map((teacher, index) => {
                      console.log('Rendering teacher:', teacher, 'index:', index);
                      return (
                        <tr key={teacher.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                  {teacher?.name?.charAt(0)?.toUpperCase() || 'T'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {teacher?.name || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {teacher?.email || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded font-mono">
                              {teacher?.teacherKey || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {teacher?.department || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                No subjects assigned
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteTeacher(teacher?.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                              title="Delete Teacher"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Add Teacher Modal */}
        <AddTeacherModal
          isOpen={showAddTeacherModal}
          onClose={handleCloseAddTeacherModal}
          onSubmit={handleAddTeacherSubmit}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
