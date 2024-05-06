import express from 'express';
import cookieSession from 'cookie-session';
import {configDotenv} from "dotenv";
import moogoose from 'mongoose';
import authRoutes from "./routes/auth-routes.js";
import profileRoutes from "./routes/profile-routes.js"
import userRoutes from "./routes/user-routes.js";
import setupPassport from "./config/passport-setup.js";
import path from 'path';
import {fileURLToPath} from 'url';
import cors from "cors"

configDotenv(); // require('dotenv').config() | dotenv.config() by default

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views')); // 执行的目录是dist，因此需要回退到src目录
app.use(express.static(path.join(__dirname, '../src/views'))); // 执行的目录是dist，因此需要回退到src目录
app.use(express.json())
app.use(cors())
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // day = hour * minute * second * millisecond
    keys: [process.env.SESSION_COOKIE_KEY],
    // httpOnly: true
}));
// initialize passport
setupPassport(app)

moogoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error)
    })

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/user',userRoutes);
app.get('/', (req, res) => {
    res.render('home', {user: req.user})
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})