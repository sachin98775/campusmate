function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
        CM
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-slate-900">CampusMate</div>
        <div className="text-xs text-slate-500">Student Dashboard</div>
      </div>
    </div>
  );
}

function NavIcon({ kind }) {
  const common = "h-5 w-5";
  switch (kind) {
    case "dashboard":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2 4 4 8-8 4 4v10H3V12z" />
        </svg>
      );
    case "subjects":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      );
    case "profile":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
        </svg>
      );
    case "logout":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 17l5-5-5-5" />
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12H9" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({
  active = "dashboard",
  mobileOpen = false,
  onClose = () => {},
  onSelect = () => {},
}) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "subjects", label: "Subjects", icon: "subjects" },
    { id: "profile", label: "Profile", icon: "profile" },
    { id: "logout", label: "Logout", icon: "logout" },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="px-4 py-5">
        <Logo />
      </div>

      <div className="px-2 pb-4">
        <div className="mt-2 grid gap-1">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition",
                  "border border-transparent",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "text-slate-700 hover:bg-slate-50 hover:border-slate-200",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex items-center justify-center rounded-lg",
                    isActive ? "text-blue-700" : "text-slate-500",
                  ].join(" ")}
                >
                  <NavIcon kind={item.icon} />
                </span>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto px-4 pb-6">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-100 px-4 py-4">
          <div className="text-sm font-semibold text-slate-900">Pro Tip</div>
          <div className="text-xs text-slate-600 mt-1">
            Keep checking attendance every week.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-white md:border-r md:border-slate-200">
        {sidebarContent}
      </aside>

      {/* Mobile overlay + sidebar */}
      <div
        className={[
          "fixed inset-0 z-50 md:hidden transition-opacity",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/40"
          onClick={onClose}
          aria-label="Close sidebar"
        />

        <aside
          className={[
            "absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white border-r border-slate-200 transform transition-transform duration-300 ease-out overflow-y-auto",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-label="Navigation menu"
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}

