import express from 'express'
import fs from "node:fs";
import path from "path";
import {fileURLToPath} from "url";
import axios from "axios";

export default () => {
    const app = express()
    app.use(express.json())

    app.get('/', (req, res) => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.join(__dirname, 'central.html');
        const html = fs.readFileSync(filePath, 'utf-8')
        res.send(html)
    })

    app.post('/api/login', (req, res) => {
        const client_id = req.headers['client_id']
        console.log('client_id---', client_id)
        axios.post('http://localhost:3000/login', {
            username: req.body.username,
        }, {
            headers:{
                client_id: client_id
            }
        }).then(response => {
            res.setHeader('location',response.headers.location)
            res.status(206)
            res.end()
        }).catch(error=>{
            console.log(error)
        })
    })

    app.listen(3002, () => {
        console.log('http://localhost:3002')
    })
}