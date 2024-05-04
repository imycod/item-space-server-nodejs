import express from "express";
import cors from "cors";
import passport from "passport"
import passportOauth from "passport-oauth"
import path from "path"
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import axios from "axios";
import session from "express-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
//
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())
app.use(passport.session());
// app.use(validateTokenMiddleware);

passport.serializeUser(function (user, done) {
    console.log('serializeUser----', user)
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    var user = obj;
    console.log('deserializeUser---', obj)
    done(null, user);
});

const User = {
    db: [],
    findOrCreate: function (profile, done) {
        const user = this.db.find(user => user.user_id === profile.user_id)
        if (!user) {
            this.db.push(profile)
            return done(null, this.db[0])
        }
        return done(null, user)
    }
}

const OAuth2Strategy = passportOauth.OAuth2Strategy
const InternalOAuthError = passportOauth.InternalOAuthError
const shipStrategy = new OAuth2Strategy({
    authorizationURL: 'http://localhost:3000/dialog/authorize',
    tokenURL: 'http://localhost:3000/oauth/token',
    callbackURL: 'http://localhost:3002/oauth/callback',
    clientID: 'abc123',
    clientSecret: 'ssh-secret'
}, function (accessToken, refreshToken, profile, done) {
    console.log('OAuth2Strategy----->', {accessToken, refreshToken})
    console.log('OAuth2Strategy:profile----->', profile)
    console.log('User---', User)
    User.findOrCreate({profile: profile}, function (err, user) {
        user.accessToken = accessToken;
        return done(err, user);
    });
    console.log('User---', User)
})
shipStrategy.userProfile = function (accessToken, done) {
    console.log('accessToken--', accessToken)
    this._oauth2.get(
        'http://localhost:3000/api/userinfo'
        , accessToken
        , function (err, body/*, res*/) {
            let json, profile;

            if (err) {
                return done(new InternalOAuthError('failed to fetch user profile', err));
            }

            if ('string' === typeof body) {
                try {
                    json = JSON.parse(body);
                } catch (e) {
                    done(e);
                    return;
                }
            } else if ('object' === typeof body) {
                json = body;
            }
            console.log('json---', json)
            profile = {
                id: json.user_id
            };
            profile._raw = body;
            profile._json = json;

            done(null, profile);
        }
    );
}

passport.use(shipStrategy)

app.get('/', passport.authenticate('oauth2', {
    successRedirect: 'http://localhost:5173/#/',
    failureRedirect: '/close.html?error=bar'
}))
app.get('/oauth/callback', passport.authenticate('oauth2', {
    successRedirect: 'http://localhost:5173/#/',
    failureRedirect: '/close.html?error=bar'
}))

// 假设这是你的认证服务器的URL和验证token的端点
const authServerUrl = 'http://localhost:3000';
const validateTokenEndpoint = '/validate_token';

// 这是一个函数，用于验证传入的token
async function validateToken(token) {
    try {
        // 向认证服务器发送请求，验证token
        const response = await axios.get(`${authServerUrl}${validateTokenEndpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // 如果认证服务器返回了200状态码，那么token是有效的
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        // 如果发生错误（例如，认证服务器返回了非200状态码），那么token是无效的
        console.error(error);
    }

    return false;
}

// 这是一个Express中间件，用于验证传入请求的token
async function validateTokenMiddleware(req, res, next) {
    const token = req.headers.authorization;

    // 验证token
    const isValid = await validateToken(token);

    if (isValid) {
        // 如果token有效，继续处理请求
        next();
    } else {
        // 如果token无效，返回401状态码
        res.status(401).send('Invalid token');
    }
}

app.post('/login', (req, res) => {
    console.log(req.username);
    const url = 'http://localhost:3000/login'
    res.statusCode = 206;
    res.setHeader('Location', url);
    res.end();
})

app.listen(3002, () => {
    console.log('http://localhost:3002')
})