import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/DashboardCard';
import SubjectCard from '../components/SubjectCard';
import apiService from '../services/api';

// Custom SVG Icons for subjects
const BrainIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CoffeeIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6h-1V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2zM9 4h6v2H9V4zm10 12H5V8h14v8z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const MonitorIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const DatabaseIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [overallAttendance, setOverallAttendance] = useState({ percentage: 0, totalClasses: 0, presentClasses: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setStudentData({
        id: parsed.id,
        name: parsed.name,
        rollNumber: parsed.roll_number,
        class: parsed.class_name || 'BCA 3',
        classId: parsed.class_id,
        email: parsed.email,
        phone: parsed.phone
      });
    } else {
      // Fallback or redirect to login
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (studentData) {
      setIsVisible(true);
      fetchDashboardData();
    }
  }, [studentData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [subjectsRes, summaryRes] = await Promise.all([
        apiService.getStudentSubjects(studentData.rollNumber, studentData.classId),
        apiService.getAttendanceSummary(studentData.id)
      ]);
      
      if (subjectsRes.success && subjectsRes.data) {
        const subjectsWithIcons = subjectsRes.data.map((subject, index) => {
          const colors = ['blue', 'green', 'purple', 'orange', 'yellow', 'red'];
          const icons = [BrainIcon, CoffeeIcon, GlobeIcon, MonitorIcon, CodeIcon, DatabaseIcon];
          return {
            ...subject,
            color: colors[index % colors.length],
            icon: icons[index % icons.length]
          };
        });
        setSubjects(subjectsWithIcons);
      }

      if (summaryRes.success && summaryRes.data) {
        setOverallAttendance(summaryRes.data.overallAttendance);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!studentData) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Navbar studentData={studentData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {studentData.name}</h1>
              <div className="flex items-center mt-2">
                <p className="text-lg text-gray-600 dark:text-gray-300 mr-3">Course: {studentData.class}</p>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">Active</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Current Time</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{currentTime}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Last login: Today</div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content - Overall Attendance */}
        <div className={`mb-8 transition-all duration-500 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex items-center justify-center min-h-[350px] lg:min-h-[400px] w-full">
            <div className="relative">
              <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full border-8 border-blue-400 dark:border-blue-500 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 shadow-xl">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600 dark:text-blue-400">
                    {overallAttendance.percentage}%
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mt-2">
                    {overallAttendance.percentage >= 75 ? 'Excellent' : 'Low'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {overallAttendance.presentClasses} / {overallAttendance.totalClasses} Classes
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full">
                <div className="w-full h-full rounded-full border-4 border-blue-200 dark:border-blue-800"
                     style={{ clipPath: `inset(0 0 ${100 - overallAttendance.percentage}% 0)` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* All Subjects Section */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-500 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">All Subjects</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{subjects.length} subjects</span>
              <button 
                onClick={() => navigate('/subjects')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1 rounded-lg transition-colors"
              >
                View All
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Subject Cards Grid */}
          {!loading && subjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className={`transition-all duration-500 delay-${index * 100} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <SubjectCard
                    subject={subject}
                    attendancePct={subject.attendancePct}
                    assignmentsDone={0}
                    totalAssignments={15}
                    color={subject.color}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && subjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="mt-2 text-sm">No subjects found for your class</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}