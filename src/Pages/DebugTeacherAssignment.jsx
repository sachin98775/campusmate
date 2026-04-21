import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import apiService from '../services/api';

export default function DebugTeacherAssignment() {
  const { classId } = useParams();
  const [debugInfo, setDebugInfo] = useState({});
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');

  const debugAPI = async () => {
    try {
      console.log('=== DEBUGGING TEACHER ASSIGNMENT ===');
      
      // Test 1: Get classes
      console.log('1. Testing GET /api/classes...');
      const classesResponse = await apiService.getClasses();
      console.log('Classes response:', classesResponse);
      setClasses(classesResponse.data || []);
      
      // Test 2: Get teachers
      console.log('2. Testing GET /api/admin/teachers...');
      const teachersResponse = await apiService.getTeachers();
      console.log('Teachers response:', teachersResponse);
      setTeachers(teachersResponse.data || []);
      
      // Test 3: Find current class
      const currentClass = classesResponse.data?.find(c => c.id === classId);
      console.log('Current class:', currentClass);
      
      if (currentClass) {
        setSubjects(currentClass.subjects || []);
        console.log('Subjects:', currentClass.subjects);
      }
      
      // Test 4: Test teacher assignment
      console.log('4. Testing POST /api/subjects/assign-teacher...');
      const assignmentResponse = await apiService.assignTeacherToSubject({
        classId: 'class-001',
        subjectId: 'subj-001',
        teacherId: 'teacher-001'
      });
      console.log('Assignment response:', assignmentResponse);
      
      setDebugInfo({
        classes: classesResponse,
        teachers: teachersResponse,
        currentClass,
        subjects: currentClass?.subjects || [],
        assignment: assignmentResponse
      });
      
    } catch (error) {
      console.error('Debug error:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    debugAPI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTestAssignment = async () => {
    try {
      console.log('=== MANUAL ASSIGNMENT TEST ===');
      const result = await apiService.assignTeacherToSubject({
        classId: 'class-001',
        subjectId: 'subj-001',
        teacherId: 'teacher-001'
      });
      
      console.log('Assignment result:', result);
      alert('Assignment test: ' + JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Assignment test error:', error);
      alert('Assignment test error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Debug Teacher Assignment - Class {classId}
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">Error: {error}</p>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">API Test Results</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Classes ({classes.length})</h3>
              <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(classes, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Teachers ({teachers.length})</h3>
              <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(teachers, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Subjects ({subjects.length})</h3>
              <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(subjects, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assignment Test</h3>
              <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(debugInfo.assignment, null, 2)}
              </pre>
            </div>
          </div>
          
          <button
            onClick={handleTestAssignment}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Test Teacher Assignment
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Manual Teacher Assignment Test</h2>
          
          {subjects.map((subject) => (
            <div key={subject.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{subject.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current Teacher: {subject.teacherName || 'Not assigned'}
              </p>
              
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Teacher:
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.teacherKey})
                    </option>
                  ))}
                </select>
              </div>
              
              <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                Assign Teacher
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
