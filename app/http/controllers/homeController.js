const menus = require('../../models/menus')
const session = require('express-session')

const homeController=()=>{
    return {
        async index(req,res){
            try{
                // req.session.user={}
                // req.session.name="vikansh";
                // console.log(req.session);
                const menuData = await menus.find();
                //menuData is array of objects
                res.render('home',{'menuData':menuData})
            } catch(err){
                new Error(err)
            }
 
        },
        updateCart(req,res){
            console.log(req.body);
            //for the first time creating cart and adding basic object structure
            if(!req.session.cart){
                req.session.cart={
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }
            }
            //check if item doest not exist in cart
            let cart= req.session.cart
            if(!cart.items[req.body._id]){
                cart.items[req.body._id]={
                    item:req.body,qty:1,
                };
                cart.totalQty=cart.totalQty+1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }else{
                cart.items[req.body._id].qty = cart.items[req.body._id].qty+1
                cart.totalQty = cart.totalQty +1 
                cart.totalPrice = cart.totalPrice + req.body.price

            }

            res.json({totalQty:cart.totalQty});
        }
    }
}


module.exports=homeController