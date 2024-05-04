// create Router instance
import {Router} from 'express';
import passport from "passport";

const router = Router();

// auth/login
router.get('/login', (req, res) => {
    res.render('login', {user: req.user})
})

// auth/logout
router.get('/logout', (req, res, next) => {
    // handle with passport
    // @ts-ignore
    req.logout(function (err) {
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

export default router;