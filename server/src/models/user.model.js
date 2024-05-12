import moogoose from "mongoose";

const Schema = moogoose.Schema

const userSchema = new Schema({
    username: String,
    googleId: String,
    thumbnail: String,
    itemId:String,
    accessToken:String,
    refreshToken:String
})

const User = moogoose.model('user', userSchema);

export default User;