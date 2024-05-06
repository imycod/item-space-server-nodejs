require("dotenv").config();

const express = require("express");
const session = require("express-session");
const request = require("request-promise");

const app = express();

app.use(
  session({
    secret: "your_secret_here",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", (req, res) => {
  const authEndpoint = "http://127.0.0.1:3001/dialog/authorize";

  console.log("process.env.CLIENT_ID---", process.env.CLIENT_ID);
  console.log("process.env.REDIRECT_URI---", process.env.REDIRECT_URI);

  const queryParams = new URLSearchParams({
    response_type: "code",
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
  });
  
  console.log("queryParams---", queryParams);
  
  const authUrl = `${authEndpoint}?${queryParams}`;

  console.log("authUrl---", authUrl);

  res.redirect(authUrl);
});

// 在这里，我们定义了两个路由：“/login”和“/callback”。 `/login` 使用必要的查询参数将用户重定向到 OAuth2 提供者的授权端点，包括 `response_type`、`client_id` 和 `redirect_uri`。
// 用户授予访问权限后，OAuth2 提供商会将用户重定向回指定的“redirect_uri”。
//`/callback` 是 OAuth2 提供者在授权过程完成后重定向用户的端点。
app.get("/callback", async (req, res) => {
  const tokenEndpoint = "http://127.0.0.1:3001/oauth/token";

  const { code } = req.query;

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

    req.session.accessToken = response.access_token;
    req.session.refreshToken = response.refresh_token;

    res.redirect("/user");
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
