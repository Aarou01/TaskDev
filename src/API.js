import express from 'express'
import { generate, verify, save_secret } from './Authenticator QR.js'
import {select_query, delete_query, insert_into_query} from './db/DataBase Administrator.js'
import { authenticator } from 'otplib'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())


app.get('/', (req, res) => {
    res.send(`Hello, World!`)
})

app.get('/qr', (req, res) => {
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



// const secret = authenticator.generateSecret()
// console.log('Secreto:', secret)

// // Generar un código TOTP
// const token = authenticator.generate(secret)
// console.log('Código TOTP:', token)

// // Verificar el código TOTP
// const isValid = authenticator.check(token, secret)
// console.log('Código válido:', isValid)



// Register

const secret = authenticator.generateSecret()
console.log('Secreto:', secret)
await insert_into_query('secret_saver', 'secret, user_id', `${secret}, ${user_id}`)


const token = authenticator.generate(secret)
console.log('Código TOTP:', token)

// Crear el URI para el código QR
let email = await select_query('users', 'email', `id = ${user_id}`)
const otpauth = authenticator.keyuri(email, 'TaskDev', secret)

// Generar el código QR
QRCode.toDataURL(otpauth, (err, imageUrl) => {
    if (err) {
        console.error('Error al generar el QR:', err)
        return
    }
    res.send(`<img src= "${imageUrl}"></img>`) 
})