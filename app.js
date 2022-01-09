// Nicholas Gallo Portfolio Website 
// www.mynamesnick.com

// Published on 1/5/20
// Last Updated: 1/7/20
// Created with Express/Node.js with the help of Mongoose and other modules

// You're currently in the home router

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

/////////////////////////
//Require Statements
/////////////////////////
const express = require("express");
const app=express();
const path=require("path")
const ejsMate=require("ejs-mate")
const mongoose = require('mongoose');
const User = require('./models/user');
const ExpressError=require('./utils/ExpressError');
const multer= require('multer');
const methodOverride = require('method-override');
const projectRouter = require('./routers/projectRouter');
const userRouter = require('./routers/userRouter');
const session = require('express-session');
const flash=require('connect-flash');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require('connect-mongo');



const {Cloudstorage} = require('./cloudinary');
const { findOne } = require("./models/user");
const upload=multer({storage:Cloudstorage});

//Setting enviormental variables and back-ups
const dbUrl= process.env.DB_URL || 'mongodb://localhost:27017/PortfolioDB';
const secret= process.env.SECRET ||'acqeijnvqoijvowev13c';

////////////////////////////
//Mongoose config
////////////////////////////
mongoose.connect(dbUrl,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>{console.log("DB Connected")
}).catch(err=>{
    console.log(err)
})

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:secret
    },
    touchAfter:24*60*60
})

const sessionConfig = {
    store:store,
    name:'sess',
    secret:secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires: 1000*60*60*24*7
    }
}

///////////////////////////
//.use and .set Statements
///////////////////////////
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());

app.use(mongoSanitize());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

app.use(flash());

//Setting local variables
app.use((req,res,next)=>{
    res.locals.registerInfo=req.session.registerInfo||{}
    res.locals.currentUser=req.user;
    res.locals.success =req.flash('success');
    res.locals.error = req.flash('error');
    next()
})


///////////////////
//External routers
///////////////////
app.use('/projects',projectRouter);
app.use('/',userRouter)

/////////////////////
//Base App
////////////////////
app.get('/',(req,res)=>{
    res.render('pages/home')
})

app.get('/about',(req,res)=>{
    res.render('pages/about')
    console.log(req.session.bigBong)
})

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,'Page Not Found'));
})

app.use((err,req,res,next)=>{
    const h = err.status
    console.log(err.msg);
    const status= `${err.status}` || 500;
    const msg = err.msg ||"Something went wrong"

    res.render('pages/error',{status,msg});
})

const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Serving port ${port}`);
})