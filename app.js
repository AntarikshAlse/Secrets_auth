//jshint esversion:6
require('dotenv').config(); // Level 3 : environment variables
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/usersDB');
const encrypt = require('mongoose-encryption');

/* Level 2 : Encryption */
const userSchema = new mongoose.Schema({email: String, password:String}); 
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});
/*  */
const User = mongoose.model('User', userSchema);
app.get('/',(req, res)=>{
res.render('home')
});
app.route('/login')
.get((req, res)=>{
    res.render('login');
})
.post((req,res)=>{
    User.findOne({email:req.body.username},(err,foundUser)=>{
        if(err){
            console.log(err);
            return
        }
        else{
            if(foundUser){
                if(foundUser.password === req.body.password){
                    res.render('secrets');
                }else{
                    console.log("Enter Correct Password");
                    res.redirect('/login');
                }
            }else{
                res.send("User Dosen't exists");
            }
        }
    })
});
app.get('/logout', function(req, res){
 res.redirect('/login');
});
app.route('/register')
.get((req, res)=>{
    res.render('register')
})
.post((req, res)=>{
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save((err,response)=>{
        if(err){
           console.log(err);
        }else{
            res.render('secrets');
        }
    });
});


app.listen(3000,console.log("Server listening on port 3000"));