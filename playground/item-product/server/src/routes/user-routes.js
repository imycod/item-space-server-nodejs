import {Router} from "express"
import clientConfig from "../config/clients.js"
const router = Router()

router.get('/status', (req, res) => {
    console.log(req.session)
    console.log('status---->',req.headers['client_id'])
    const client_id= req.headers['client_id']
    if (req.session && req.session.passport && req.session.passport.user) {
        res.send({loggedIn: true, user: req.session.user, session: req.session});
    } else {
        // 用户未登录，返回206状态码和重定向的URL
        res.status(206)
        res.setHeader('location', `http://localhost:3001/dialog/authorize?response_type=code&client_id=${clientConfig[client_id].client_id}&redirect_uri=${clientConfig[client_id].redirect_uri}`)

        res.end()
    }
});

export default router