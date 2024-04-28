import express from 'express'
import session from 'express-session'
import fs from "fs"
import path from "path"
import cors from 'cors'
import jwt from 'jsonwebtoken'
import {fileURLToPath} from 'url';

export default () => {
    const applicationMap = {
        // item-space branch oauth2
        'item_ship': {
            url: "http://localhost:5173",
            name: 'item ship',
            secretKey: '%Y&*VGHJKLsjkas',
            token: ""
        },
        // local server_central
        'item_central': {
            url: "http://localhost:3002",
            name: 'item central',
            secretKey: '%Y&*VGHJKLssdkls',
            token: ""
        }
    }
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use(session({
        name: 'token',
        secret: "$%^&*()_+DFGHJKL",
        cookie: {
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24 * 7, //过期时间
        }
    }))
    const genToken = (client_id) => {
        return jwt.sign({client_id}, applicationMap[client_id].secretKey)
    }

    app.get('/', (req, res) => {
        console.log('aaaaaaaaaaaaaaa')
        res.send({
            status: 200
        })
    })

    app.post('/login', (req, res) => {
        console.log('req.session---', req.session);
        //注意看逻辑 如果登陆过 就走if 没有登录过就走下面的
        if (req.session.username) {
            //登录过
            const appId = req.headers['client_id']
            const url = applicationMap[appId].url
            let token;
            //登录过如果存过token就直接取 没有存过就生成一个 因为可能有多个引用A登录过读取Token   B没有登录过生成Token 存入映射表
            if (applicationMap[appId].token) {
                token = applicationMap[appId].token
            } else {
                token = genToken(appId)
                applicationMap[appId].token = token
            }
            res.redirect(url)
            return
        }
        const clientId = req.headers['client_id']
        console.log('clientId-----', clientId)
        const redirect = applicationMap[clientId].url
        //没有登录 返回一个登录页面html
        res.setHeader('location', `http://localhost:3000/loginPage?client_id=${clientId}&redirect_url=${redirect}`)
        res.status(206)
        res.end()
        // //没有登录 返回一个登录页面html
        // const __dirname = path.dirname(fileURLToPath(import.meta.url));
        // const filePath = path.join(__dirname, 'sso.html');
        // const html = fs.readFileSync(filePath, 'utf-8')
        // //返回登录页面
        // res.send(html)
    })

    //提供protectd get接口 重定向到目标地址
    app.get('/protectd', (req, res) => {
        // const clientId = req.headers['client_id']
        // console.log('clientId----protectd',clientId)
        const {username, password, client_id: clientId} = req.query //获取应用标识
        const url = applicationMap[clientId].url //读取要跳转的地址
        console.log('url------', url)
        const token = genToken(clientId) //生成token
        req.session.username = username //存储用户名称 表示这个账号已经登录过了 下次无需登录
        applicationMap[clientId].token = token //根据应用存入对应的token
        res.redirect(url) //定向到目标页面
    })

    app.get('/loginPage', (req, res) => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.join(__dirname, 'sso.html');
        const html = fs.readFileSync(filePath, 'utf-8')
        res.send(html)
    })
    // app.post('/auth/oauth/token', (req, res) => {
    //     const clientId = req.headers['client_id']
    //     console.log('clientId-----', clientId)
    //     const redirect = applicationMap[clientId].url
    //     //没有登录 返回一个登录页面html
    //     res.setHeader('location', `http://localhost:3000/loginPage?client_id=${clientId}&redirect_url=${redirect}`)
    //     res.status(206)
    //     res.end()
    // })

    //启动3000端口 1
    app.listen(3000, () => {
        console.log('http://localhost:3000')
    })
}