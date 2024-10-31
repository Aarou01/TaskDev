import mysql from 'mysql2/promise'
import { HOST, USER, PASSWORD, DATABASE } from './data.js'


async function create_connection() {
    const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE
    });
    
    console.log('Conectado como ID ' + connection.threadId)
    return connection
}



async function try_query(query) {
    try {
        var connection = await create_connection()
        const [results] = await connection.query(query)
        return results
    } catch (err) {
        console.log('An error has ocurried in try_query function: ', err)
        throw err
    } finally {
        await connection.end()
    }
}


async function select_query(table, columns, condition) {
    let query;
    if (!condition) {
        query = `SELECT ${columns} FROM ${table};`;
    } else {
        query = `SELECT ${columns} FROM ${table} WHERE ${condition};`;
    }
    return try_query(query)
}

async function delete_query(table, condition) {
    if (!condition) {
        console.log('It has to be a condition to deletion.')
        return
    }
    let query = `DELETE FROM ${table} WHERE ${condition};`
    return try_query(query)
}

async function insert_into_query(table, columns, data) {
    // console.log("Columns: " + columns)
    // console.log("Data: " + data)
    const query = `INSERT INTO ${table} (${columns}) VALUES (${data});`;
    return try_query(query);
}

export { select_query, delete_query, insert_into_query }




// Some examples

"Examples of SELECT"
// console.log(await select_query('city', '*'))
// console.log(await select_query('city', '*', 'id= 72'))

"Example of DELETE"
// console.log(await delete_query('city', 'ID = 72'))

"Example of INSERT"
let data = {
    ID: 72,
    Name: 'Rosario',
    CountryCode: 'ARG',
    District: 'Santa Fé',
    Population: 907718
}
// console.log(await insert_into_query('city', Object.keys(data), `${data.ID}, '${data.Name}', '${data.CountryCode}', '${data.District}', ${data.Population}`))



