import mysql from "mysql2/promise";

const executeQuery = async (query, data) => {
    let db;
    try {
        db = await mysql.createConnection({
            host: "localhost",
            database: "ez",
            user: "root",
            password: "",
        });

        const [result] = await db.execute(query, data);
        return result;
    } catch (error) {
        console.error("Database query error:", error);
        return null;
    } finally {
        if (db) {
            await db.end();
        }
    }
};

export default executeQuery;
