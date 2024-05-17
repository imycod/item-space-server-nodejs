const login = require("connect-ensure-login");
const passport = require("passport");
var oauth2orize = require("oauth2orize"),
  uid = require("./uid"),
  Code = require("./models/authorizationCode.model"),
  User = require("./models/user.model"),
  Client = require("./models/client.model"),
  Token = require("./models/accessToken.model");

const server = oauth2orize.createServer();

server.serializeClient(function (client, callback) {
  return callback(null, client._id);
});

server.deserializeClient(async function (id, callback) {
  try {
    const client = await Client.findOne({ _id: id });
    return callback(null, client);
  } catch (err) {
    return callback(err);
  }
});

server.grant(
  oauth2orize.grant.code(function (client, redirectUri, user, ares, callback) {
    console.log("grant.code----", { client, user, redirectUri,ares,callback });
    var code = new Code({
      code: uid(16),
      clientId: client._id,
      redirectUrl: redirectUri,
      userId: user._id,
    });

    code
      .save()
      .then((code) => {
        callback(null, code);
      })
      .catch((err) => {
        return callback(err);
      });
  })
);

server.exchange(
  oauth2orize.exchange.code(function (client, code, redirectUri, callback) {
    console.log("exchange.code----", { client, code, redirectUri });
    try {
      const authCode = Code.findOne({ code: code });

      if (authCode === undefined) {
        return callback(null, false);
      }
      if (client._id.toString() !== authCode.clientId) {
        return callback(null, false);
      }
      if (redirectUri !== authCode.redirectUrl) {
        return callback(null, false);
      }
      authCode.remove(function (err) {
        if (err) {
          return callback(err);
        }

        const token = new Token({
          token: uid(256),
          clientId: authCode.clientId,
          userId: authCode.userId,
        });

        token.save(function (err) {
          if (err) {
            return callback(err);
          }

          callback(null, token);
        });
      });
    } catch (error) {
      return callback(error);
    }
  })
);

module.exports.authorization = [
  server.authorization(async function (clientId, redirect_uri, callback) {
    try {
      const client = await Client.findOne({ id: clientId });
      console.log("client---", client);
      return callback(null, client, redirect_uri);
    } catch (error) {
      return callback(err);
    }
  }),
  function (req, res) {
    res.send({
      transactionID: req.oauth2.transactionID,
      user: req.user,
      client: req.oauth2.client,
    });
  },
];

module.exports.decision = [
  login.ensureLoggedIn(), 
  server.decision()
];

module.exports.token = [
  passport.authenticate(["basic", "oauth2-client-password"], {
    session: false,
  }),
  server.token(),
  server.errorHandler(),
];
