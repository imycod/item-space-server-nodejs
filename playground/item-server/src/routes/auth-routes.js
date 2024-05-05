// create Router instance
import {Router} from 'express';
import passport from "passport";
import clientConfig from "../config/clients.js"

const router = Router();

// auth/login
router.get('/login', (req, res) => {
    // res.render('login', {user: req.user})
    // res.redirect('http://127.0.0.1:8080/') // 重定向到前端页面会带来跨域问题，所以不建议这样做
    // 读取views/index.html文件并返回
    res.sendFile('login-page.html', {root: 'src/views'})
})

// auth/logout
router.get('/logout', (req, res, next) => {
    // handle with passport
    // @ts-ignore
    req.logout(function (err) {
        console.log('err---', err)
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
})

// auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

// callback route for google to redirect to
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile/')
})

// auth/item
router.get('/item', passport.authenticate('item', {
    scope: ['profile']
}))
router.get('/item/callback', passport.authenticate('item'), (req, res) => {
    // res.status(206)
    // res.setHeader('location', ``)
    // res.end()
    res.status(206).send({
        message: 'auth success',
        redirect_uri: 'http://127.0.0.1:5173/'
    })
})

export default router;