import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../components/TeacherNavbar';
import apiService from '../services/api';

export default function TeacherDashboard() {
  const [teacherData, setTeacherData] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BookIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  useEffect(() => {
    const loadTeacherDashboard = async () => {
      setLoading(true);

      const storedTeacherData = localStorage.getItem('teacherData');
      if (!storedTeacherData) {
        navigate('/login');
        return;
      }

      try {
        const parsed = JSON.parse(storedTeacherData);
        setTeacherData(parsed);

        const res = await apiService.getTeacherSubjects(parsed.id);
        const subjects = res?.subjects || [];
        setAssignedSubjects(
          subjects.map((s) => ({
            id: `${s.classId}-${s.id}`,
            subjectId: s.id,
            classId: s.classId,
            className: s.className,
            subjectName: s.name,
            totalStudents: s.students || 0,
          }))
        );
      } catch (error) {
        console.error('Failed to load teacher dashboard subjects:', error);
        setAssignedSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherDashboard();
  }, [navigate]);

  const handleMarkAttendance = (subjectId) => {
    navigate(`/attendance/${subjectId}`);
  };

  if (!teacherData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <TeacherNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const uniqueClassCount = new Set(assignedSubjects.map((item) => item.classId)).size;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <TeacherNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {teacherData.name}</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Your teaching overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Classes</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{uniqueClassCount}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg">
                <BookIcon />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Subjects</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{assignedSubjects.length}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-lg">
                <UsersIcon />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">My Subjects</h2>

          {loading ? (
            <div className="py-10 text-center text-sm text-gray-600 dark:text-gray-400">Loading subjects...</div>
          ) : assignedSubjects.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-600 dark:text-gray-400">No assigned subjects found</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignedSubjects.map((subjectItem) => (
                <div key={subjectItem.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70 p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{subjectItem.subjectName}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subjectItem.className}</p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{subjectItem.totalStudents} students</p>

                  <div className="mt-4">
                    <button
                      onClick={() => handleMarkAttendance(subjectItem.subjectId)}
                      className="w-full px-3 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Mark Attendance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
