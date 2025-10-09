import { query } from "express";
import pool from "../db";
import { User, Role } from "../types/auth";

type dbRowUser = {
  id: string;
  email: string;
  role: Role;
  password_hash: string;
  password_salt: string;
}

function dbRowToUser(row: dbRowUser): User {
    return {
        id: row.id.toString(),
        email: row.email.toLocaleLowerCase(),
        role: row.role,
        passwordHash: row.password_hash,
        salt: row.password_salt,
    }
    
}

export async function findUserByEmail(email: string) {
    const queryResult = await pool.query("select * from users where email = $1 limit 1", [email.toLowerCase()])
    const result = dbRowToUser(queryResult.rows[0])
    return result;
}
