import { Client } from '../types/client'
import { Carer } from '../types/carer'
import { shiftInput, Shift } from '../types/shift';
import pool from '../db';
import { start } from 'repl';

type dbRowCarer = {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  phone: string | null;
}

type dbRowClient = {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  phone: string | null;
}

function dbRowToCarer(row: dbRowCarer): Carer {
  return {
    id: row.id,
    givenName: row.given_name,
    familyName: row.family_name,
    email: row.email,
    phone: row.phone || ''
  }
}

function dbRowToClient(row: dbRowClient): Client {
  return {
    id: row.id,
    givenName: row.given_name,
    familyName: row.family_name,
    email: row.email,
    phone: row.phone || ''
  }
}

export async function listCarers(): Promise<Carer[]> {
  const queryResult = await pool.query("SELECT id, given_name, family_name, email, phone FROM carers")
  const carers: Carer[] = queryResult.rows.map(dbRowToCarer);
  return carers;
}

export async function listClients(): Promise<Client[]> {
  const queryResult = await pool.query("SELECT id, given_name, family_name, email, phone FROM clients")
  const clients: Client[] = queryResult.rows.map(dbRowToClient)
  return clients;
}

export async function createShift(rawData: shiftInput): Promise<void> {
  console.log(rawData)

  const clientID = parseInt(rawData.clientID)
  if (isNaN(clientID)) throw new Error("ClientID is not a valid number")
  const carerID = parseInt(rawData.carerID)
  if (isNaN(carerID)) throw new Error("CarerID is not a valid number")
  const date = new Date(rawData.date)
  if (isNaN(date.getTime())) throw new Error("Date is invalid")
  const startTime = new Date(`${rawData.date}T${rawData.startTime}`)
  if (isNaN(startTime.getTime())) throw new Error("StartTime is invalid")
  const endTime = new Date(`${rawData.date}T${rawData.endTime}`)
  if (isNaN(endTime.getTime())) throw new Error("EndTime is invalid")
  const location = parseInt(rawData.location)
  if (isNaN(location)) throw new Error("Location is invalid")
  const notes = rawData.notes?.trim() || null

  const shift: Shift = { clientID, carerID, date, startTime, endTime, location, notes }
  await insertShift(shift)
  console.log(clientID)
  console.log(date)
  console.log(startTime + " " + endTime)

  // Sanitise and INSERT here. 
}

async function insertShift(shift: Shift): Promise<void> {
  await pool.query(
    `INSERT INTO shifts (client_id, carer_id, shift_date, shift_start, shift_end, shift_location_postcode, shift_notes)
    VALUES($1, $2, $3, $4, $5, $6, $7)`,
    [shift.clientID, shift.carerID, shift.date, shift.startTime, shift.endTime, shift.location, shift.notes]
  )
}
