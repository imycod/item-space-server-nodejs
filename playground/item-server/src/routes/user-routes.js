import {Router} from "express"

const router = Router()

router.get('/status', (req, res) => {
    if (req.session && req.session.user) {
        res.send({loggedIn: true, user: req.session.user, session: req.session});
    } else {
        res.send({loggedIn: false});
    }
});

export default router