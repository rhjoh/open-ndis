export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
            <div className="flex h-16 items-center px-4 border-b border-gray-200">
              <div className="flex items-center">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white text-sm font-semibold">ON</span>
                <span className="ml-2 text-xl font-semibold text-gray-800">Open NDIS</span>
              </div>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {[
                { name: "Dashboard", href: "#" },
                { name: "Clients", href: "#", active: true },
                { name: "Carers", href: "#" },
                { name: "Scheduling", href: "/scheduling" },
                { name: "Invoices", href: "#" },
                { name: "Settings", href: "#" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.active
                    ? "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600"
                    : "text-gray-700 hover:bg-indigo-50"
                    }`}
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-current mr-3 opacity-60" />
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
                  SJ
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
            <button className="md:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100" aria-label="Open menu">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div className="ml-2 md:ml-0 w-full max-w-md">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </div>
                <input
                  className="w-full rounded-lg border-0 bg-gray-100 py-2 pl-10 pr-4 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100" aria-label="Notifications">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 5-3 7h18c0-2-3 0-3-7" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              </button>
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">SJ</div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-500">Overview for administrators</p>
              </div>
              <button className="hidden md:inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                New Shift
              </button>
            </div>

            {/* Stats */}
            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[{
                label: 'Active Participants', value: '42', color: 'bg-blue-50 text-blue-600'
              }, {
                label: 'Shifts Today', value: '18', color: 'bg-green-50 text-green-600'
              }, {
                label: 'Pending Invoices', value: '7', color: 'bg-yellow-50 text-yellow-600'
              }, {
                label: "This Month's Revenue", value: '$12,345', color: 'bg-purple-50 text-purple-600'
              }].map((c) => (
                <div key={c.label} className="rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${c.color}`}>
                      <span className="inline-block h-5 w-5">●</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">{c.label}</p>
                      <p className="text-2xl font-semibold text-gray-700">{c.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Upcoming Shifts */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Shifts</h2>
                <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500" href="#">View all</a>
              </div>
              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <ul className="divide-y divide-gray-200">
                  {[
                    { name: 'Michael Brown', time: '9:30 AM - 10:30 AM', status: 'Confirmed', badge: 'bg-green-100 text-green-800' },
                    { name: 'Emma Wilson', time: '11:00 AM - 12:00 PM', status: 'Pending', badge: 'bg-yellow-100 text-yellow-800' },
                    { name: 'David Taylor', time: '2:00 PM - 3:30 PM', status: 'Confirmed', badge: 'bg-green-100 text-green-800' },
                  ].map((s) => (
                    <li key={s.name} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
                          {s.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{s.name}</div>
                          <div className="text-sm text-gray-500">{s.time}</div>
                        </div>
                        <div className="ml-auto">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
                            {s.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
