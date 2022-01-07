const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    firstName:String,
    lastName: String,
    fullName:String,
    email: String,
    displayUser:String,
    isAdmin: {type: Boolean, default:false}
})

userSchema.plugin(passportLocalMongoose);
userSchema.statics.changePass = function(pass){
    this.setPassword(pass);
}
const User = mongoose.model('User',userSchema);

module.exports = User;
