"use client";

import { use, useEffect } from "react";

type ModalProps = {
  className?: string;
  onClose: () => void;
  clientList: any[];
  carerList: any[];
};

export default function Modal({ className = "", onClose, clientList, carerList }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e:KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape)
    return(() => {
      document.removeEventListener('keydown', handleEscape)
    })
  }, [onClose])
  return (

    <div className='fixed inset-0 bg-black/50 z-40' onClick={onClose}>
      <div
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white text-black p-4 rounded shadow min-w-1/6 ${className}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          id="modal-header"
          className="flex justify-between items-center rounded-xl bg-white shadow-md"
        >
          <h2 className="text-md py-2 px-3 font-semibold text-gray-900">
            New Shift
          </h2>
            <p className="text-sm text-gray-500">Enter details to add a shift</p>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>        </button>
        </div>

        <form
          className="px-6 py-5"
          onSubmit={(e) => {
            e.preventDefault()
          }}>
          <div id="form_container" className="grid grid-cols-1 gap-4 sm:grid-cols-1">
            <div id="client_input" className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Client</label>
              <select
                id="client_select"
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {(Array.isArray(clientList) ? clientList : []).map((client, index) => (
                  <option key={index} value={client?.givenName || ''}>
                    {client?.givenName + ' ' + client?.familyName || ''}
                  </option>
                ))}
              </select>

            </div>
            <div id="carer_input" className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Carer</label>
              <select 
                id="carer_select"
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  {(Array.isArray(carerList) ? carerList : []).map((carer, index) => (
                    <option key={index} value={carer?.givenName || ''}>
                      {carer?.givenName + ' ' + carer?.familyName || ''}
                    </option>
                  ))}
                </select>
            </div>

            <div id="date_input" className="md:col-span-2">
              <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
              <input
                id="date"
                type="date"
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                ></input>
            </div>
            <div id="time_input" className="md:col-span-2">
              <label htmlFor="time" className="text-sm font-medium text-gray-700">Start Time</label>
              <input
                id="time"
                type="time"
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                ></input>
            </div>
            <div id="time_input" className="md:col-span-2">
              <label htmlFor="time" className="text-sm font-medium text-gray-700">End Time</label>
              <input
                id="time"
                type="time"
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                ></input>
            </div>
            <div id="location_input" className="md:col-span-2">
              <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
              <input
                id="location"
                type="text"
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="eg, 3000"
              ></input>
            </div>
            <div id="shift_notes" className="md:col-span-2">
              <label htmlFor="shift_notes" className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="shift_notes"
                className="w-full rounded-md border text-sm border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Optional shift notes.." 
                ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-medium text-white hover:bg-indigo-500 float-right mt-1"
            onClick={() => console.log(clientList)}
          >Submit
          </button>
        </form>

        {/* Form fields: carer, client, date, start_time, end_time, shift_location(postcode), shift_status, shift_notes */}

      </div>
    </div>
  );
}
