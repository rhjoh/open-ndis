/* This file to be used for scheduling / shift related services(controller functions) */
import { Carer } from '../types/carer';
import { Client } from '../types/client';
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

function dbRowToCarer(row: dbRowCarer):  Carer {
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