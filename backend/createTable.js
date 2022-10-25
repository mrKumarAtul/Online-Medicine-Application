const { Client } = require("pg")
const dotenv = require("dotenv")
dotenv.config();


function createTableinDB() {
    console.log('called - createTableinDB');
    return new Promise((resolve, reject) => {
        const text = `CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL,
        "name" VARCHAR(40) NOT NULL,
        "email" VARCHAR(40) NOT NULL,
        "password" VARCHAR(40) NOT NULL,
        "orders" json,
        PRIMARY KEY ("id")
    );`;
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        })

        client.connect().then(async () => {
            const res = await client.query(text)
            //  console.log(res);
            resolve();
        }).catch((err) => {
            console.log(err);
            reject(err);
        }).finally(async () => {
            await client.end();

        })

    });

}

function createOrderTableinDB() {
    console.log('called - createTableinDB');
    return new Promise((resolve, reject) => {
        const text = `CREATE TABLE IF NOT EXISTS "orders" (
        "id" SERIAL,
        "email" VARCHAR(40) NOT NULL,
        "orderid" VARCHAR(40) NOT NULL,
        "productName" VARCHAR(40) NOT NULL,
        "units" VARCHAR(40) NOT NULL,
        "orderdate" VARCHAR(40) NOT NULL,
        PRIMARY KEY ("id")
    );`;
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        })

        client.connect().then(async () => {
            const res = await client.query(text)
            //  console.log(res);
            resolve();
        }).catch((err) => {
            console.log(err);
            reject(err);
        }).finally(async () => {
            await client.end();

        })

    });

}
function createMedicineTableinDB() {
    console.log('called - createTableinDB');
    return new Promise((resolve, reject) => {

        const text = `CREATE TABLE IF NOT EXISTS "medicine" (
        "id" SERIAL,
        "name" VARCHAR(40) NOT NULL,
        "manufacturer" VARCHAR(40) NOT NULL,
        "alergy" VARCHAR(40) NOT NULL,
        "benifits" VARCHAR(40) NOT NULL,
        "instock" VARCHAR(40) NOT NULL,
        "price" VARCHAR(40) NOT NULL,
        "prescribed" VARCHAR(40),
        PRIMARY KEY ("id")
    );`;
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        })

        client.connect().then(async () => {
            const res = await client.query(text)
            //  console.log(res);
            resolve();
        }).catch((err) => {
            console.log(err);
            reject(err);
        }).finally(async () => {
            await client.end();

        })

    });

}

module.exports = {
    createTableinDB, createOrderTableinDB, createMedicineTableinDB
}
