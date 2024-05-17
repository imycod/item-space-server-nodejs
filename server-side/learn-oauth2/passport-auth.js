/*
 * @Author: wuxs 317009160@qq.com
 * @Date: 2024-05-16 22:14:10
 * @LastEditors: wuxs 317009160@qq.com
 * @LastEditTime: 2024-05-17 07:21:13
 * @FilePath: \primevue-tailwind-elementd:\code\workcode\item-space-server-nodejs\server-side\passport-auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport"),
  BasicStrategy = require("passport-http").BasicStrategy,
  ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy,
  BearerStrategy = require("passport-http-bearer").Strategy,
  User = require("./models/user.model"),
  Client = require("./models/client.model"),
  Token = require("./models/accessToken.model");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log('user-name',username);
    try {
      const user = await User.findOne({ username });
      console.log('user---',user);
      if (!user) return done(null, false);
      if (user.password !== password) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  console.log('id---',id);
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(
  new BearerStrategy(async function (accessToken, done) {
    try {
      const token = await Token.findOne({ value: accessToken });
      if (!token) {
        return done(null, false);
      }
      User.findOne({ _id: token.userId }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        done(null, user, { scope: "*" });
      });
    } catch (err) {
      return done(err);
    }
  })
);

async function verifyClient(clientId, clientSecret, done) {
  try {
    console.log("clientId---", clientId);
    const client = await Client.findOne({ id: clientId });
    if (!client || client.secret !== clientSecret) {
      return done(null, false);
    }
    return done(null, client);
  } catch (err) {
    return done(err);
  }
}

passport.use(new BasicStrategy(verifyClient));
passport.use(new ClientPasswordStrategy(verifyClient));

function setupPassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  // app.use(function (request, response, next) {
  //   if (request.session && !request.session.regenerate) {
  //     request.session.regenerate = (cb) => {
  //       cb();
  //     };
  //     if (request.session && !request.session.save) {
  //       request.session.save = (cb) => {
  //         cb();
  //       };
  //     }
  //     next();
  //   }
  // });
}

module.exports = setupPassport

// module.exports.isBearerAuthenticated = passport.authenticate("bearer", {
//   session: false,
// });

// module.exports.isClientAuthenticated = passport.authenticate("client-basic", {
//   session: false,
// });

// module.exports.isAuthenticated = passport.authenticate(["basic", "bearer"], {
//   session: false,
// });
