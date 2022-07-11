const users = require('../../../models/users')
const bcrypt = require('bcrypt')
const registerController=()=>{
    return {
        index(req,res){
            res.render('auth/register')
        },
          async registeration(req,res){
            try{

                const {name,email,password} =req.body;
                if(!name || !email || !password){
                    req.flash("error","*All Fields are required")
                    req.flash("name",name)
                    req.flash("email",email)  
                    res.redirect('/register');
    
                }  
    
                const result = await users.find({'email':email});
                 
                if(result.length){
                    req.flash("error","*This Email is already Taken")
                    req.flash("name",name)
                    req.flash("email",email)  
                    res.redirect('/register');
                }else{ 
                    const newUser=new users({
                        name,
                        email,
                        password
                    })
                    const results = await newUser.save()
                    if(results){
                        req.flash("success","*Your Registration is Successfully completed!!")
                        res.redirect('/login');
                    }
                }
            }
            catch(err){
                req.flash("error","*Something went wrong")
                req.flash("name",name)
                req.flash("email",email)  
                res.redirect('/register');
            }


        }
    }
}


module.exports=registerController