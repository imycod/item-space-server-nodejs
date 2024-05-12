const passport = require('passport')
const LocalStrategy = require('passport-local')
const BasicStrategy = require('passport-http').BasicStrategy
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy

const User = require('../models/user.model')
const Client = require('../models/client.model')

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({username: username})
        if (!user) return done(null, false);
        if (user.password !== password) return done(null, false);
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => done(error, user));
});

function verifyClient(clientId, clientSecret, done) {
    Client.findById(clientId, (error, client) => {
        if (error) return done(error);
        if (!client) return done(null, false);
        if (client.clientSecret !== clientSecret) return done(null, false);
        return done(null, client);
    })
}

passport.use(new BasicStrategy(verifyClient));

passport.use(new ClientPasswordStrategy(verifyClient));