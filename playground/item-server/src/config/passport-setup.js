import passport from "passport";
import GoogleOAuth2 from "passport-google-oauth20";
import passportOauth from "passport-oauth";
import { HttpsProxyAgent } from "https-proxy-agent";
import { configDotenv } from "dotenv";
import User from "../models/user.model.js";
import clientConfig from "./clients.js";

configDotenv();

// once we have the user or user tag, we need to store the user in the session
// 会和cookieSession一起工作
passport.serializeUser((user, done) => {
  // 调用这个函数，这个函数会自动的把id传递到某个地方，这个地方会把id放到cookie里面
  // @ts-ignore
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  // 当用户下次访问我们的网站的时候，我们会拿到cookie里面的id，去找到这个用户
  User.findById(id).then((user) => {
    done(null, user); // 找到后把这个用户传递到下个stage
  });
});

const GoogleStrategy = GoogleOAuth2.Strategy;

const googleStrategy = new GoogleStrategy(
  {
    // options for the google strategy
    // 使用google api 对我们网站上的人员进行身份验证
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback", // do not write http://localhost:3000/auth/...
    // passReqToCallback: false
  },
  (accessToken, refreshToken, profile, done) => {
    // passport callback function 这个callback function将在身份验证的某个时刻触发
    // check if user already exists in our own db
    User.findOne({ googleId: profile.id }).then((record) => {
      if (record) {
        // already have the user
        // 传递给 serializeUser
        done(null, record);
      } else {
        // if not, create user in our db
        new User({
          username: profile.displayName,
          googleId: profile.id,
          thumbnail: profile._json.picture,
        })
          .save()
          .then((newUser) => {
            console.log("new user created: ", newUser);
            done(null, newUser); // when we call done, it will call serializeUser
          });
      }
    });
  }
);

// 设置代理 in China
const agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
// @ts-ignore
googleStrategy._oauth2.setAgent(agent);

passport.use(googleStrategy);

const OAuth2Strategy = passportOauth.OAuth2Strategy;
const itemShipStrategy = new OAuth2Strategy(
  {
    authorizationURL: "http://localhost:3001/dialog/authorize",
    tokenURL: "http://localhost:3001/oauth/token",
    callbackURL: clientConfig["item_ship"].redirect_uri,
    clientID: clientConfig["item_ship"].client_id,
    clientSecret: clientConfig["item_ship"].client_secret,
  },
  function (accessToken, refreshToken, profile, done) {
    console.log("OAuth2Strategy----->", { accessToken, refreshToken });
    console.log("item---profile---->", profile);
    User.findOne({ itemId: profile.user_id }).then((record) => {
      if (record) {
        // already have the user
        // 传递给 serializeUser
        done(null, record);
        User.updateOne({ itemId: profile.user_id }, { accessToken, refreshToken });
      } else {
        // if not, create user in our db
        new User({
          username: profile.name,
          itemId: profile.user_id,
          accessToken,
          refreshToken,
        })
          .save()
          .then((newUser) => {
            console.log("new user created: ", newUser);
            done(null, newUser); // when we call done, it will call serializeUser
          });
      }
    });
  }
);
itemShipStrategy.name = "ship";

function userProfile(accessToken, done) {
  var me = this;

  me._oauth2.get(
    "http://127.0.0.1:3001/api/userinfo",
    accessToken,
    function (err, body /*, res*/) {
      var json, profile;

      if (err) {
        return done(
          new InternalOAuthError("failed to fetch user profile", err)
        );
      }

      if ("string" === typeof body) {
        try {
          json = JSON.parse(body);
        } catch (e) {
          done(e);
          return;
        }
      } else if ("object" === typeof body) {
        json = body;
      }

      profile = json;
      profile.provider = me.name;
      profile._raw = body;
      profile._json = json;

      done(null, profile);
    }
  );
}

itemShipStrategy.userProfile = userProfile;

passport.use(itemShipStrategy);

const itemDIStrategy = new OAuth2Strategy(
  {
    authorizationURL: "http://localhost:3001/dialog/authorize",
    tokenURL: "http://localhost:3001/oauth/token",
    callbackURL: clientConfig["item_di"].redirect_uri,
    clientID: clientConfig["item_di"].client_id,
    clientSecret: clientConfig["item_di"].client_secret,
  },
  function (accessToken, refreshToken, profile, done) {
    console.log("OAuth2Strategy----->", { accessToken, refreshToken });
    console.log("item---profile---->", profile);
    User.findOne({ itemId: profile.user_id }).then((record) => {
      if (record) {
        // already have the user
        // 传递给 serializeUser
        done(null, record);
      } else {
        // if not, create user in our db
        new User({
          username: profile.name,
          itemId: profile.user_id,
        })
          .save()
          .then((newUser) => {
            console.log("new user created: ", newUser);
            done(null, newUser); // when we call done, it will call serializeUser
          });
      }
    });
  }
);
itemDIStrategy.name = "di";

itemDIStrategy.userProfile = userProfile;

passport.use(itemDIStrategy);

export default function setupPassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  // fix passport v0.6 + breaking change
  app.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
      request.session.regenerate = (cb) => {
        cb();
      };
      if (request.session && !request.session.save) {
        request.session.save = (cb) => {
          cb();
        };
      }
      next();
    }
  });
}
