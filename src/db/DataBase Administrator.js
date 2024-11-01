import mysql from 'mysql2/promise'
import { HOST, USER, PASSWORD, DATABASE } from './data.js'
import color from 'colors'


async function create_connection() {
    const connection = await mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE
    });
    
    console.log('Conectado como ID '.green + connection.threadId)
    return connection
}


async function try_query(query) {
    try {
        var connection = await create_connection()
        const [results] = await connection.query(query)
        return results
    } catch (err) {
        console.log('An error has ocurried in try_query function: '.red, err)
        throw err
    } finally {
        await connection.end()
    }
}


async function select_query(table, columns, condition) {
    let query
    if (!condition) {
        query = `SELECT ${columns} FROM ${table};`
    } else {
        query = `SELECT ${columns} FROM ${table} WHERE ${condition};`
    }
    return try_query(query)
}

async function delete_query(table, condition) {
    if (!condition) {
        console.log('It has to be a condition to deletion.'.red)
        return
    }
    let query = `DELETE FROM ${table} WHERE ${condition};`
    return try_query(query)
}

async function insert_into_query(table, columns, data) {
    const query = `INSERT INTO ${table} (${columns}) VALUES (${data});`
    return try_query(query)
}

export { select_query, delete_query, insert_into_query }
