//jshint esversion:6
require('dotenv').config();  
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/usersDB');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({email: String, password:String}); 
const User = mongoose.model('User', userSchema);
app.get('/',(req, res)=>{
res.render('home')
});
app.route('/login')
.get((req, res)=>{
    res.render('login');
})
.post((req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err);
            return;
        }
        else{
            if(foundUser){ 
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if(result){
                        res.render('secrets');
                    }else{
                        console.log("Enter Correct Password");
                        res.redirect('/login');
                    }
                });
                
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
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email:req.body.username,
            password:hash
        })
        newUser.save((err)=>{
            if(err){
               console.log(err);
            }else{
                res.render('secrets');
            }
        });
    })
});


app.listen(3000,console.log("Server listening on port 3000"));