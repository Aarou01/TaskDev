import express from "express"
import bodyParser from "body-parser"
import { authenticator } from "otplib"
import {insert_into_query} from "../db/DataBase Administrator"

const app = express()
app.use(bodyParser.json())

const secret = authenticator.generateSecret()
insert_into_query('sercret_saver', 'secret, user_id', `${secret}, ${user_id}`)

    app.post("/verify-token", (req, res) => {
    const { token } = req.body;
    const isValid = authenticator.verify({ token, secret })
    
    if (isValid) {
        res.json({ success: true })
    } else {
        res.json({ success: false })
    }
    })

app.listen(3000, () => console.log("Server running on port 3000"))
