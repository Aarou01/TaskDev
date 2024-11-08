import express from 'express'
import {select_query, delete_query, insert_into_query} from './db/DataBase Administrator.js'
import { authenticator } from 'otplib'
import { v4, validate } from "uuid"
import bcrypt from 'bcrypt'
import { SATL_ROUNDS } from './data.js'
import { validate_register } from './Validations.js'
import color from 'colors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from './data.js'

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    const token = req.cookies.access_token

    req.session = { user: null }

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY)
        req.session.user = data
    } catch {}
    next()
})


app.get('/', (req, res) => {
    // res.render('index')
    // const token = req.cookies.access_token
    // if (!token) return res.redirect('/register')
    res.redirect('/register')
})


app.get('/login', (req, res) => {
    res.render('page_login')

})

app.post('/login', async (req, res) => {

    // const { user } = req.session
    // if (user) {return res.render('home', user)}

    const { email, password } = req.body

    var stored_password = await select_query('user', 'password', `email = '${email}'`)

    try {
        var isValid = await bcrypt.compare(password, stored_password[0].password)
        if (!isValid) {res.status(401).send('Invalid password'); return}
    } catch {
        res.status(404)
        return
    }

    // const token = jwt.sign({ id: user.id, username: user.username}, SECRET_JWT_KEY, {expiresIn: '1h'})
    // res.cookie('access_token', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV != 'production',
    //     sameSite: 'strict',
    //     maxAge: 60 * 60 * 1000
    // }).send({user, token})

    res.status(200)
    res.redirect('/home')
})

app.get('/register', (req, res) => {
    res.render('page_register')
})

app.post('/register', async (req, res) => {
    const { name, email, password, repeat_password } = req.body

    // console.log(name, email, password, repeat_password)

    if (password !== repeat_password) {
        res.status(400).send('Passwords do not match')
        return
    }

    var IsValid = await validate_register(name, email, password)

    if (IsValid === true) {
        console.log("Generando usuario".bgYellow)
        let hashedPassword = await bcrypt.hash(password, SATL_ROUNDS)
        const hash = v4()
        
        await insert_into_query('user', 'name, email, password, hash', `'${name}', '${email}', '${hashedPassword}', '${hash}'`)
        res.status(201)
        res.redirect('/home')
    } else {
        console.log('Error:', IsValid)
        res.status(400).send(`${IsValid}`)
        return
        // Añadir una notificación más estética
    }

    
})

app.get('/home', (req, res) => {
    res.send('<h1>Home Page</h1>')
})




// app.get('/protected', (req, res) => {
//     const { user } = req.session
//     if (!user) {return res.status(403).res.send("Not authorized")}
//     res.render('protected', user)
// })


app.post('/logout', (req, res) => {
    res.clearCookie('access_token')
    .render('login')
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})





// 2fA google authenticator

// const secret = authenticator.generateSecret()
// console.log('Secreto:', secret)

// // Generar un código TOTP
// const token = authenticator.generate(secret)
// console.log('Código TOTP:', token)

// // Verificar el código TOTP
// const isValid = authenticator.check(token, secret)
// console.log('Código válido:', isValid)

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
