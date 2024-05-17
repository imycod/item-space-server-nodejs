const moogoose = require('mongoose');

const Schema = moogoose.Schema

const userSchema = new Schema({
    username: String,
    password: String,
})

const User = moogoose.model('user', userSchema);

module.exports = User;