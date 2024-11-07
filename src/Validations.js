import { select_query } from './db/DataBase Administrator.js'
import validator from 'validator'
import color from 'colors'

export async function validate_register(name, email, password) {

    if (name.length < 6) {console.log('The Name must be at least 6 characters'.red); return false}
    if (password.length < 8) {console.log('The password must be at least 8 characters'.red); return false}
    if (!validator.isEmail(email)) {console.log('Email invalid'.red); return false}

    var user = await select_query('user', 'id', `email = '${email}'`)
    if (user[0]) {
        console.log('The Email already exists'.red)
        return false
    }
    
    user = await select_query('user', 'id', `name = '${name}'`)
    console.log(user)
    console.log(user[0])
    if (user[0]) {
        console.log('The Name already exists'.red)
        return false
    }

    return true
}