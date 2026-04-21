import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import apiService from '../services/api';

export default function ClassDetails() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false); // eslint-disable-line no-unused-vars
  const [showAddStudentModal, setShowAddStudentModal] = useState(false); // eslint-disable-line no-unused-vars
  const [teachers, setTeachers] = useState([]);
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState('');

  useEffect(() => {
    loadClassData();
    loadTeachers();
  }, [classId]);

  const loadClassData = async () => {
    try {
      setLoading(true);

      const res = await apiService.getClassById(classId);
      const data = res?.data;

      if (!data) throw new Error('Class not found');

      setClassData(data);
      setSubjects(data.subjects || []);
      setStudents(data.students || []);
    } catch (error) {
      console.error('Failed to load class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      const response = await apiService.getTeachers();
      const teachersData = response.data || [];
      setTeachers(teachersData);
    } catch (error) {
      console.error('Failed to load teachers:', error);
      // Fallback to mock data
      const mockTeachers = [
        { id: 'TCH001', name: 'Dr. Sarah Johnson', email: 'sarah@campus.com' },
        { id: 'TCH002', name: 'Prof. Michael Brown', email: 'michael@campus.com' },
        { id: 'TCH003', name: 'Ms. Emily Davis', email: 'emily@campus.com' }
      ];
      setTeachers(mockTeachers);
    }
  };

  const handleAddSubject = async (subjectData) => {
    try {
      console.log('Adding subject to class:', subjectData);
      
      // Add subject via API
      const result = await apiService.addSubjectToClass({
        class_id: classId,
        subject_name: subjectData.subject_name
      });
      
      if (result.success) {
        console.log('Subject added successfully:', result);
        setShowAddSubjectModal(false);
        loadClassData(); // Reload class data
      } else {
        console.error('Failed to add subject:', result.error);
        alert('Failed to add subject: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      alert('Error adding subject: ' + error.message);
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      console.log('Adding student to class:', studentData);
      
      // Add student via API
      const result = await apiService.addStudent({
        ...studentData,
        class_id: classId
      });
      
      if (result.success) {
        console.log('Student added successfully:', result);
        setShowAddStudentModal(false);
        if (result.student) {
          setStudents((prev) => [...prev, result.student]);
        } else {
          // Fallback if API doesn't return the created student
          loadClassData();
        }
      } else {
        console.error('Failed to add student:', result.error);
        alert('Failed to add student: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student: ' + error.message);
    }
  };

  const handleAssignTeacher = async (subjectId, teacherId) => {
    try {
      const result = await apiService.assignTeacherToSubject({
        classId: classId,
        subjectId: subjectId,
        teacherId: teacherId
      });
      
      if (result.success) {
        // Update local state
        setSubjects(prevSubjects => 
          prevSubjects.map(subject => 
            subject.id === subjectId 
              ? { 
                  ...subject, 
                  teacherId: teacherId, 
                  teacherName: result.teacher.name,
                  teacherKey: result.teacher.teacherKey || ''
                }
              : subject
          )
        );
        
        setShowTeacherDropdown(null);
        setSelectedTeacher('');
        alert('Teacher assigned successfully!');
      } else {
        alert('Failed to assign teacher: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error assigning teacher:', error);
      alert('Error assigning teacher: ' + error.message);
    }
  };

  const handleDeleteSubject = (subjectId) => {
    // UI-only delete for now (mock state). Backend delete not wired yet.
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    setShowTeacherDropdown(null);
    setSelectedTeacher('');
  };

  const handleDeleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const StatCard = ({ label, value, variant }) => {
    const isBlue = variant === 'blue';
    return (
      <div
        className={`rounded-2xl border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md min-w-0 ${
          isBlue
            ? 'border-blue-200/70 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/35 dark:to-gray-800/90'
            : 'border-emerald-200/70 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/35 dark:to-gray-800/90'
        }`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p
          className={`mt-3 text-4xl sm:text-5xl font-bold tabular-nums tracking-tight ${
            isBlue ? 'text-blue-700 dark:text-blue-300' : 'text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {value}
        </p>
      </div>
    );
  };

  const handleTeacherDropdownToggle = (subjectId) => {
    if (showTeacherDropdown === subjectId) {
      setShowTeacherDropdown(null);
      setSelectedTeacher('');
    } else {
      setShowTeacherDropdown(subjectId);
      setSelectedTeacher('');
    }
  };

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeacher(teacherId);
  };

  const handleConfirmAssignment = (subjectId) => {
    if (selectedTeacher) {
      handleAssignTeacher(subjectId, selectedTeacher);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <AdminNavbar />
        <div className="w-full min-w-0 max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading class details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <AdminNavbar />
        <div className="w-full min-w-0 max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Class not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <AdminNavbar />

      <div className="w-full min-w-0 max-w-[1200px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Class header + stats */}
        <div className="mb-6 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-700/80 dark:bg-gray-800 sm:p-6 md:mb-8 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {classData.name}
            </h1>
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard')}
              className="w-full shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:bg-gray-900 sm:w-auto"
            >
              ← Back
            </button>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            <StatCard label="Total subjects" value={subjects.length} variant="blue" />
            <StatCard label="Total students" value={students.length} variant="green" />
          </div>
        </div>

        {/* Main: ~68% list / ~32% forms */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 space-y-6 lg:col-span-8">
            {/* Subjects */}
            <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-700/80 dark:bg-gray-800 sm:p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">Subjects</h2>
              </div>

              {subjects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 py-12 text-center dark:border-gray-600 dark:bg-gray-900/30">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No subjects added yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          Assigned Teacher
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {subjects.map((subject) => {
                        const isAssigned = Boolean(subject.teacherId);
                        const isOpen = showTeacherDropdown === subject.id;
                        return (
                          <tr key={subject.id}>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                              {subject.name}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide rounded-full ${
                                  isAssigned
                                    ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                                    : 'bg-gray-200/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {isAssigned ? 'Assigned' : 'Not Assigned'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              {subject.teacherName || 'Not assigned'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleTeacherDropdownToggle(subject.id)}
                                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                    isAssigned
                                      ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                                      : 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                                  }`}
                                >
                                  {isAssigned ? 'Change' : 'Assign'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubject(subject.id)}
                                  className="rounded-lg p-1.5 text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                                  title="Delete subject"
                                >
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                              {isOpen && (
                                <div className="mt-2 flex flex-wrap gap-2 justify-end">
                                  <select
                                    value={selectedTeacher}
                                    onChange={(e) => handleTeacherSelect(e.target.value)}
                                    className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                  >
                                    <option value="">Choose teacher</option>
                                    {teachers.map((teacher) => (
                                      <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmAssignment(subject.id)}
                                    disabled={!selectedTeacher}
                                    className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setShowTeacherDropdown(null)}
                                    className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Students */}
            <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-700/80 dark:bg-gray-800 sm:p-6 md:p-8">
              <h2 className="mb-6 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">Students</h2>

              {students.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 py-12 text-center dark:border-gray-600 dark:bg-gray-900/30">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No students added yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          Roll Number
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          Email
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {students.map((student, index) => (
                        <tr key={student.id || index}>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                            {student.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                            {student.roll_number || student.rollNumber || '—'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {student.email || '—'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(student.id)}
                              className="inline-flex rounded-lg p-1.5 text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Remove student"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          <aside className="min-w-0 space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-700/80 dark:bg-gray-800 sm:p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">Add subject</h3>
              <form
                className="mt-6 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleAddSubject({ subject_name: formData.get('name') });
                }}
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                    placeholder="Subject name"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubjectModal(false)}
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-700/80 dark:bg-gray-800 sm:p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">Add student</h3>
              <form
                className="mt-6 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleAddStudent({
                    name: formData.get('name'),
                    roll_number: formData.get('roll_number'),
                    date_of_birth: formData.get('date_of_birth'),
                  });
                }}
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Roll number
                  </label>
                  <input
                    type="text"
                    name="roll_number"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    placeholder="e.g. BCA2023001"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
