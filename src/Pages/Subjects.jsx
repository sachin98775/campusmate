import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

export default function Subjects() {
  const [isVisible, setIsVisible] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Student data - in real app this would come from login
  const studentData = {
    name: 'Sachin',
    rollNumber: 'BCA2023001',
    class: 'BCA 3',
    classId: '3', // This should match the class ID from system
    email: 'sachin@campusmate.edu',
    phone: '+91 98765 43210'
  };

  // Function to fetch subjects for the student's class
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudentSubjects(studentData.rollNumber, studentData.classId);
      console.log('Subjects page - API response:', response);
      
      if (response.success && response.data) {
        // Map subjects data to include icons and colors
        const subjectsWithIcons = response.data.map((subject, index) => {
          const colors = ['blue', 'green', 'purple', 'orange', 'yellow', 'red'];
          const icons = [BrainIcon, CoffeeIcon, GlobeIcon, MonitorIcon, CodeIcon, DatabaseIcon];
          
          return {
            ...subject,
            color: colors[index % colors.length],
            icon: icons[index % icons.length],
            bgColor: `bg-${colors[index % colors.length]}-50`,
            iconColor: `text-${colors[index % colors.length]}-600`
          };
        });
        setSubjects(subjectsWithIcons);
        console.log('Subjects page - processed subjects:', subjectsWithIcons);
      } else {
        console.log('Subjects page - No subjects found or API error:', response);
        setSubjects([]);
      }
    } catch (error) {
      console.error('Subjects page - Failed to fetch subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 85) return { bg: 'bg-green-500', text: 'text-green-700', label: 'Excellent', badge: 'bg-green-100 text-green-600' };
    if (percentage >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'Good', badge: 'bg-yellow-100 text-yellow-600' };
    return { bg: 'bg-red-500', text: 'text-red-700', label: 'Needs Improvement', badge: 'bg-red-100 text-red-600' };
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-200 hover:border-blue-300 hover:shadow-blue-100',
      green: 'border-green-200 hover:border-green-300 hover:shadow-green-100',
      purple: 'border-purple-200 hover:border-purple-300 hover:shadow-purple-100',
      orange: 'border-orange-200 hover:border-orange-300 hover:shadow-orange-100',
      yellow: 'border-yellow-200 hover:border-yellow-300 hover:shadow-yellow-100',
      red: 'border-red-200 hover:border-red-300 hover:shadow-red-100',
    };
    return colors[color] || colors.blue;
  };

  const totalSubjects = subjects.length;
  const averageAttendance = Math.round(subjects.reduce((sum, subject) => sum + subject.attendancePct, 0) / totalSubjects);

  useEffect(() => {
    setIsVisible(true);
    fetchSubjects();
  }, []);

  const handleCardClick = (subjectName) => {
    console.log(`Clicked on ${subjectName}`);
    // Add navigation or modal logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Subjects</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Track your attendance and performance across all subjects</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalSubjects}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Subjects</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{averageAttendance}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Average Attendance</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Subjects List */}
        {!loading && subjects.length > 0 && (
          <div className="space-y-4">
            {subjects.map((subject, index) => {
            const status = getProgressColor(subject.attendancePct);
            const colorClasses = getColorClasses(subject.color);
            const Icon = subject.icon;
            
            return (
              <div
                key={subject.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border ${colorClasses} p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animation: isVisible ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                }}
                onClick={() => handleCardClick(subject.name)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  {/* Left side - Subject Info with Icon */}
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className={`w-12 h-12 rounded-xl ${subject.bgColor} ${subject.iconColor} dark:bg-opacity-20 flex items-center justify-center shadow-sm`}>
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">View Details →</p>
                    </div>
                  </div>

                  {/* Right side - Progress */}
                  <div className="flex-1 sm:max-w-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{subject.attendancePct}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                      <div 
                        className={`${status.bg} h-3 rounded-full transition-all duration-500`} 
                        style={{ width: `${subject.attendancePct}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.badge}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Empty State */}
        {!loading && subjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253" />
              </svg>
              <p className="mt-2 text-sm">No subjects found for your class</p>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6 transition-all duration-500 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{subjects.filter(s => s.attendancePct >= 85).length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Excellent</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{subjects.filter(s => s.attendancePct >= 60 && s.attendancePct < 85).length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Good</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{subjects.filter(s => s.attendancePct < 60).length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Needs Improvement</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
