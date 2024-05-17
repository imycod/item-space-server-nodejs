const moogoose = require('mongoose');

const Schema = moogoose.Schema

const accessTokenSchema = new Schema({
    token: {type: String, required: true},
    clientId: {type: String, required: true},
    userId: {type: String, required: true},
})

const AccessToken = moogoose.model('access_token', accessTokenSchema);

module.exports = AccessToken;