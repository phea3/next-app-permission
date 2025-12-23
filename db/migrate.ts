import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import connect from "./index";

async function main() {
  await mysql
    .createConnection({
      port: 3306,
      host: process.env.DB_HOST || "",
      user: process.env.DB_USER || "",
      password: process.env.DB_PASSWORD || "",
    })
    .then(async (conn) => {
      await conn.execute(
        `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
      );
      conn.end();
    });
  // connection
  const { db, connection } = await connect();
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: "./drizzle" });
  // Don't forget to close the connection, otherwise the script will hang
  await connection.end();
}

main();
