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
