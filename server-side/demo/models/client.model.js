const moogoose = require('mongoose');

const Schema = moogoose.Schema

const clientSchema = new Schema({
    name: {type: String, unique: true, required: true},
    id: {type: String, required: true},
    secret: {type: String, required: true},
    userId: {type: String, required: true},
})

const Client = moogoose.model('client', clientSchema);

module.exports = Client;