import { Client } from '../types/client'
import { Carer } from '../types/carer'
import { ShiftInsert, Shift } from '../types/shift';
import pool from '../db';

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

type dbRowShift = {
  id: number;
  client_id: number;
  carer_id: number;
  shift_date: Date;
  shift_start: Date;
  shift_end: Date;
  shift_location_postcode: number;
  shift_status: string;
  shift_notes: string;


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

function dbRowToShift(row: dbRowShift): Shift {
  return {
    shiftID: row.id,
    clientID: row.client_id,
    carerID: row.carer_id,
    date: row.shift_date.toISOString().split('T')[0], // TODO: Understand timezone conversion causing date value to subtract 10 when parsed on frontend
    startTime: row.shift_start,
    endTime: row.shift_end,
    location: row.shift_location_postcode,
    status: row.shift_status,
    notes: row.shift_notes
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

export async function getAllShifts(): Promise<Shift[]> {
  const queryResult = await pool.query("SELECT id, client_id, carer_id, shift_date, shift_start, shift_end, shift_location_postcode, shift_status, shift_notes FROM shifts")
  const allShifts: Shift[] = queryResult.rows.map(dbRowToShift)
  return allShifts;
}

export async function createShift(rawData: ShiftInsert): Promise<void> {
  const clientID = rawData.clientID
  const carerID = rawData.carerID
  const date = rawData.date
  const startTime = rawData.startTime
  const endTime = rawData.endTime
  const location = rawData.location
  const notes = rawData.notes
  const status = rawData.status
  const shift: ShiftInsert = { clientID, carerID, date, startTime, endTime, status, location, notes }
  await insertShift(shift)
}

async function insertShift(shift: ShiftInsert): Promise<void> {
  await pool.query(
    `INSERT INTO shifts (client_id, carer_id, shift_date, shift_start, shift_end, shift_status, shift_location_postcode, shift_notes)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
    [shift.clientID, shift.carerID, shift.date, shift.startTime, shift.endTime, shift.status, shift.location, shift.notes]
  )
}
