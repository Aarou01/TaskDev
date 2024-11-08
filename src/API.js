import express from 'express'
import {select_query, delete_query, insert_into_query} from './db/DataBase Administrator.js'
import { authenticator } from 'otplib'
import { v4, validate } from "uuid"
import bcrypt from 'bcrypt'
import { SATL_ROUNDS } from './data.js'
import { validate_register } from './Functions.js'
import color from 'colors'
import cookieParser from 'cookie-parser'
import { SECRET_JWT_KEY } from './data.js'
import { create_JWT } from './Functions.js'
import jwt from 'jsonwebtoken'
import QRCode from 'qrcode'

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
        // console.log("DATA " + JSON.stringify(data))
    } catch (err) {
        console.log("No token found")
    }
    next()
})


app.get('/', (req, res) => {
    const user = req.session.user
    if (user) {return res.redirect('home')}
    return res.redirect('/login')
})


app.get('/login', async(req, res) => {
    const user = req.session.user
    console.log(user)
    if (user) {return res.redirect('/home')}
    return res.render('page_login')}
)

app.post('/login', async (req, res) => {

    const { email, password } = req.body
    let query_email = await select_query('user', '*', `email = '${email}'`)
    if (!query_email) {return res.send('User Not found').status(404)}

    var stored_password = await select_query('user', 'password', `email = '${email}'`)

    try {
        var isValid = await bcrypt.compare(password, stored_password[0].password)
        if (!isValid) {res.status(401).send('Invalid password'); return}
    } catch {
        res.status(404)
        return
    }

    let result = await select_query('user', '*',  `email = '${email}'`)
    result = result[0]

    const user = {
        name: result.name,
        email: result.email,
        password: result.password,
        date: result.date_registration,
        hash: result.hash,
        level_permissions: result.level_permissions
    }

    const token = create_JWT(user, '1h')
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV != 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000
    })


    res.status(200)
    res.redirect('/home')
})

app.get('/register', (req, res) => {
    const user = req.session.user
    if (user) {return res.redirect('/home')}
    return res.render('page_register')
})

app.post('/register', async (req, res) => {
    const { name, email, password, repeat_password } = req.body

    if (password !== repeat_password) {
        res.status(400).send('Passwords do not match')
        return
    }

    var IsValid = await validate_register(name, email, password)

    if (IsValid === true) {
        console.log("Generando usuario".bgYellow)
        let hashedPassword = await bcrypt.hash(password, SATL_ROUNDS)
        
        await insert_into_query('user', 'name, email, password, hash', `'${name}', '${email}', '${hashedPassword}', '${v4()}'`)
        res.status(201)
        return res.redirect('/home')
    } else {
        console.log('Error:', IsValid)
        return res.status(400).send(`${IsValid}`)
        // Añadir una notificación más estética
    }

    
})

app.get('/home', (req, res) => {
    const user = req.session.user
    if (!user) {return res.redirect('/login')}
    res.send(`<h1>Hi ${req.session.user.name}</h1>`)
})




app.get('/admin', (req, res) => {
    const user = req.session.user
    if (!user) {return res.redirect('/login').status(404).send('User not found')}
    if (user.level_permissions != 10) {
        console.log(user.level_permissions)
        return res.redirect('/home').status(403).send("Not authorized")}
    res.render('page_admin')
})


app.get('/logout', (req, res) => {
    res.clearCookie('access_token')
    .redirect('/login')
})




app.get('/2fa', async (req, res) => {
    const secret = authenticator.generateSecret()
    console.log('Secreto:', secret)

    const otpauth = authenticator.keyuri(req.session.user.email, 'TaskDev', secret)
    
    QRCode.toDataURL(otpauth, (err, imageUrl) => {
        if (err) {
            console.error('Error al generar el QR:', err)
            return
        }
        return res.send(`<img src= "${imageUrl}"></img>`)
    })
    console.log(req.session.user.email)
    var user_hash = await select_query('user', 'hash', `email = '${req.session.user.email}'`)
    console.log(user_hash[0].hash)
    await insert_into_query('auth', 'secret, user_hash', `'${secret}', '${user_hash[0].hash}'`)
})

app.get('/2fa_auth', async (req, res) => {
    res.render('2fa_google')
})


app.post('/2fa', async (req, res) => {
    const { user_token } = req.body

    if (user_token.length != 6) {return res.send('Invalid code')}
    const user_hash = req.session.user.hash
    const secret = await select_query('auth','secret', `user_hash = '${user_hash}'`)
    
    const isValid = authenticator.check(user_token, secret)
    
    if (!isValid){return res.send('Error code')}
    res.status(200).redirect('/home')

})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

