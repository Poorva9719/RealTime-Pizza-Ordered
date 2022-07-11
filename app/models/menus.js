const mongoose = require('mongoose')


const scheema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    },
    size:{
        required:true,
        type:String
    }

})


//collection


const menus= new mongoose.model('menu',scheema);
module.exports=menus