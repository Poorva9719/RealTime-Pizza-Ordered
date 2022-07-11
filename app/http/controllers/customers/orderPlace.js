const users = require('../../../models/users')
const orders = require('../../../models/orders')
const orderPlaceController = () => {
    return {

        async placeOrder(req, res) {

            const {
                address,
                number
            } = req.body
            try {
                if (!address || !number) {
                    req.flash("error", "*All Fields are Required")
                    res.redirect('/cart')
                }

                const order = new orders({
                    customerId: req.user._id,
                    orders: req.session.cart.items,
                    address: address,
                    number: number
                })
                const result = await order.save()
                if (result) { 
                    const resul1t =await orders.populate(result,{path:"customerId"})
                    delete req.session.cart 
                    const EventEmitter =req.app.get('eventemitter')
                    if(resul1t){ 
                        EventEmitter.emit('newOrderAdded',resul1t)
                    } 
                    req.flash("success", "Order placed successfully.")
                    res.redirect('/customer/orders')
                }

            } catch (err) {
                if (err.name == "ValidationError") {
                    if ('number' in err.errors) {
                        req.flash('mobile', number)
                        req.flash('address', address)
                        req.flash("error", err.errors.number.message)
                    }
                } else {
                    console.log(err);
                    req.flash("error", "*Something went wrong.")
                }
                res.redirect('/cart')
            }
        },
        async orderDetails(req, res) {
            try {
                const result = await orders.find({
                    customerId: req.user._id
                }).sort({
                    createdAt: -1
                })
                res.render('customer/order-detail', {
                    order: result
                })
            } catch (err) {
                console.log(err);
            }
        },
        async singleOrder(req, res) {
            const orderData = await orders.findById(req.params.id) 
            //authorize user
            if (orderData) {
                if (req.user._id.toString() == orderData.customerId.toString()) { 
                    return res.render('customer/singleorder',{orderData:orderData})
                } else {
                    return res.redirect('/')
                }
            } else {

                return res.redirect('/')
            }

        }
    }
}


module.exports = orderPlaceController