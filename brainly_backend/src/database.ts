import mysql from 'mysql2/promise'
import * as dotenv from 'dotenv';
dotenv.config();
const pool = mysql.createPool({
    host: process.env.DB_HOST_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'brainly',
    port: 10690,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool