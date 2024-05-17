/*
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-05-16 21:40:17
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-05-17 07:54:46
 * @FilePath: \primevue-tailwind-elementd:\code\workcode\item-space-server-nodejs\server-side\learn-oauth2\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");

const setupPassport = require("./passport-auth");

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "a4f8071f-4447-c873-8ee2",
    saveUninitialized: true,
    resave: true,
  })
);

setupPassport(app);

try {
  mongoose.connect("mongodb://localhost:27017/passport-oauth-tutorials");
  console.log("MongoDB connected");
} catch (e) {
  console.log(e);
}

const { authorization, decision, token } = require("./oauth");

// app.get(
//   "/oauth2/authorize",
//   (req, res, next) => {
//     if (!req.isAuthenticated()) {
//       return res
//         .status(401)
//         .json({ redirectUrl: "http://localhost:5132/login" });
//     }
//     next();
//   },
//   isAuthenticated,
//   decision
// );
app.get(
  "/oauth2/authorize",
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      const responseType = req.query.response_type;
      const clientId = req.query.client_id;
      const redirectUri = req.query.redirect_uri;
      console.log("1111111");
      return res.status(401).json({
        redirectUrl: `http://localhost:5132/login?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}`,
      });
    }
    next();
  },
  authorization
);

app.post(
  "/oauth2/login",
  passport.authenticate("local", { session: true }),
  (req, res) => {
    console.log("req.user---", req.user);
    res.json({ message: "Login successfully" });
  }
);

app.post("/oauth2/decision", decision, (req, res) => {
  console.log('3333333333')
  // 将授权码响应给客户端
  if (req.oauth2 && req.oauth2.res) {
    res.json({
      code: req.oauth2.res.authorizationCode,
      state: req.oauth2.req.state,
    });
  } else {
    res.status(400).json({ error: "Invalid authorization request" });
  }
});
app.post("/oauth2/token", token);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
