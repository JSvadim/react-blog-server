import mysql from 'mysql2';
const pool = mysql.createPool({
    port     : process.env.DB_PORT,
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
});

// exporting promise to work with await syntax
export default pool.promise()