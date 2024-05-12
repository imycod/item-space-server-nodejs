require("dotenv").config();

const express = require("express");
const request = require("request-promise");
const passport = require("passport");
const passportOauth = require("passport-oauth");

const app = express();

console.log(process.env.CLIENT_ID)
console.log(process.env.CLIENT_SECRET)
console.log(process.env.REDIRECT_URI)

const clients = {
    'item_di': {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
    }
}

const OAuth2Strategy = passportOauth.OAuth2Strategy;
const itemStrategy = new OAuth2Strategy(
    {
        authorizationURL: "http://localhost:3001/auth/authorize",
        tokenURL: "http://localhost:3001/token",
        callbackURL: clients["item_di"].redirect_uri,
        clientID: clients["item_di"].client_id,
        clientSecret: clients["item_di"].client_secret,
    },
    function (accessToken, refreshToken, profile, done) {
        console.log({accessToken, refreshToken, profile})
    }
)

passport.use(itemStrategy)


app.post("/login", (req, res) => {
    // 这个是前端登录页面部署的地址，如果是服务端直接重定向到这个地址res.redirect，如果是分开部署的前端，需要重定向到前端地址
    const authEndpoint = "http://127.0.0.1:5132/login";

    const client = clients[req.headers.client_id]
    console.log(client)
    const queryParams = new URLSearchParams({
        response_type: "code",
        client_id: req.headers.client_id,
        redirect_uri: client.redirect_uri,
    });

    const authUrl = `${authEndpoint}?${queryParams}`;

    res.status(206);
    res.setHeader("location", authUrl);
    res.end();
});

// 在这里，我们定义了两个路由：“/login”和“/callback”。 `/login` 使用必要的查询参数将用户重定向到 OAuth2 提供者的授权端点，包括 `response_type`、`client_id` 和 `redirect_uri`。
// 用户授予访问权限后，OAuth2 提供商会将用户重定向回指定的“redirect_uri”。
//`/callback` 是 OAuth2 提供者在授权过程完成后重定向用户的端点。
app.get("/callback", async (req, res) => {
    const tokenEndpoint = "http://127.0.0.1:3001/oauth/token";
    const {code} = req.query;

    const requestBody = {
        grant_type: "authorization_code",
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
    };

    const options = {
        method: "POST",
        uri: tokenEndpoint,
        form: requestBody,
        json: true,
    };

    try {
        const response = await request(options);
        console.log('response----', response)
        const token = response.access_token
        const refreshToken = response.refresh_token

        req.session.accessToken = token;
        req.session.refreshToken = refreshToken;

        res.cookie("token", token, {httpOnly: true});
        res.cookie("refreshToken", refreshToken, {httpOnly: true});

        // res.redirect("/user");
        // res.status(302)
        // res.setHeader("location", "http://127.0.0.1:5134/");
        // res.end();
        res.redirect(`http://127.0.0.1:5134/?token=${token}`)
    } catch (err) {
        res.send("Error retrieving access token");
    }
});

app.get("/user", async (req, res) => {
    const userEndpoint = "http://127.0.0.1:3001/api/userinfo";

    const options = {
        headers: {
            Authorization: `Bearer ${req.session.accessToken}`,
        },
        json: true,
    };

    try {
        const response = await request.get(userEndpoint, options);
        res.send(response);
    } catch (err) {
        res.send("Error retrieving user info");
    }
});

app.listen(3000, () => {
    console.log("Server listening on http://localhost:3000");
});

/// https://blog.bitsrc.io/step-by-step-guide-to-implementing-oauth2-in-a-node-js-application-89c7e8d202bd
