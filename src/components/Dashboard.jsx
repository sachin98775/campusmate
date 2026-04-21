import { useMemo, useState } from "react";
import Card from "./Card";
import Sidebar from "./Sidebar";

function MetricIcon({ kind }) {
  const common = "h-5 w-5";
  switch (kind) {
    case "attendance":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2-2 4 4 8-8 4 4v10H3V12z" />
        </svg>
      );
    case "classes":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case "present":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-9 9-4-4" />
        </svg>
      );
    case "absent":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M18 6l-12 12" />
        </svg>
      );
    default:
      return null;
  }
}

function getSubjectStatus(attendance) {
  if (attendance >= 90) {
    return { label: "Excellent", pill: "bg-green-50 text-green-700 border-green-100", bar: "bg-green-500" };
  }
  if (attendance >= 75) {
    return { label: "Good", pill: "bg-blue-50 text-blue-700 border-blue-100", bar: "bg-blue-500" };
  }
  return { label: "Average", pill: "bg-yellow-50 text-yellow-700 border-yellow-100", bar: "bg-yellow-500" };
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const userName = "Sachin";

  const overall = useMemo(
    () => ({
      attendancePct: 92,
      totalClasses: 15,
      present: 14,
      absent: 1,
    }),
    []
  );

  const metrics = useMemo(
    () => [
      {
        id: "attendance",
        label: "Overall Attendance",
        value: `${overall.attendancePct}%`,
        icon: "attendance",
        accent: "from-blue-100 to-blue-50",
      },
      {
        id: "classes",
        label: "Total Classes",
        value: String(overall.totalClasses),
        icon: "classes",
        accent: "from-indigo-100 to-indigo-50",
      },
      {
        id: "present",
        label: "Present",
        value: String(overall.present),
        icon: "present",
        accent: "from-green-100 to-green-50",
      },
      {
        id: "absent",
        label: "Absent",
        value: String(overall.absent),
        icon: "absent",
        accent: "from-red-100 to-red-50",
      },
    ],
    [overall]
  );

  const subjects = useMemo(
    () => [
      { id: "ds", name: "Data Structures", attendancePct: 78, assignmentsDone: 12, totalAssignments: 15 },
      { id: "java", name: "Java Programming", attendancePct: 85, assignmentsDone: 14, totalAssignments: 15 },
      { id: "cn", name: "Computer Networks", attendancePct: 92, assignmentsDone: 15, totalAssignments: 15 },
      { id: "wd", name: "Web Development", attendancePct: 88, assignmentsDone: 13, totalAssignments: 15 },
      { id: "algo", name: "Algorithms", attendancePct: 75, assignmentsDone: 11, totalAssignments: 15 },
      { id: "db", name: "Database Systems", attendancePct: 70, assignmentsDone: 10, totalAssignments: 15 },
    ],
    []
  );

  const onSelectNav = (id) => {
    setActiveNav(id);
    setMobileOpen(false);
    if (id === "logout") {
      // Dummy behavior for now (no backend).
      alert("Logged out (dummy).");
      setActiveNav("dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-x-hidden">
      <Sidebar
        active={activeNav}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSelect={onSelectNav}
      />

      <div className="md:ml-64">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="min-w-0">
                <div className="text-sm sm:text-base font-semibold text-gray-900 truncate">Dashboard</div>
                <div className="text-xs text-gray-500 truncate">Welcome back, {userName}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-xs text-gray-500 whitespace-nowrap">
                Current Time: 21:07
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center font-semibold text-blue-700">
                {userName.slice(0, 1)}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  Hello, {userName} 👋
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-500">
                  Here's a quick snapshot of your attendance and progress.
                </p>
              </div>
            </div>
          </div>

          <section aria-label="Attendance overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((m) => (
                <Card key={m.id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium text-gray-500">{m.label}</div>
                      <div className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight">
                        {m.value}
                      </div>
                    </div>
                    <div
                      className={`
                        h-11 w-11 rounded-2xl bg-gradient-to-br border flex items-center justify-center
                        ${m.accent}
                        border-gray-200
                      `}
                    >
                      <div className="text-gray-700">
                        <MetricIcon kind={m.icon} />
                      </div>
                    </div>
                  </div>
                  {m.id === "attendance" ? (
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${overall.attendancePct}%` }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>On track</span>
                        <span>{overall.attendancePct}%</span>
                      </div>
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          </section>

          <section className="mt-8" aria-label="Subjects">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-semibold text-gray-900">All Subjects</div>
                <div className="text-xs text-gray-500">Your latest performance at a glance.</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
                  {subjects.length} subjects
                </span>
                <button
                  type="button"
                  className="text-xs px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {subjects.map((s) => {
                const status = getSubjectStatus(s.attendancePct);
                return (
                  <Card key={s.id} className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {s.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {s.name}
                        </div>
                        <button
                          type="button"
                          className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium truncate"
                        >
                          Click to view details
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${status.bar}`} style={{ width: `${s.attendancePct}%` }} />
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>Attendance</span>
                            <span>{s.attendancePct}%</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <span
                            className={`
                              inline-flex items-center px-3 py-1 rounded-full text-xs border
                              ${status.pill}
                            `}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
                        <div className="text-xs text-gray-500">Assignments</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {s.assignmentsDone}/{s.totalAssignments}
                        </div>
                      </div>
                      <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
                        <div className="text-xs text-gray-500">Attendance</div>
                        <div className="text-sm font-semibold text-gray-900">{s.attendancePct}%</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

