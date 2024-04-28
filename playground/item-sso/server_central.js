import express from 'express'
import fs from "node:fs";

export default () => {
    const app = express()

    app.get('/', (req, res) => {
        const html = fs.readFileSync(`./central.html`, 'utf-8')
        res.send(html)
    })

    app.listen(3002, () => {
        console.log('http://localhost:3002')
    })
}