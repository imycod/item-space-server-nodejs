const oauth2orize = require('oauth2orize')
const server = oauth2orize.createServer();

const Clients = require('../models/client.model')
const AuthorizationCode = require("../models/authorizationCode.model");
const AccessToken = require("../models/accessToken.model");
const utils = require('../utils/index')
server.serializeClient(function (client, done) {
    return done(null, client._id);
});

server.deserializeClient(function (id, done) {
    Clients.findOne(id, function (err, client) {
        if (err) {
            return done(err);
        }
        return done(null, client);
    });
});

server.grant(oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {
    console.log({client, redirectURI, user, ares})

    const code = utils.uid(16);

    const ac = new AuthorizationCode({
        code: code,
        clientId: client.id,
        redirectUri: redirectURI,
        userId: user.id
    })
    ac.save(function (err) {
        if (err) {
            return done(err);
        }
        return done(null, code);
    })
}));

server.exchange(oauth2orize.exchange.code(async function (client, code, redirectURI, done) {
    AuthorizationCode.findOne(code, function (err, code) {
        if (err) {
            return done(err);
        }
        if (client.id !== code.clientId) {
            return done(null, false);
        }
        if (redirectURI !== code.redirectUri) {
            return done(null, false);
        }

        const token = utils.uid(256);
        const at = new AccessToken({
            token,
            userId: code.userId,
            clientId: code.clientId
        });
        at.save(function (err) {
            if (err) {
                return done(err);
            }
            return done(null, token);
        });
    });
    // const code = await AuthorizationCode.findOne(code)
    // try {
    //     if (client.id !== code.clientId) {
    //         return done(null, false);
    //     }
    //     if (redirectURI !== code.redirectUri) {
    //         return done(null, false);
    //     }
    //
    //     const token = utils.uid(256);
    //     // 存数据库，或者存redis
    //     const at = new AccessToken(token, code.userId, code.clientId, code.scope);
    //     at.save(function (err) {
    //         if (err) {
    //             return done(err);
    //         }
    //         return done(null, token);
    //     });
    // } catch (err) {
    //     return done(err)
    // }
}));

module.exports = server;