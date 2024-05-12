const express = require("express");
const session = require("express-session");
const mongoose = require('mongoose')
const server = require('./routes/oauth2')
const passport = require('passport')
const login = require('connect-ensure-login')
const request = require("request-promise");
const User = require('./models/user.model')

try {
    mongoose.connect('mongodb://localhost:27017/passport-oauth-tutorials')
    console.log('MongoDB connected')
} catch (e) {
    console.log(e)
}

const app = express();
app.use(express.json())
// oauth2orize需要用到session。只有这样才能完成认证过程。首先安装session依赖包express-session。
app.use(session({secret: "your_secret_here", saveUninitialized: true, resave: false}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport-auth');

app.post('/user/create', (req, res) => {
    if (!req.body) {
        res.status(400).send('Request body is missing');
        return;
    }

    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    const promise = user.save()

    promise.then(function (u) {
        res.json({message: 'done', data: u});
    }).catch(function (err) {
        res.json({message: 'error', data: err});
    });
})
app.get('/login', (req, res) => {

})
app.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req);
    res.json({code: 0, message: 'done', data: req.user});
})
app.get('/auth/authorize',
    login.ensureLoggedIn(),
    server.authorize(function (clientID, redirectURI, done) {
        Clients.findOne(clientID, function (err, client) {
            if (err) {
                return done(err);
            }
            if (!client) {
                return done(null, false);
            }
            if (client.redirectUri != redirectURI) {
                return done(null, false);
            }
            return done(null, client, client.redirectURI);
        });
    }),
    function (req, res) {
        res.render('dialog', {
            transactionID: req.oauth2.transactionID,
            user: req.user, client: req.oauth2.client
        });
    }
);

// app.post('/token',
//     passport.authenticate(['basic', 'oauth2-client-password'], {session: false}),
//     server.token(),
//     server.errorHandler()
// );

app.listen(3001, () => {
    console.log("Server listening on http://localhost:3001");
});