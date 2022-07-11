const orders = require('../../../models/orders')
const adminController = () => {
    return {
        async index(req, res) {
            const result = await orders.find({
                status: {
                    $ne: 'completed'
                }
            }).sort({
                createdAt: -1
            }).populate('customerId', '-password')

            if (req.xhr) {
                return res.json(result)
            } else {

                return res.render('admin/orders')
            }
        },
        async updateOrderStatus(req, res) {
            try {

                const {
                    orderId,
                    status
                } = req.body;

                const response = await orders.findByIdAndUpdate(orderId, {
                    status: status
                }); 
                if(response){ 
                    const EventEmitter =req.app.get('eventemitter')
                    EventEmitter.emit('orderUpdated',{orderId:orderId,status:status})
                    req.flash('success',`order(${orderId }) status has been change from ${response.status} to ${status}`) 
                     
                }
                else{
                    req.flash('error',"Something went wrong.") 
                }
                return res.redirect('/admin/orders')
            } catch (err) {
                console.log(err);
            }
        }
    }
}


module.exports = adminController