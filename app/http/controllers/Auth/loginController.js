const passport= require('passport')
const loginController=()=>{
    function _redirectToOrderPage(req){
        return (req.user.role=="admin")?"/admin/orders/":"/customer/orders";
    }
    return {
        index(req,res){
            res.render('auth/login')
        },
        postLogin(req,res,next){
            const {email,password}=req.body

            if(!email || !password){
                req.flash('error',"*All Fields are required.")
                return next(err)
            }
            passport.authenticate('local',(err,user,message)=>{
                if(err){
                    req.flash('error',message.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error',message.message)
                    return res.redirect('/login')
                }
                req.logIn(user,(err)=>{
                    if(err){
                        req.flash("error",message.message)
                        return next(err)
                    }
                    return res.redirect(_redirectToOrderPage(req))
                })
            })(req,res,next)
        },
        logOutUser(req,res,next){
            req.logOut((err)=>{
                if(err){
                    req.flash('error','somethin went wrong')
                }
            })
            return res.redirect('/')
        }
    }
}


module.exports=loginController