import qrcode from 'qrcode' 
import speakeasy from 'speakeasy'
import colors from 'colors'
import { select_query, delete_query, insert_into_query } from './db/DataBase Administrator.js'


function generate() {
    const secret = speakeasy.generateSecret({ length: 20 })

    qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
        if (err) return reject(new Error('A problem has occurred while generating the QR'.red))
	})
    return [dataUrl, secret]
}

async function verify(user_id, token, secret) {
    if (!user_id) {throw new Error('Usuario no encontrado'.red)}
     
    const isValid = speakeasy.totp.verify({
        secret: await select_query('secret_saver', 'secret', `id_user= ${user_id}`),
        encoding: 'base32',
        token,
    })

    if (isValid) {
        console.log('Código verificado correctamente y almacenado'.green)
		console.log(await insert_into_query('secret_saver', 'secret', secret.base32))
		return
	}
    throw new Error('Código inválido'.red)
}

async function save_secret(secret) {
	try {
		await insert_into_query('secret_saver', 'secret', secret)
	} catch(err) {console.log(`${err}`.red)}
}

export { generate, verify, save_secret }
