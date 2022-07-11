
const Passportlocal = require('passport-local').Strategy
const users         = require('../models/users')
const bcrypt        = require('bcrypt')
function intializePassport(passport){
    passport.use(new Passportlocal({usernameField:'email'},async function(email,password,done){
        const user = await users.findOne({email:email});
        if(!user){
            return done(null,false,{message:"*No user with this email"})
        }
        bcrypt.compare(password,user.password,function(err,correct){
            if(err){
                return done(null,false,{message:"*somethins went wrong!! "})
            }
            if(correct){
                return done(null,user,{message:"*Logged in successfully"})
            }
            return done(null,false,{message:"*wrong username or password"})
        })

    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id);
    })
    
    passport.deserializeUser((id,done)=>{
        users.findOne
        ({_id:id},(err,user)=>{
            done(err,user)
        })
    })
}

module.exports = intializePassport;

