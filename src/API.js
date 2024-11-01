import express from 'express'
import { generate, verify, save_secret } from './Authenticator QR.js'
import {select_query, delete_query, insert_into_query} from './db/DataBase Administrator.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())


app.get('/qr', async (req, res) => {
    QRcode, secret = await generate()
    res.send(`<img src= ${QRcode}></img>`)
})

app.get('/ver', async (req, res) => {
    tocken = req.body
    let user_id = await select_query('users', 'id', `username = lucas`)
    res.send(`<img src= ${QRcode}></img>`)
})

app.get('/', (req, res) => {
    QRcode, secret = generate()
    res.send(`<img src= ${QRcode}></img>`)
})


app.post('/', (req, res) => {
    res.send('Hello, World!')
})


app.put('/', (req, res) => {
    res.send('Hello, World!')
})


app.delete('/', (req, res) => {
    res.send('Hello, World!')
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
