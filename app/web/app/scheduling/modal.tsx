"use client";

import { Client } from '../types/client'
import { Carer } from '../types/carer'
import { useEffect, useState } from "react";
// Dangerous to import from /api ??

type ModalProps = {
  className?: string;
  onClose: () => void;
  clientList: Client[];
  carerList: Carer[];
};

type FormData = {
  client: string;
  carer: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes: string | null;
}

export default function Modal({ className = "", onClose, clientList, carerList }: ModalProps) {
  const [inputFieldErrors, setInputFieldErrors] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    client: '',
    carer: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: ''
  })

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose])

  useEffect(() => {
    // Populate formData with default values - acts as a placeholder for the <select> elements. 
    // Preserves previous selection, if none exists set it to first item in the list, if none exists set as ''
    // This is ultimately irrelevant because the clientList and carerList are only fetched on parent mount and shouldn't change. 
    if (clientList.length > 0 && carerList.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        client: prevFormData.client || clientList[0]?.id || '',
        carer: prevFormData.carer || carerList[0]?.id || '',
      }));
    }
  }, [clientList, carerList])

  useEffect(() => {
    if (inputFieldErrors) {
      const allFilled = formData.client && formData.carer && formData.startTime && formData.endTime && formData.location
      if (allFilled) {
        setInputFieldErrors(false)
      }
    }
  }, [formData, inputFieldErrors])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const postNewShift = async () => {
    if (!formData.client || !formData.carer || !formData.date || !formData.startTime || !formData.endTime || !formData.location) {
      console.error("Form fields missing data - unable to post")
      setInputFieldErrors(true);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/scheduling/newShift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formData: formData
        })
      }
      )

      if (!res.ok) {
        console.error("Error posting new shift: " + res.status);
        return;
      }

      const data = await res.json();
      console.log("POST successful: " + data);
      onClose()
    } catch (error) {
      console.error("Error posting new shift: " + error)
    }
  }
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
                name="client"
                id="client_select"
                value={formData.client} // Both formData.client and client.id are ultimately clientList[0].id here
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                onChange={handleInputChange}
              >
                {(Array.isArray(clientList) ? clientList : []).map((client, index) => (
                  <option key={index} value={client?.id || ''}>
                    {client?.givenName + ' ' + client?.familyName || ''}
                  </option>
                ))}
              </select>

            </div>
            <div id="carer_input" className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Carer</label>
              <select
                name="carer"
                id="carer_select"
                value={formData.carer}
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                onChange={handleInputChange}
              >
                {(Array.isArray(carerList) ? carerList : []).map((carer, index) => (
                  <option key={index} value={carer?.id || ''}>
                    {carer?.givenName + ' ' + carer?.familyName || ''}
                  </option>
                ))}
              </select>
            </div>

            <div id="date_field" className="md:col-span-2">
              <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
              <input
                name="date"
                id="date_input"
                type="date"
                value={formData.date}
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                onChange={handleInputChange}
              ></input>
            </div>

            <div id="time_input" className="md:col-span-2">
              <label htmlFor="time" className="text-sm font-medium text-gray-700">Start Time</label>
              <input
                name="startTime"
                id="start_time"
                type="time"
                value={formData.startTime}
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                onChange={handleInputChange}
              ></input>
            </div>

            <div id="time_input" className="md:col-span-2">
              <label htmlFor="time" className="text-sm font-medium text-gray-700">End Time</label>
              <input
                name="endTime"
                id="end_time"
                type="time"
                value={formData.endTime}
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                onChange={handleInputChange}
              ></input>
            </div>

            <div id="location_field" className="md:col-span-2">
              <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
              <input
                id="location_input"
                name="location"
                type="text"
                value={formData.location}
                className="mt-1 w-full rounded-md border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="eg, 3000"
                onChange={handleInputChange}
              ></input>
            </div>

            <div id="shift_notes" className="md:col-span-2">
              <label htmlFor="shift_notes" className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                id="shift_notes"
                value={formData.notes ?? ""} // Need this because the notes field is typed as string || null
                className="w-full rounded-md border text-sm border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Optional shift notes.."
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
          <div>
            {inputFieldErrors ? <p className="text-sm text-red-600 inline-flex items-center">Missing required fields</p> : null}
          </div>

          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-medium text-white hover:bg-indigo-500 float-right mt-1"
            onClick={() => {
              console.log(formData);
              postNewShift();
            }}
          >Submit
          </button>
        </form>

        {/* Form fields: carer, client, date, start_time, end_time, shift_location(postcode), shift_status, shift_notes */}


      </div>
    </div>
  );
}
