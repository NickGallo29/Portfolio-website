const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

const commentSchema = new Schema ({
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    comment:String
})

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;