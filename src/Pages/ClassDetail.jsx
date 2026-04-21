import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import AddSubjectToClassModal from '../components/AddSubjectToClassModal';
import AddStudentModal from '../components/AddStudentModal';
import { getClassById, addSubjectToClass, addStudent } from '../services/api';

export default function ClassDetail() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects');

  useEffect(() => {
    fetchClassData();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const data = await getClassById(classId);
      setClassData(data.data);
    } catch (error) {
      console.error('Failed to fetch class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (formData) => {
    try {
      const result = await addSubjectToClass({
        classId,
        subjectName: formData.subjectName
      });
      
      if (result.success) {
        fetchClassData(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const handleAddStudent = async (formData) => {
    try {
      const result = await addStudent({
        ...formData,
        classId
      });
      
      if (result.success) {
        fetchClassData(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Class not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-6 rounded-2xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-white/95 to-blue-50/70 dark:from-gray-800/95 dark:to-gray-800/80 shadow-sm backdrop-blur-[2px] p-3.5 sm:p-4.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {classData.name}
              </h1>
            </div>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="w-full sm:w-auto px-3.5 py-1.5 bg-gray-600/90 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Back
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="min-w-0 rounded-lg border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/40 px-3 py-2 shadow-sm">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold truncate">
                Total Subjects
              </p>
              <p className="mt-0.5 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {classData.subjects?.length || 0}
              </p>
            </div>
            <div className="min-w-0 rounded-lg border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-900/40 px-3 py-2 shadow-sm">
              <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold truncate">
                Total Students
              </p>
              <p className="mt-0.5 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {classData.students?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'subjects'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Subjects ({classData.subjects?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === 'students'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Students ({classData.students?.length || 0})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'subjects' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Subjects
              </h2>
              <button
                onClick={() => setShowAddSubjectModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Subject
              </button>
            </div>

            {classData.subjects && classData.subjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Subject Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Credits
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {classData.subjects.map((subject, index) => (
                      <tr key={subject?.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {subject?.name || subject || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {subject?.code || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {subject?.credits || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No subjects added yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Click "Add Subject" to get started
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Students
              </h2>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Student
              </button>
            </div>

            {classData.students && classData.students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date of Birth
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {classData.students.map((student, index) => (
                      <tr key={student?.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {student?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {student?.rollNumber || student?.roll_number || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {student?.dob || student?.date_of_birth || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No students added yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Click "Add Student" to get started
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      <AddSubjectToClassModal
        isOpen={showAddSubjectModal}
        onClose={() => setShowAddSubjectModal(false)}
        onSubmit={handleAddSubject}
        className={classData.name}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onSubmit={handleAddStudent}
      />
    </div>
  );
}
