import express from 'express';
import jwt from 'jsonwebtoken';
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cors())

const SECRET_KEY = 'secretKey';
const REFRESH_SECRET_KEY = 'refreshSecretKey';
app.post('/token/login', (req, res) => {
	const {username} = req.body;
	if (!username) {
		return res.status(400).send('Username is required');
	}

	const token = jwt.sign({username}, SECRET_KEY, {expiresIn: '3s'});
	const refreshToken = jwt.sign({username}, REFRESH_SECRET_KEY, {expiresIn: '7d'});

	res.setHeader('Authorization', `Bearer ${token}`);
	res.setHeader('X-Refresh-Token', refreshToken);
	res.send({
		code: 0,
	});
});

app.get('/token/protection', (req, res) => {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).send('Token is required');
	}

	try {
		const payload = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
		res.send({
			code: 0,
			payload,
		});
	} catch (e) {
		// res.status(401).send('Invalid token');
		res.send({
			code:401,
			message:'Invalid token'
		})
	}
})

app.get('/token/refresh', (req, res) => {
	// 用长token换短token
	const refreshToken = req.headers['authorization'];
	if (!refreshToken) {
		return res.status(401).send('Refresh token is required');
	}
	try {
		console.log(refreshToken);
		const payload = jwt.verify(refreshToken.replace('Bearer ', ''), REFRESH_SECRET_KEY);
		const newToken = jwt.sign({ username: payload.username }, SECRET_KEY, { expiresIn: '3s' });

		res.setHeader('Authorization', `Bearer ${newToken}`);
		res.send({
			code: 0,
		});
	} catch (e) {
		// res.status(401).send('Invalid refresh token');
		res.send({
			code:401,
			message:'Invalid refresh token'
		})
	}
})
app.listen(3001, () => {
	console.log('Server is running on http://localhost:3001');
});