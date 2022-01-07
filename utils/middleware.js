const Comment = require('../models/comments');
const {convertDeltaToHtml}=require('node-quill-converter');

///////////////////////////////
//isLoggedIn
//Checks if user is logged in, if not: Redirects to login page
///////////////////////////////
module.exports.isLoggedIn = (req,res,next)=> {
    if(!req.isAuthenticated()){
        req.session.returnUrl = req.originalUrl;
        req.flash('error','Must be logged in');
        return res.redirect('/login');
    }
    next();
}

///////////////////////////////
//isUser
//Checks if current user has valid permission to manipulate object
///////////////////////////////
module.exports.isUser = async(req,res,next)=>{
    const {commentId,projectId} = req.params;
    const comment = await Comment.findById(commentId);
    if(comment.author._id!=req.user.id && req.user.isAdmin==false){
        req.flash('error','Invalid Permission');
        return res.redirect(`/projects/${projectId}`);
    }else{
        next();
    }
}

/////////////////////////////
//isAdmin
//Check if user is admin
/////////////////////////////
module.exports.adminValidate = (req,res,next)=>{
     if(req.user.isAdmin==true){
         console.log('made it here')
         next();
     }else{
        req.flash('error','Invalid Permission');
        return res.redirect('/projects')
     }
 }

 module.exports.bodyConvert=(req,res,next)=>{
    console.log(req.body,' the body');
    next();
 }
