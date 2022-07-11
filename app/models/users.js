const mongoose  =  require('mongoose')
const validator =  require('validator')
const bcrypt   = require('bcrypt')
const userScheema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        required:true,
        type:String,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Email is not valid!!')
        }
    },
    password:{
        type:String,
        required:true,
    
    },
    role:{
        type:String,
        required:true,
        default:"customer"
    }
},
{timestamps:true}
)

userScheema.pre('save', async function(next){
    if(this.isModified('password')){ 
        this.password=await bcrypt.hash(this.password,10)
        next()
    } 
});

// Collection MOdel 
const users = new mongoose.model('users',userScheema)
module.exports = users 