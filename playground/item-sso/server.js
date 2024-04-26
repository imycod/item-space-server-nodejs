import express from 'express'
import session from 'express-session'
import fs from 'node:fs'
import cors from 'cors'
import jwt from 'jsonwebtoken'

const appToMapUrl = {
	'Rs6s2aHi': {
		url: "http://localhost:5173",
		name: 'item ship',
		secretKey: '%Y&*VGHJKLsjkas',
		token: ""
	},
	'9LQ8Y3mB': {
		url: "http://localhost:3002",
		secretKey: '%Y&*FRTYGUHJIOKL',
		name: 'clientB',
		token: ""
	},
}
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
	secret: "$%^&*()_+DFGHJKL",
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, //过期时间
	}
}))
const genToken = (appId) => {
	return jwt.sign({appId}, appToMapUrl[appId].secretKey)
}

app.get('/loginPage', (req, res) => {
	const html = fs.readFileSync(`./sso.html`, 'utf-8')
	res.send(html)
})

app.get('/login', (req, res) => {
	console.log('req.session---', req.session);
	//注意看逻辑 如果登陆过 就走if 没有登录过就走下面的
	if (req.session.username) {
		//登录过
		const appId = req.query.appId
		const url = appToMapUrl[appId].url
		let token;
		//登录过如果存过token就直接取 没有存过就生成一个 因为可能有多个引用A登录过读取Token   B没有登录过生成Token 存入映射表
		if (appToMapUrl[appId].token) {
			token = appToMapUrl[appId].token
		} else {
			token = genToken(appId)
			appToMapUrl[appId].token = token
		}
		res.redirect(url + '?token=' + token)
		return
	}
	//没有登录 返回一个登录页面html
	const html = fs.readFileSync(`./sso.html`, 'utf-8')
	//返回登录页面
	res.send(html)
})

//提供protectd get接口 重定向到目标地址
app.get('/protectd', (req, res) => {
	const {appId, username, password} = req.query //获取应用标识
	const url = appToMapUrl[appId].url //读取要跳转的地址
	const token = genToken(appId) //生成token
	req.session.username = username //存储用户名称 表示这个账号已经登录过了 下次无需登录
	appToMapUrl[appId].token = token //根据应用存入对应的token
	res.redirect(url + '?token=' + token) //定向到目标页面
})


app.post('/auth/oauth/token', (req, res) => {
	//没有登录 返回一个登录页面html
	const html = fs.readFileSync(`./sso.html`, 'utf-8')
	res.setHeader('location', 'http://localhost:3000/loginPage')
	res.status(206)
	res.end()
})

//启动3000端口 1
app.listen(3000, () => {
	console.log('http://localhost:3000')
})
