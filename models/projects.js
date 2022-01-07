const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = require('./comments');

// const ThumbnailSchema = new Schema({
//     url:String,
//     filename:String
// })
const projectSchema = new Schema({
    title:String,
    thumbnail:{
     url:String,
     filename:String
    },
    description:String,
    body:String,
    githubUrl:String,
    comments:[{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }]
})

projectSchema.virtual('thumb').get(function(){
    return this.thumbnail.url.replace('/upload','/upload/w_500,h_300');
})

const Project = mongoose.model('Project',projectSchema);

module.exports=Project;