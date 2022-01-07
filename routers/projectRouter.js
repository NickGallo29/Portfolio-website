/////////////////////////////////
//Project Router
/////////////////////////////////
//Router for all /projects
////////////////////////////////

//Require statements
const express=require("express");
const router = express.Router();
const catchAsync=require('../utils/catchAsync');
const Project=require('../models/projects');
const Comment=require('../models/comments');
const User=require('../models/user');
const Joi = require('joi');
const ExpressError=require('../utils/ExpressError');
const {commentJoi}=require('../utils/validation');
const multer= require('multer');
const {Cloudstorage} = require('../cloudinary');
const upload=multer({storage:Cloudstorage});
const flash = require('connect-flash');
const {isLoggedIn,isUser,adminValidate}= require('../utils/middleware');
const {convertDeltaToHtml,convertHtmlToDelta}=require('node-quill-converter');

//Deletes any illegal text from comments(emojis, unusual characters, etc.)
const commentClean = (req,res,next)=>{
    const newComment = req.body.comment.comment
    req.body.comment.comment  = newComment.replace(/[^\x00-\xFF]/g, "")
    next();
}

//Validates that comment matches required fields
const commentValidate = (req,res,next)=>{
    const {error}= commentJoi.validate(req.body);
    if(error){
        console.log(error.details);
        req.flash('error',`Could not post comment,${error.details[0].message}`)
            //throw new ExpressError(400,msg);
        res.redirect(req.session.returnUrl||'/projects'); 
    }else{
        next();
    }
}

router.get('/',catchAsync(async (req,res,next)=>{
    const projects = await Project.find({});
    if(!projects) throw new ExpressError(400,"An error occured loading projects");
    res.render('pages/projects/projectHome',{projects});
}))

router.get('/new',isLoggedIn,adminValidate,(req,res)=>{
    res.render('pages/projects/new');
})

router.post('/',isLoggedIn,adminValidate,upload.single("thumbnail"),catchAsync(async(req,res,next)=>{
    //Conversion to parse Quill Text editor 
    const JSONBody= JSON.parse(req.body.body);
    const html=convertDeltaToHtml(JSONBody);
    req.body.body=html;
    ///////////////////////////////////////
    const newProject= new Project(req.body);
    if(!newProject) throw new ExpressError(400,"An Error has occured making Project");
    newProject.thumbnail.url=req.file.path;newProject.thumbnail.filename=req.file.filename;
    await newProject.save();
    res.redirect('/projects');
}))

router.get('/:id',catchAsync(async(req,res,next)=>{
    var project = await Project.findById(req.params.id).populate(
        {path:"comments",
        populate:{
            path:'author'
        }
    });
    //Sets comments as most recent
    project.comments.reverse();
    req.session.returnUrl = req.originalUrl
    res.render('pages/projects/projectShow',{project});
}))

router.put('/:projectId',isLoggedIn,adminValidate,catchAsync(async(req,res,next)=>{
    const {projectId} = req.params;
    const JSONBody= JSON.parse(req.body.body);
    const html=convertDeltaToHtml(JSONBody);
    req.body.body=html;
    const project= await Project.findByIdAndUpdate(projectId,{...req.body});
    if(!project) throw new ExpressError(400,"Couldn't find project, check ID");
    req.flash('success','Updated Project')
    res.redirect(`/projects/${projectId}`);
    //Project.findByIdAndUpdate()
}))

router.get('/:projectId/edit',isLoggedIn,adminValidate,catchAsync(async (req,res)=>{
    const project = await Project.findById(req.params.projectId);
    const deltaTxt=convertHtmlToDelta(project.body);
    project.body=JSON.stringify(deltaTxt)
    if(!project) throw new ExpressError(400,"Couldn't find project, check ID");
    res.render('pages/projects/edit',{project});
}))

router.post('/:id/comment',isLoggedIn,commentClean,commentValidate,catchAsync(async(req,res,next)=>{
    const id = req.params.id;
    const project = await Project.findById(id);
    var comment = new Comment(req.body.comment);
    comment.author=req.user._id
    //const newComment = comment.comment.replace(/[^\x00-\xFF]/g, "")
    //comment.comment=newComment;
    project.comments.push(comment);
    await comment.save();
    await project.save();
    req.flash('success','Comment Successfully Posted');
    res.redirect(`/projects/${id}`);
}))

router.put('/:projectId/comment/:commentId',isUser,catchAsync(async(req,res,next)=>{
    const {projectId,commentId}=req.params;
    const comment = await Comment.findByIdAndUpdate(commentId,{$set:{comment:req.body.comment.comment}})
    if(!comment)throw new ExpressError(400,"Couldn't find comment");
    await comment.save();
    req.flash('success','Comment Updated')
    res.redirect(`/projects/${projectId}`);

}))

router.delete('/:projectId/comment/:commentId',isUser,catchAsync(async(req,res,next)=>{
    const{projectId,commentId}=req.params
    await Project.findByIdAndUpdate(projectId,{$pull:{comments:commentId}});
    await Comment.findByIdAndDelete(req.params.commentId);
    req.flash('success','Comment Deleted');
    res.redirect(`/projects/${projectId}`);
}))



router.delete('/:projectId',isLoggedIn,adminValidate,catchAsync(async(req,res)=>{
    const {projectId}=req.params;
    const project = await Project.findById(projectId)
    if(!project) throw new ExpressError(400,"Couldn't find project, check ID");
    const comments= project.comments;
    await Comment.deleteMany({_id:comments});
    await Project.findByIdAndDelete(projectId);
    req.flash('success','Project Deleted')
    res.redirect('/projects');
}))

module.exports=router

