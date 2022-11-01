//jshint esversion:6
require('dotenv').config();  
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
// Initialize and create the session
 app.use(passport.initialize());
 app.use(passport.session());
mongoose.connect('mongodb://localhost:27017/usersDB');
// to Use Mongoose Plugins always use -> new mongoose.Schema({});
const userSchema = new mongoose.Schema({username: String, password:String}); 

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
// create user Stratergy
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(req, res)=>{
res.render('home')
});
app.route('/login')
.get((req, res)=>{
    res.render('login');
})
.post((req,res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user,(err)=>{
        if(err) console.log(err);
        else{
            // sends cookie to browser to authenticate user with pages of credentials 
            passport.authenticate('local')(req,res,()=>{
                res.redirect("/secrets");
            })
        }
    })
});
app.get('/logout', function(req, res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
});
//Secrets
app.get('/secrets', function(req, res){
    if(req.isAuthenticated()){
        res.render('secrets');
    }else{
        //Not authenticated so not logged in
        res.redirect("/login");
    }
});

//Register
app.route('/register')
.get((req, res)=>{
    res.render('register')
})
.post((req, res)=>{
    User.register({username: req.body.username},req.body.password,(err,newUser)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect("/secrets");
            })
        }
    })
});


app.listen(3000,console.log("Server listening on port 3000"));