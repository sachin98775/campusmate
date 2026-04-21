import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavbar from '../components/TeacherNavbar';
import apiService from '../services/api';

export default function TeacherSubjects() {
  const [teacherData, setTeacherData] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get teacher data from localStorage
    const storedTeacherData = localStorage.getItem('teacherData');
    if (storedTeacherData) {
      const parsed = JSON.parse(storedTeacherData);
      setTeacherData(parsed);

      apiService.getTeacherSubjects(parsed.id)
        .then((res) => {
          const subjects = res?.subjects || [];
          // normalize shape for existing UI
          setAssignedSubjects(subjects.map((s) => ({
            id: `${s.classId}-${s.id}`,
            subjectId: s.id,
            name: s.name,
            code: s.code,
            description: s.description || '',
            credits: s.credits,
            class: s.className,
            schedule: s.schedule || 'Not Set',
            room: s.room || 'Not Set',
            students: s.students || 0,
            icon: '📘',
          })));
        })
        .catch((e) => {
          console.error('Failed to load teacher subjects:', e);
          setAssignedSubjects([]);
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleMarkAttendance = (subjectId) => {
    // Navigate to the attendance page using the real subject ID
    // This matches the route: /attendance/:subjectId defined in App.jsx
    const subject = assignedSubjects.find(s => s.id === subjectId);
    if (subject) {
      navigate(`/attendance/${subject.subjectId}`);
    }
  };


  const filteredSubjects = assignedSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!teacherData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <TeacherNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Subjects</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your assigned subjects and classes
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {assignedSubjects.length} Subjects Assigned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6 transition-all duration-500 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search subjects by name, code, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {filteredSubjects.map((subject, index) => (
            <div
              key={subject.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Subject Name */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {subject.name}
              </h3>

              {/* Class Name */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                {subject.class}
              </p>

              {/* Student Count */}
              <p className="text-gray-500 dark:text-gray-500 text-xs mb-6">
                {subject.students} {subject.students === 1 ? 'student' : 'students'}
              </p>

              {/* Mark Attendance Button */}
              <button
                onClick={() => handleMarkAttendance(subject.id)}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Mark Attendance
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSubjects.length === 0 && (
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="text-gray-500 dark:text-gray-400">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="mt-2 text-sm">No subjects found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
