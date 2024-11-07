import { select_query } from './db/DataBase Administrator.js'
import validator from 'validator'
import color from 'colors'

export async function validate_register(name, email, password) {

    if (name.length < 6) return new Error('The Name must be at least 6 characters'.red)
    if (password.length < 8) return new Error('The password must be at least 8 characters'.red)
    if (!validator.isEmail(email)) return new Error('Email invalid'.red)

    var user = await select_query('user', 'id', `email = '${email}'`)
    if (user[0]) return new Error('The Email already exists'.red)
    
    user = await select_query('user', 'id', `name = '${name}'`)

    if (user[0]) return new Error('The Name already exists'.red)

    return true
}