import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import CreateClassModal from '../components/CreateClassModal';
import apiService from '../services/api';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    class_id: '',
    roll_number: '',
    plan: 'Active',
    date_of_birth: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [studentsRes, classesRes] = await Promise.all([
        apiService.getStudents(),
        apiService.getClasses()
      ]);
      setStudents(studentsRes.data || []);
      setClasses(classesRes.data || []);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.roll_number && student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.roll_number || !newStudent.class_id || !newStudent.date_of_birth) {
      setError('Name, Roll Number, Date of Birth, and Class are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await apiService.addStudent(newStudent);
      if (response.success) {
        setSuccess('Student added successfully!');
        setNewStudent({ name: '', email: '', phone: '', class_id: '', roll_number: '', plan: 'Active', date_of_birth: '' });
        setShowAddModal(false);
        fetchData();
      } else {
        setError(response.message || 'Failed to add student');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      class_id: student.class_id || '',
      roll_number: student.roll_number || '',
      plan: student.plan || 'Active',
      date_of_birth: student.dob || ''
    });
    setShowAddModal(true);
  };

  const handleUpdateStudent = async () => {
    // For now, let's just use addStudent for both or handle update if API supports it
    // Assuming we might need an update API, but since user only asked for "add logic", 
    // I'll focus on adding and listing.
    setError('Update logic not fully implemented in backend yet. Use Add Student.');
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student permanently from the database?')) {
      try {
        const response = await apiService.request(`/admin/students/${id}`, { method: 'DELETE' });
        if (response.success) {
          setSuccess('Student deleted successfully');
          setStudents(students.filter(s => s.id !== id));
        } else {
          setError(response.message || 'Failed to delete student');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleCreateClassSubmit = async (formData) => {
    try {
      const response = await apiService.createClass(formData);
      if (response.success) {
        setSuccess('Class created successfully!');
        setShowCreateClassModal(false);
        fetchData();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <AdminNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Students</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Manage all students in the system</p>
          </div>
          <button
            onClick={() => {
              setEditingStudent(null);
              setNewStudent({ name: '', email: '', phone: '', class_id: '', roll_number: '', plan: 'Active', date_of_birth: '' });
              setShowAddModal(true);
            }}
            className="mt-4 sm:mt-0 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Student</span>
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
            <span className="text-green-700 dark:text-green-300">{success}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{student.roll_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{student.email || '—'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{student.phone || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{student.class_name || '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEditStudent(student)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 mr-3">Edit</button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="text-red-600 dark:text-red-400 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No students found.</div>
          )}
          {loading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>
          )}
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={newStudent.roll_number}
                onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</div>
              <input
                type="date"
                value={newStudent.date_of_birth}
                onChange={(e) => setNewStudent({ ...newStudent, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <select
                value={newStudent.class_id}
                onChange={(e) => setNewStudent({ ...newStudent, class_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
              <button 
                onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingStudent ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={showCreateClassModal}
        onClose={() => setShowCreateClassModal(false)}
        onSubmit={handleCreateClassSubmit}
        teachers={[]} // Can fetch real teachers if needed
      />
    </div>
  );
}
