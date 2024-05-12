// create Router instance
import { Router } from "express";
import passport from "passport";
import clientConfig from "../config/clients.js";

const router = Router();

// auth/login
router.get("/login", (req, res) => {
  // res.render('login', {user: req.user})
  // res.redirect('http://127.0.0.1:8080/') // 重定向到前端页面会带来跨域问题，所以不建议这样做
  // 读取views/index.html文件并返回
  res.sendFile("login-page.html", { root: "src/views" });
});

router.post("/login", (req, res) => {
  const client_id = req.headers["client_id"];
  const token = req.headers["token"];
  if (!token) {
    res.status(206);
    res.setHeader(
      "location",
      `http://127.0.0.1:3001/dialog/authorize?response_type=code&client_id=${clientConfig[client_id].client_id}&redirect_uri=${clientConfig[client_id].redirect_uri}`
    );
    res.end();
  }
});
// https://segmentfault.com/a/1190000006025804

// auth/logout
router.get("/logout", (req, res, next) => {
  // handle with passport
  // @ts-ignore
  req.logout(function (err) {
    console.log("err---", err);
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

// callback route for google to redirect to
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile/");
});

// auth/item
router.get(
  "/ship",
  passport.authenticate("ship", {
    scope: ["profile"],
  })
);
router.get("/ship/callback", passport.authenticate("ship"), (req, res) => {
  const token = req.user.accessToken;
  const refreshToken = req.user.refreshToken;
  res.cookie("token", token, {
    maxAge: 10 * 60 * 1000,
    httpOnly: false,
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
  });
  res.redirect("/ship");
});

// auth/item
router.get(
  "/di",
  passport.authenticate("di", {
    scope: ["profile"],
  })
);
router.get("/di/callback", passport.authenticate("di"), (req, res) => {
  const token = req.user.accessToken;
  const refreshToken = req.user.refreshToken;
  res.cookie("token", token, {
    maxAge: 10 * 60 * 1000,
    httpOnly: false,
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: false,
  });
  res.redirect("/di");
});

export default router;
