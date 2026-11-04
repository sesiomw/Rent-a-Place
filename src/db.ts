import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");
const query = db.query(`
    CREATE TABLE IF NOT EXISTS user (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        username        TEXT NOT NULL UNIQUE,
        email           TEXT NOT NULL UNIQUE,
        password_hash   TEXT NOT NULL
    );
`);
const query2 = db.query(`
    CREATE TABLE IF NOT EXISTS imovel (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        id_user         INTEGER NOT NULL,
        rua             TEXT NOT NULL,
        numero          TEXT NOT NULL,
        complemento     TEXT,
        bairro          TEXT NOT NULL,
        cep             TEXT NOT NULL,
        cidade          TEXT NOT NULL,
        uf              TEXT NOT NULL,
        descricao       TEXT NOT NULL,
        valor_aluguel   FLOAT NOT NULL,
        valor_cond      FLOAT NOT NULL,
        valor_iptu      FLOAT NOT NULL,
        metragem        INTEGER NOT NULL,
        qnt_quartos     INTEGER NOT NULL,
        qnt_banheiros   INTEGER NOT NULL,
        qnt_garagem     INTEGER NOT NULL,
        disponivel      INTEGER DEFAULT 1,
        FOREIGN KEY (id_user) REFERENCES user (id)
    );
`);

query.run();
query2.run();
export { db }