import mysql from '../node_modules/mysql2/index.js'
import {HOST, USER, PASSWORD, DATABASE} from './data.js'

const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
});


connection.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado como ID ' + connection.threadId);
});


function try_query(query) {
    try {
        connection.query(query);
    } catch (err) {
        console.log(err);
        return;
    }
}


function insert_into_query(table, columns, data) {
    const query = `INSERT INTO ${table} (${columns}) VALUES (${data});`;
    try_query(query);
}


function select_query(columns, table) {
    let query
    if (columns == '*'){
        query = `SELECT * FROM ${table};`;
    } else {
        query = `SELECT ${columns} FROM ${table};`;
    }
    try_query(query);
}

function delete_query(condition, table) {
    const query = `DROP FROM ${table} WHERE ${condicion};`;
    if (!condition){
        console.log('No se ha especificado la condición para la eliminación.');
        return;
    }
    try_query(query);
}

export {select_query, delete_query, insert_into_query}

select_query('world', '*')


