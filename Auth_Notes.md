#Authentications Notes

>Level 1 - Login and Password
Can be seen in the plain text in DB.

>Level 2 - mongoose encryption 
Decrypted using secret keys.
<!--  
Level 2 : Mongoose Encryption  with environment variables
const encrypt = require('mongoose-encryption'); 
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

// Mongoose Encryption is decrypted in plain text when foundUser
 -->

>Level 3 - Hashing
Match the Hashed password in DB
<!-- Cant reverse in plain text = No Encrypt keys -->

Level 4 - Salting and Hashing
<!-- Using bcrypt for hashing with salt Rounds -->
<!-- 
const bcrypt = require('bcrypt');
const saltRounds = 10;
    // Login Bcrypt
app.route('/login')
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

// Register bcrypt

app.route('/register')
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
 -->