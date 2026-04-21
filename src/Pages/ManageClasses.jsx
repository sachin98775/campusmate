import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import { getClasses, getClassById } from '../services/api';

export default function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getClasses();
      const rawClasses = response?.data || [];
      const enriched = await Promise.all(
        rawClasses.map(async (classItem) => {
          try {
            const details = await getClassById(classItem.id);
            return {
              ...classItem,
              totalStudents:
                (details?.data?.students && details.data.students.length) ||
                classItem.student_count ||
                0,
              totalSubjects: (details?.data?.subjects && details.data.subjects.length) || (classItem.subjects?.length || 0),
            };
          } catch {
            return {
              ...classItem,
              totalStudents: classItem.student_count || 0,
              totalSubjects: classItem.subjects?.length || 0,
            };
          }
        })
      );
      setClasses(enriched);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter((cls) =>
    (cls.name || '').toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <AdminNavbar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-3xl">
            <input
              type="text"
              placeholder="Search classes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/60 dark:text-white dark:ring-offset-0 border border-gray-200 dark:border-gray-700/60 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading classes...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div 
              key={cls.id} 
              onClick={() => navigate(`/admin-dashboard/class/${cls.id}`)}
              className="group relative bg-white dark:bg-[#1F2A3A] rounded-2xl shadow-md border border-gray-200/80 dark:border-gray-700/60 p-6 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:border-blue-200/70 dark:hover:border-blue-500/40 hover:ring-1 hover:ring-blue-200/60 dark:hover:ring-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                {cls.name}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Students</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{cls.totalStudents}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Subjects</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{cls.totalSubjects}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 16.5 18c-1.746 0-3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477 4.5 1.253" />
              </svg>
              <p className="mt-2 text-sm">No classes found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
