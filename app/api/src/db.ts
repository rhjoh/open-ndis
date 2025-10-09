import { Pool } from "pg";
import { config } from "dotenv";
import path from 'path'
config({ path: path.resolve(__dirname, '../.env-docker-postgres') })

// Convert env var string to number 
const port = process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: port,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
})

export default pool;