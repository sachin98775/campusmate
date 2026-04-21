import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherNavbar from '../components/TeacherNavbar';
import apiService from '../services/api';

export default function TeacherAttendance() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [context, setContext] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadAttendanceContext = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getAttendanceContext(subjectId);
        const data = response?.data;

        if (!data) {
          setMessage('Subject not found');
          return;
        }

        setContext(data.subject);
        setStudents(data.students || []);

        const defaultAttendance = {};
        (data.students || []).forEach((student) => {
          defaultAttendance[student.id] = 'present';
        });
        setAttendance(defaultAttendance);
      } catch (error) {
        console.error('Failed to load attendance context:', error);
        setMessage(error.message || 'Failed to load attendance details');
      } finally {
        setIsLoading(false);
      }
    };

    loadAttendanceContext();
  }, [subjectId]);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!context) return;
    try {
      setIsSubmitting(true);
      setMessage('');
      const payload = students.map((student) => ({
        subjectId: context.subjectId,
        classId: context.classId,
        studentId: student.id,
        status: attendance[student.id] || 'absent',
        date: selectedDate,
      }));

      const response = await apiService.submitAttendance(payload);
      if (response?.success) {
        setMessage('Attendance submitted successfully.');
      } else {
        setMessage(response?.message || 'Failed to submit attendance');
      }
    } catch (error) {
      setMessage(error.message || 'Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const presentCount = useMemo(
    () => Object.values(attendance).filter((status) => status === 'present').length,
    [attendance]
  );

  const absentCount = useMemo(
    () => Object.values(attendance).filter((status) => status === 'absent').length,
    [attendance]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <TeacherNavbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">Loading attendance...</div>
        </div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <TeacherNavbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">{message || 'Attendance context not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <TeacherNavbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{context.subjectName}</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{context.className}</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Present</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{presentCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Absent</p>
            <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{absentCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Students</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">Roll Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">Present</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{student.roll_number || student.rollNumber || '—'}</td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={(attendance[student.id] || 'present') === 'present'}
                          onChange={(e) => handleStatusChange(student.id, e.target.checked ? 'present' : 'absent')}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {(attendance[student.id] || 'present') === 'present' ? 'Present' : 'Absent'}
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {message ? (
          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">{message}</p>
        ) : null}

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/teacher-dashboard')}
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmitAttendance}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
}
