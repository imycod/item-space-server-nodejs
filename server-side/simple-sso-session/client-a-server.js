import express from 'express'
import fs from "node:fs";

const app = express()

app.get('/', (req, res) => {
    const html = fs.readFileSync(`./clientA.html`, 'utf-8')
    res.send(html)
})

app.listen(3001, () => {
    console.log('http://localhost:3001')
})
