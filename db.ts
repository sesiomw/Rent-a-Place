import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");
const query = db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        username        TEXT NOT NULL UNIQUE,
        email           TEXT NOT NULL UNIQUE,
        password_hash   TEXT NOT NULL
    );
`);
const query2 = db.query(`
    CREATE TABLE IF NOT EXISTS imoveis (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao       TEXT NOT NULL,
        endereco        TEXT NOT NULL,
        valor           FLOAT NOT NULL,
        disponivel      INTEGER DEFAULT 1
    );
`);

query.run();
query2.run();
export { db }