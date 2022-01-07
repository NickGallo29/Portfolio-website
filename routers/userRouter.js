//////////////////////////////////////
//User Router
/////////////////////////////////////
//All routes pertaining to user
////////////////////////////////////

//Require Statements
const express = require ('express');
const router = express.Router();
const flash=require('connect-flash');
const User = require('../models/user');
const resetToken = require('../models/resetTokens');
const ExpressError = require('../utils/ExpressError')
const Joi = require('joi');
const {isLoggedIn}= require('../utils/middleware');
const session=require('express-session');
const passport = require('passport')
const catchAsync=require('../utils/catchAsync');
const passwordComplexity = require('joi-password-complexity');
const {userJoi}=require('../utils/validation');
const nodemailer = require('nodemailer');
const {transporter,mailOptions}=require('../utils/sendEmail');

//Function to send email on reset password
const sendEmail = (email,code)=>{
    var options =mailOptions;
    const body = `We have recieved your request to change your password.\nPlease follow this link to proceed\nwww.mynamesnick.com/reset/${code}\nIf you didn't request a password reset, please ignore this email`
    
    options.text=body;
    options.to=email
    transporter.sendMail(options,(err,info)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log(info.response);
        
    })
    return;
}

const passwordOptions = {
    min:8,
    max:40,
    upperCase:1,
    lowerCase:1,
    numeric:1,
    symbol:1
}

//Enforces password policy using Password Complexity module
const passwordRequirments =async(req,res,next)=>{
   const {error}=await passwordComplexity(passwordOptions).validate(req.body.password);
   if (error){
       const details= error.details
       const errors=[];
       for(let detail of details){
           errors.push(detail.type)
       }
       req.session.passError=errors;
       return res.redirect(`${req.originalUrl}`)
   }
   //checks for spaces
   if(req.body.password.includes(' ')){
     await req.flash('error','Password must not include spaces')
     return res.redirect(`${req.originalUrl}`)
   }
   //password matches confirm password
   if(req.body.password!=req.body.confirmPassword){
        await req.flash('error','Password must match.')
        return res.redirect(`${req.originalUrl}`)
    }else{
       next();
   }
}

//Validate user requirments
const userValidate=(req,res,next)=>{
    const {error} = userJoi.validate(req.body);
    if(error){
        const msg=error.details[0].message;
        req.flash('error',msg)
        return res.redirect('/register')
    }else{
        next()
    }

}

router.get('/register',(req,res)=>{
    res.render('pages/register');
})

router.post('/register',passwordRequirments,userValidate,catchAsync(async(req,res,next)=>{
    const { username, password,firstName,lastName,email,confirmPassword }=req.body;
    const newUser = new User({
        username:username.toLowerCase(),
        displayUser:username,
        firstName:firstName,
        lastName:lastName,
        fullName:`${firstName} ${lastName}`,
        email:email
    });
    try{
        const registeredUser = await User.register(newUser,password);
        await req.login(registeredUser,err=>{
            if(err){
                req.flash('error','User login failed, please try again');
                return res.redirect('/')
            }
        })
        req.flash('success','Account Successfully Created');
        return res.redirect('/') 
    }catch(e){
        res.send(e);
    }
    
}))

router.get('/login',(req,res)=>{
    res.render('pages/login');
})

router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),async(req,res,next)=>{
    const redirect = req.session.returnUrl || '/'
    req.flash('success','Welcome Back');
    res.redirect(redirect);
    
})

router.get('/logout',isLoggedIn,(req,res)=>{
    req.logOut();
    req.flash('success','Logged Out');
    res.redirect('/login')
})

router.get('/reset',(req,res)=>{
    res.render('pages/reset')
})

router.post('/reset',catchAsync(async(req,res,next)=>{
    req.body.username=req.body.username.toLowerCase();
    const validUser = await User.find(req.body);
    //checks for no user
    if(validUser.length<1){
        
    }else{
        //Creates reset token to change password
        const token = new resetToken(req.body);
        token.dateInitiated=Date.now();
        await token.save()
        sendEmail(req.body.email,token._id)
    }
    req.flash('success','Email has been sent. If user exists, check inbox or spam for verification');
    res.redirect('/')
}))

router.get('/reset/:tokenId',catchAsync(async(req,res,next)=>{
    const{tokenId}=req.params
    res.render('pages/resetSuccess',{tokenId});
}))

router.post('/reset/:tokenId',passwordRequirments,catchAsync(async(req,res,next)=>{
    const {tokenId} = req.params;
    const token=await resetToken.findById(tokenId);
    //Token only lasts five minutes
    if(Date.now()-token.dateInitiated>300000){
        await resetToken.findByIdAndDelete(tokenId);
        req.flash('error','Reset Expired, Please try Again');
        return res.redirect('/reset')
    }
    const user = await User.findOne({email:token.email,username:token.username})
    await user.setPassword(req.body.password);
    await resetToken.findByIdAndDelete(tokenId);
    user.save()
    req.flash('success','Password successfully changed');
    res.redirect('/')

}))



module.exports = router;