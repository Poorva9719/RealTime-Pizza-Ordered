 const homeController = require('../app/http/controllers/homeController')
const loginController = require('../app/http/controllers/Auth/loginController')
const registerController = require('../app/http/controllers/Auth/registerController')
const orderPlaceController = require('../app/http/controllers/customers/orderPlace')
const guest     =  require('../app/http/middleware/authenticate')
const isLoggeIn     =  require('../app/http/middleware/auth')
const adminController  = require('../app/http/controllers/admin/orders')
const adminLogin  =require('../app/http/middleware/isAdmin')

const intiRoutes = (app) => {
    app.get('/', homeController().index)
    app.post('/updateCart',homeController().updateCart)
    app.get('/cart', (req, res) => {
        res.render('customer/cart')
    })

    app.get('/login', guest,loginController().index)
    app.post('/login', loginController().postLogin) 
    app.post('/logOut', loginController().logOutUser)

    app.get('/register',guest, registerController().index)
    app.post('/register', registerController().registeration)

    //orders

    app.post('/order-place', orderPlaceController().placeOrder)
    app.get('/customer/orders', isLoggeIn,orderPlaceController().orderDetails)
    app.get('/customer/single/:id', isLoggeIn,orderPlaceController().singleOrder)

    //admin routes
    app.get('/admin/orders',adminLogin,adminController().index)
    app.post('/admin/orders/',adminLogin,adminController().updateOrderStatus)

}
module.exports = intiRoutes;