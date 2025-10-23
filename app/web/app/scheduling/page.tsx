"use client";
import { useState, useEffect } from 'react';
import NavibationSidebar from '../components/navbar';
import Modal from './modal';

type Shift = {
  shiftID: string;
  clientID: string;
  carerID: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  client: {
    id: number;
    fullName: string;
  }
  carer: {
    id: number;
    fullName: string;
  }
}

export default function SchedulingPage() {

  // Modal open state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [clientList, setClientList] = useState([])
  const [carerList, setCarerList] = useState([])
  const [allShifts, setAllShifts] = useState<Shift[]>([])

  async function handleNewShift() {
    setIsCreateOpen(true);
    console.log(carerList)
  }

  useEffect(() => {
    const getClientsCarers = async () => {
      try {
        const [resClients, resCarers] = await Promise.all([
          // Executes both fetch calls within the same async loop? 
          // Need to look into js event loop details again! 
          fetch('http://localhost:4000/scheduling/clients'),
          fetch('http://localhost:4000/scheduling/carers'),
        ]
        )

        if (!resClients.ok || !resCarers.ok) throw new Error("Network error");
        const [jsonClient, jsonCarers] = await Promise.all([
          resClients.json(),
          resCarers.json()
        ])
        setClientList(jsonClient)
        setCarerList(jsonCarers)
      } catch (error) {
        console.error("Error making initial fetch requests: ", error)
      }
    }
    getClientsCarers()
  }, [])

  useEffect(() => {
    // getAllShifts
    const getAllShifts = async () => {
      try {
        const response = await fetch('http://localhost:4000/scheduling/shifts')
        const shifts = await response.json()
        setAllShifts(shifts)
      } catch (error) {
        console.log(error)
      }
    }
    getAllShifts()
  }, [isCreateOpen])


  async function handleDelete(id: string) {
    // Optimistically remove from UI
    setAllShifts(prev => prev.filter(s => s.shiftID !== id));
    try {
      const res = await fetch(`/api/scheduling/${id}`, { method: 'DELETE' }); // TODO: Implement
      if (!res.ok) {
        console.error('Failed to delete shift', id);
        // On failure, re-add by refetching or reverting. Simple revert:
        // In a real app, we would refetch from server.
        // For now, do nothing further as backend is stubbed.
      }
    } catch (e) {
      console.error('Error deleting shift', e);
      // As above, we could revert state if needed.
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <NavibationSidebar />
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
                  placeholder="Search shifts..."
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
                <h1 className="text-2xl font-semibold text-gray-800">Scheduling</h1>
                <p className="text-sm text-gray-500">Manage upcoming shifts</p>
              </div>
              <button onClick={() => handleNewShift()} className="hidden md:inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                New Shift
              </button>
            </div>

            <section className="rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                <div className="col-span-3">Client</div>
                <div className="col-span-3">Carer</div>
                <div className="col-span-3">Date & Time</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              <ul className="divide-y divide-gray-200">
                {allShifts.map((s) => (
                  <li key={s.shiftID} className="px-4 py-4 hover:bg-gray-50">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                      <div className="md:col-span-3 flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
                          {s.client.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{s.client.fullName}</div>
                          <div className="text-xs text-gray-500">Client</div>
                        </div>
                      </div>
                      <div className="md:col-span-3 flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm font-semibold">
                          {s.carer.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{s.carer.fullName}</div>
                          <div className="text-xs text-gray-500">Carer</div>
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <div className="text-sm font-medium text-gray-900">{s.date}</div>
                        <div className="text-xs text-gray-500">{s.startTime}</div>
                      </div>
                      <div className="md:col-span-2">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.status === 'Planned' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {s.status}
                        </span>
                      </div>
                      <div className="md:col-span-1 flex md:justify-end gap-2">
                        <button className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">Edit</button>
                        <button onClick={() => handleDelete(s.shiftID)} className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500">Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </main>
        </div>
      </div>
      {/* New Shift Modal */}
      {isCreateOpen && (
        <Modal
          onClose={() => setIsCreateOpen(false)}
          clientList={clientList}
          carerList={carerList}
        />
      )}
    </div>
  );
}
