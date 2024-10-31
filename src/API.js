import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

import {select_query} from './db/DataBase Administrator.js';

select_query('*', 'world')

app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.post('/', (req, res) => {
    res.send('Hello, World!');
});


app.put('/', (req, res) => {
    res.send('Hello, World!');
});


app.delete('/', (req, res) => {
    res.send('Hello, World!');
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
