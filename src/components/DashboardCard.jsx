export default function DashboardCard({ title, subtitle, color = "blue", icon: Icon }) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600",
    green: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600",
    yellow: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:shadow-lg hover:border-yellow-300 dark:hover:border-yellow-600",
    red: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:shadow-lg hover:border-red-300 dark:hover:border-red-600",
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg shadow-md p-6 border transition-all duration-200 hover:scale-105 cursor-pointer h-full`}>
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-bold leading-tight">{title}</div>
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-tight">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
