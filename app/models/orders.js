const mongoose = require('mongoose')
const orderSCheema =new mongoose.Schema({
        customerId:{
            type:mongoose.Types.ObjectId,
            required:true,
            ref:'users'
        },
        orders:{
            type:Object,
            require:true
        },
        address:{
            type:String,
            required:true
        },
        number:{
            type:Number,
            required:true, 
            // min:[8,'Phone Number must be 10 digit.'],
            // max:[10,'Phone Number must be 10 digit.'],
        },
        status:{
            type:String,
            default:"order_placed"
        },
        payment:{
            type:String,
            default:"COD"
        }

    },
    {
        timestamps:true
    })


const orderscollection =new mongoose.model('orders',orderSCheema)



module.exports = orderscollection