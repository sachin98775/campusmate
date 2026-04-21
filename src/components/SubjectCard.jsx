export default function SubjectCard({ 
  subject, 
  attendancePct 
}) {
  const getStatusColor = (percentage) => {
    if (percentage >= 90) return { bg: "bg-green-500", text: "text-green-700", label: "Excellent", badge: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" };
    if (percentage >= 75) return { bg: "bg-blue-500", text: "text-blue-700", label: "Good", badge: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" };
    return { bg: "bg-yellow-500", text: "text-yellow-700", label: "Average", badge: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" };
  };

  const status = getStatusColor(attendancePct);
  const Icon = subject.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border transition-all duration-200 hover:shadow-xl hover:scale-105 cursor-pointer">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl ${subject.bgColor} ${subject.iconColor} dark:bg-opacity-20 flex items-center justify-center shadow-md`}>
              <Icon />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Click to view details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{attendancePct}%</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
          <div 
            className={`${status.bg} h-3 rounded-full transition-all duration-500`} 
            style={{ width: `${attendancePct}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.badge}`}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}
