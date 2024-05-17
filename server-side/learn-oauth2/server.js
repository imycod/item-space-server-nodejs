const express = require("express");
const passport = require("passport");
const passportOauth = require("passport-oauth");
const cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());

const OAuth2Strategy = passportOauth.OAuth2Strategy;
const itemStrategy = new OAuth2Strategy(
  {
    authorizationURL: "http://localhost:3000/oauth2/authorize",
    tokenURL: "http://localhost:3000/oauth2/token",
    callbackURL: "http://localhost:3001/callback",
    clientID: "00000001",
    clientSecret: "item_ship_secret",
  },
  function (accessToken, refreshToken, profile, done) {
    console.log({ accessToken, refreshToken, profile });
  }
);
itemStrategy.name = "ship";
passport.use(itemStrategy);

app.get(
  "/login",
  passport.authenticate("ship", {
    successRedirect: "/callback",
    failureRedirect: "/login",
    session: true,
  }),
);

app.post("/callback", passport.authenticate("ship"), (req, res) => {
  res.send("Callback");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
