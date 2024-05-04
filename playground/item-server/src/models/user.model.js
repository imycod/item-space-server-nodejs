import moogoose from "mongoose";

const Schema = moogoose.Schema

const userSchema = new Schema({
    username: String,
    googleId: String,
    thumbnail: String
})

const User = moogoose.model('user', userSchema);

export default User;