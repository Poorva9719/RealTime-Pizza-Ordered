const axios = require('axios')
const moment  = require('moment')
function initAdmin(socket){
    const adminPlacedOrder = document.getElementById('AdminPlacedOrder')
    const adminContainer  =document.getElementById('adminContainer')
    let orders = []
    let markup
    axios.get('/admin/orders',
    {
        headers:{"X-Requested-With":"XMLHttpRequest"}
    }).then(res=>{
        
        orders= res.data;
        if(!orders.length){
            adminContainer.innerHTML= generateMarkUpOfNoOrder();
        }else{
            markup = generateMarkup(orders)
            adminPlacedOrder.innerHTML = markup
        }
    

    }).catch((err)=>{
        console.log(err);
    })
    function renderItems(items){
        let parseItems = Object.values(items)
        return parseItems.map((menuItem)=>{
            return `<p>${menuItem.item.name} - ${menuItem.qty}</p>`
        }).join('')
    }
    function generateMarkup(orders){
        return orders.map(order=>{
            return `
            <tr class="">
                <td class="border px-4 py-2 text-left text-green-900">
                    <p>${order._id}</p>
                    <div>${renderItems(order.orders)}</div>
                </td>
                <td class="border px-4 py-2 text-left">
                    ${order.customerId.name }
                </td>
                <td class="border px-4 py-2 text-left">
                    ${order.address }
                </td>
                <td class="border px-4 py-2 text-left">
                    <div class="inline-block relative w-64">
                        <form actio="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${order._id}"/>
                            <select name="status" onchange="this.form.submit()" class="cursor-pointer font-bold block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed" ${order.status==="order_placed"?"selected":""}>Placed</option>
                                <option value="confirmed" ${order.status==="confirmed"?"selected":""}>Confirmed</option>
                                <option value="prepared" ${order.status==="prepared"?"selected":""}>Prepared</option>
                                <option value="delivered" ${order.status==="delivered"?"selected":""}>Delivered</option>
                                <option value="completed" ${order.status==="delivered"?"completed":""}>Completed</option>
                            </select>
                        </form>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.348 8z"/>
                            </svg>
                        </div>
                    </div>
                </td>  
                <td class="border px-4 py-2 text-left">
                    ${ moment(order.createdAt).format('hh:mm:ss A')}
                </td>         
                        
            `
        }).join('')
    }
 

    function generateMarkUpOfNoOrder(){
        return ` 
        <div class="font-bold py-2 w-2/5 mx-auto text-center">  
            <p class="text-zinc-900  font-bold text-2xl">😮 No Orders Found.</p>
            <img src="/img/no-order.jpg" alt="no-order"/> 
            <a href="/" class="inline-block rounded-full btn-primary text-white font-bold px-6 py-2 cursor-pointer">Go back</a>
        </div>  
        `
    }
 
    socket.once('newOrder',(data)=>{
        orders.unshift(data) 
        if(orders.length){  
            var notyf = new Notyf( 
                {
                    duration: 2000,
                    position: {
                    x: 'right',
                    y: 'left',
        
                    }
                } 
            );
            notyf.success('New Order Added.');
            adminPlacedOrder.innerHTML='';
            adminPlacedOrder.innerHTML = generateMarkup(orders)
        }else{
            adminContainer.innerHTML = generateMarkUpOfNoOrder()
        }
    })
 

 


}
module.exports= initAdmin