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


const clients = {
	'item_di': {
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		redirect_uri: process.env.REDIRECT_URI,
	}
}

app.get('/login', (req, res) => {
	const loginPageUrl = "http://127.0.0.1:5132/login";
	const client = clients[req.headers.client_id]
	const queryParams = new URLSearchParams({
		response_type: "code",
		client_id: req.headers.client_id,
		redirect_uri: client.redirect_uri,
	});
	const redirectUrl = `${loginPageUrl}?${queryParams}`;
	res.status(206);
	res.setHeader("location", redirectUrl);
	res.end();
})
app.post('/auth/login', passport.authenticate('local'), (req, res) => {
	const decisionPageUrl = `http://127.0.0.1:5132/decision`
	console.log('req.headers.client_id----', req.headers.client_id)
	const client = clients[req.headers.client_id]
	const queryParams = new URLSearchParams({
		response_type: "code",
		client_id: req.headers.client_id,
		redirect_uri: client.redirect_uri,
	});

	const redirectUrl = `${decisionPageUrl}?${queryParams}`;
	res.status(206);
	res.setHeader("location", redirectUrl);
	res.end();
})
app.get('/auth/authorize',
	login.ensureLoggedIn(),
	server.authorize(function (clientID, redirectURI, done) {
		console.log('clientID---', clientID)
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