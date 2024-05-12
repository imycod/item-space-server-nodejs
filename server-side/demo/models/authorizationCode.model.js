const moogoose = require('mongoose');

const Schema = moogoose.Schema

const authorizationCodeSchema = new Schema({
    code: {type: String, required: true},
    redirectUri: {type: String, required: true},
    clientId: {type: String, required: true},
    userId: {type: String, required: true},
})

const AuthorizationCode = moogoose.model('authorization_code', authorizationCodeSchema);

module.exports = AuthorizationCode;