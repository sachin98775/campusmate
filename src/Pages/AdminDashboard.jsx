import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import CreateClassModal from '../components/CreateClassModal';
import { createClass, getClasses, getClassById, getTeachers } from '../services/api';

export default function AdminDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClasses: 0 });
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [componentError, setComponentError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    // Re-enable data fetching for add teacher functionality
    fetchDashboardData().catch(error => {
      console.error('Error in useEffect fetchDashboardData:', error);
      setComponentError('Failed to load dashboard data');
    });
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setComponentError(null);

      const [classesResponse, teachersResponse] = await Promise.all([getClasses(), getTeachers()]);
      const baseClasses = classesResponse?.data || [];
      const teachersData = teachersResponse?.data || [];

      const classesWithCounts = await Promise.all(
        baseClasses.map(async (classItem) => {
          try {
            const details = await getClassById(classItem.id);
            return {
              ...classItem,
              subjects: details?.data?.subjects || classItem.subjects || [],
              student_count:
                (details?.data?.students && details.data.students.length) ||
                classItem.student_count ||
                0,
            };
          } catch {
            return {
              ...classItem,
              subjects: classItem.subjects || [],
              student_count: classItem.student_count || 0,
            };
          }
        })
      );

      const totalStudents = classesWithCounts.reduce(
        (sum, current) => sum + Number(current.student_count || 0),
        0
      );

      setStats({
        totalStudents,
        totalTeachers: teachersData.length,
        totalClasses: classesWithCounts.length,
      });
      setClasses(classesWithCounts);
      setTeachers(teachersData);
      setComponentError(null);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setStats({ totalStudents: 0, totalTeachers: 0, totalClasses: 0 });
      setClasses([]);
      setTeachers([]);
      setComponentError('Failed to load dashboard data. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = () => {
    setShowCreateClassModal(true);
  };

  const handleCreateClassSubmit = async (formData) => {
    try {
      const result = await createClass({ className: formData.className });
      if (result.success) {
        setShowCreateClassModal(false);
        fetchDashboardData();
      } else {
        console.error('Failed to create class:', result.message);
      }
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  const handleCloseCreateClassModal = () => {
    setShowCreateClassModal(false);
  };

  if (componentError) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{componentError}</p>
          <button
            onClick={() => {
              setComponentError(null);
              fetchDashboardData();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Icon components matching student dashboard style
  const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const TeacherIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const BookIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, Admin</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">System Overview</p>
            </div>
            {loading && <p className="text-sm text-blue-600 dark:text-blue-400">Refreshing...</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <button
            onClick={() => navigate('/admin-dashboard/classes')}
            className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Students</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalStudents}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <UsersIcon />
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate('/admin-dashboard/teachers')}
            className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Teachers</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalTeachers}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <TeacherIcon />
              </div>
            </div>
          </button>
          <button
            onClick={() => navigate('/admin-dashboard/classes')}
            className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Classes</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalClasses}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <BookIcon />
              </div>
            </div>
          </button>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-500 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Class Management</h2>
            <button
              onClick={handleCreateClass}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <BookIcon />
              <span>Create New Class</span>
            </button>
          </div>

          {classes.length === 0 ? (
            <div className="text-center py-12">
              <BookIcon />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No classes created yet</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Create your first class to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => navigate(`/admin-dashboard/class/${classItem.id}`)}
                  className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{classItem.name}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-700 px-3 py-2">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Students</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{classItem.student_count || 0}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-700 px-3 py-2">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Subjects</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{classItem.subjects?.length || 0}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Teacher Management</h2>
            <button
              onClick={() => navigate('/admin-dashboard/teachers')}
              className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <TeacherIcon />
              <span>View All Teachers</span>
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Total Teachers: <span className="font-semibold text-gray-900 dark:text-white">{teachers.length}</span>
            </p>
            <div className="space-y-2">
              {teachers.slice(0, 3).map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{teacher.name}</span>
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{teacher.teacherKey || teacher.teacher_code}</span>
                </div>
              ))}
              {teachers.length === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">No teachers found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateClassModal
        isOpen={showCreateClassModal}
        onClose={handleCloseCreateClassModal}
        onSubmit={handleCreateClassSubmit}
      />
    </div>
  );
}
