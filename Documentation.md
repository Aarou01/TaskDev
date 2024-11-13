## Inicio
Crea un archivo llamado "data.js" dentro de la carpeta "/src" y coloca la siguiente información:
    import crypto from 'crypto'

    export const HOST = ''
    export const USER = ''
    export const PASSWORD = ''
    export const DATABASE = ''
    export const SATL_ROUNDS = 0
    export const SECRET_JWT_KEY = crypto.randomBytes(32).toString('hex')

## validate_register
Una función asíncrona que toma como argumentos:
- Name
- Email
- Password
Y los evalúa de acuerdo a ciertos criterios, como el largo, con RE, o si se encuentran en la base de datos.
En caso de pasar todos los filtros retorna true.

Ejemplo:
try {
    validate_register(name, email, password)
} catch (err) {
    console.log(err)
    return
}

## DataBase Administrator:

### select_query
Una función asíncrona que retorna el valor de la query.
Recibe como argumentos:
- Tabla
- Columna/s
- (Opcional) Condición

Ejemplos:
- console.log(await select_query('city', '*'))
- console.log(await select_query('city', '*', 'id= 72'))

### delete_query
Una función asíncrona que retorna el resultado de la query.
Recibe como argumentos:
- Tabla
- Condición

Ejemplo:
- console.log(await delete_query('city', 'ID = 72'))

### insert_query
Una función asíncrona que retorna el resultado de la query
Recibe como argumentos:
- Tabla
- Columna/s
- Información

Tener en cuenta que si el campo de la información es string hay que colocarle comillas manualmente.

Ejemplo con JSON:

let data = {
    ID: 72,
    Name: 'Rosario',
    CountryCode: 'ARG',
    District: 'Santa Fé',
    Population: 907718
}
- console.log(await insert_into_query('city', Object.keys(data), `${data.ID}, '${data.Name}', '${data.CountryCode}', '${data.District}', ${data.Population}`))


Ejemplo sin JSON:
- console.log(await insert_into_query('city', 'id, name, countrycode, district, population', `${ID}, '${Name}', '${CountryCode}', '${District}', ${Population}`))

### update_query
Una función asíncrona que actualiza el valor de un registro
Recibe como argumentos:
- Tabla
- Columna
- Información
- Condición

Ejemplo:
await update_query('user', 'name', `'${new_name}'`, `name = '${old_name}'`)