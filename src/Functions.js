import { select_query } from './DataBase Administrator.js'
import validator from 'validator'
import color from 'colors'
import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY } from './data.js'

export async function validate_register(name, email, password) {

    if (name.length < 6) return 'The Name must be at least 6 characters'
    if (password.length < 8) return 'The password must be at least 8 characters'
    if (!validator.isEmail(email)) return 'Email invalid'

    var user = await select_query('user', 'id', `email = '${email}'`)
    if (user[0]) return 'The Email already exists'
    
    user = await select_query('user', 'id', `name = '${name}'`)

    if (user[0]) return 'The Name already exists'

    return true
}


export function create_JWT(user, expires) {
    const token = jwt.sign(user, SECRET_JWT_KEY, {expiresIn: `${expires}`})
    return token
}
