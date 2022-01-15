import mongoose from 'mongoose'
 
const Schema = mongoose.Schema;
const CookieSchema = new Schema({
    username: String,
    token: String,
});
const Cookie = mongoose.model('Cookie', CookieSchema);

export default Cookie;