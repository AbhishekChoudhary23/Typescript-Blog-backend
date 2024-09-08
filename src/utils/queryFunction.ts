import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// -----------------------------    Connecting with Database     -----------------------------
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

// -----------------------------    Query Function     -----------------------------
const queryFn = (sql: string, params: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err: any, results: any) => {
            if (err) {
                return reject(err); // Reject the promise with the error
            }
            resolve(results); // Resolve the promise with the results
        });
    });
};

export default queryFn; // Use ES module export