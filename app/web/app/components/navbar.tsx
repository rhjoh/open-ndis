export default function NavibationSidebar() {

  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Clients', href: '/clients' },
    { name: 'Carers', href: '/clients' },
    { name: 'Scheduling', href: '/scheduling' },
    { name: 'Invoices', href: '/invoices' },
    { name: 'Settings', href: '/settings' },
  ]

  return (
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
            { name: 'Dashboard', href: '/' },
            { name: 'Clients', href: '/clients' },
            { name: 'Carers', href: '#' },
            { name: 'Scheduling', href: '/scheduling', active: true },
            { name: 'Invoices', href: '#' },
            { name: 'Settings', href: '#' },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.active
                ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600'
                : 'text-gray-700 hover:bg-indigo-50'
                }`}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-current mr-3 opacity-60" />
              {item.name}
            </a>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">SJ</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Sarah Johnson</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

