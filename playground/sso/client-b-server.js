import express from 'express'
import fs from "node:fs";

const app = express()

app.get('/', (req, res) => {
    const html = fs.readFileSync(`./clientB.html`, 'utf-8')
    res.send(html)
})

app.listen(3002, () => {
    console.log('http://localhost:3002')
})
