import express from 'express'
import {select_query, delete_query, insert_into_query} from './db/DataBase Administrator.js'
import { authenticator } from 'otplib'
import { v4, validate } from "uuid"
import bcrypt from 'bcrypt'
import { SATL_ROUNDS } from './data.js'
import { validate_register } from './Validation.js'
import color from 'colors'



const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    var stored_password = await select_query('user', 'password', `email = '${email}'`)

    const isValid = await bcrypt.compare(password, stored_password[0].password)
    if (!isValid){res.send(401); return}

    res.json({ success: true }, 200)
    // res.send('HOME PAGE')
})



app.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    
    if (!validate_register(name, email, password)) {
        res.status(500)
    } else {
        console.log("Generando usuario".bgYellow)
        let hashedPassword = await bcrypt.hash(password, SATL_ROUNDS)
        const hash = v4()
        
        await insert_into_query('user', 'name, email, password, hash', `'${name}', '${email}', '${hashedPassword}', '${hash}'`)
        res.status(201)

    }
    
})



// app.post('/logout', (req, res) => {cerrar cookies})


// app.get('/protected', (req, res) => {})

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

// const secret = authenticator.generateSecret()
// // console.log('Secreto:', secret)
// await insert_into_query('secret_saver', 'secret, user_id', `${secret}, ${user_id}`)


// const token = authenticator.generate(secret)
// // console.log('Código TOTP:', token)

// // Crear el URI para el código QR
// let email = await select_query('users', 'email', `id = ${user_id}`)
// const otpauth = authenticator.keyuri(email, 'TaskDev', secret)

// // Generar el código QR
// QRCode.toDataURL(otpauth, (err, imageUrl) => {
//     if (err) {
//         console.error('Error al generar el QR:', err)
//         return
//     }
//     res.send(`<img src= "${imageUrl}"></img>`)
// })

