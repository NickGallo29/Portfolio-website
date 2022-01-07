const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resetPassSchema = new Schema({
    email:String,
    username:String,
    dateInitiated:Number,
})

const resetToken = mongoose.model('Reset',resetPassSchema);
module.exports=resetToken;