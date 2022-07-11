let display= document.getElementById('sideMenu');
let hidden = document.getElementById('closeMenu');
let list   = document.getElementById('list');
const axios = require('axios')
const moment  = require('moment')
const initAdmin = require('./admin')

display.onclick=function(){
    list.style.visibility="visible";  
    list.style.right="0%";
}
hidden.onclick=function(){
    list.style.right="-50%";
} 

//Remove alert  message after X seconds
const alert = document.querySelector('#success-alert')
if(alert){
    setTimeout(()=>{
        alert.remove()
    },2000)
}

const registerAlert = document.querySelector('#successRegistered')
if(registerAlert){
    setTimeout(()=>{
        registerAlert.remove()
    },2000)
}

const buttons = document.querySelectorAll('.add-to-cart');
buttons.forEach((Btn)=>{
    Btn.addEventListener('click',(e)=>{
        const object = JSON.parse(Btn.dataset.pizza)
        updateCart(object);
    })
})

 
function updateCart(object){
    var notyf = new Notyf( 
        {
            duration: 2000,
            position: {
            x: 'right',
            y: 'left',

            }
        } 
    );
    axios.post('/updateCart',object).then(function(response){
        const element= document.getElementById('counter');
        element.innerText = response.data.totalQty;
         
        notyf.success('Items added to the cart');

    }).catch((err)=>{
        notyf.error('something went wrong');
    })
}


  


//change order status


let singleDocumentId = document.getElementById('singleOrderData')
let AllList          = document.querySelectorAll('.status_line') 
let order            = (singleDocumentId)?singleDocumentId.value:null
order                = JSON.parse(order)
let smallElement     = document.createElement('small')


function updateStatus(order){
    let stepCompleted = true
    
    AllList.forEach((status)=>{
        
        status.classList.remove('step-completed')
        status.classList.remove('currentStatus')
    })
    AllList.forEach((status)=>{
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp==order.status){
            stepCompleted=false
            smallElement.innerText= moment(order.updatedAt).format('hh:mm:ss A')
            status.appendChild(smallElement)
            if(status.nextElementSibling)
                status.nextElementSibling.classList.add('currentStatus')   
        }
    })

}


updateStatus(order)



const socket=  io()

initAdmin(socket)
if(order){

    socket.on('connect',()=>{
        socket.emit('join',`${order._id}_order`)
        
    })
}
       
let pathName = window.location.pathname
if(pathName.includes('/admin')){
    socket.emit('join','AdminRoom')
    
}
socket.on('orderUpdated',(data)=>{
    // use of spread operator
  let orderobject = {...order}
    orderobject.status= data.status
    updateStatus(orderobject) 
})


  
