require('dotenv').config()
const express = require('express')
const app  = express()
const hbs  = require('hbs')
const port = process.env.PORT || 3000
const path = require('path')
const intiRoutes = require('./routes/web') 
const expressSesion = require('express-session')
const MongoDb = require('connect-mongo') 
const storeSession =new MongoDb({mongoUrl:process.env.DB_SECRET_KEY,collectionName:"session"})
const flash = require('express-flash')
const passport  = require('passport') 
const moment   = require('moment')
const EventEmitter = require('events') 
const eventemitter = new EventEmitter() 


// register helper
hbs.registerHelper('JSON2String', function (object) { return JSON.stringify(object) }); 
hbs.registerHelper("setVar", function(varName, varValue, options) {
  options.data.root[varName]=(varValue)
});
hbs.registerHelper("multiply", function(v1,v2) {
  return v1*v2;
}); 

hbs.registerHelper('ternaryOperator', function (object) {  
    if(object){
        return object.totalQty
    }else{
        return '0'
    }
 });

hbs.registerHelper('changeDateFormat',function(object){
    return moment(object).format('hh:mm:ss A')
})

// use middleware

app.use(expressSesion({saveUninitialized:false,resave:false,store:storeSession,secret:process.env.SESSION_SECRET,cookie:{httpOnly:true,maxAge:1000*60*60*24}}))

//passport config
const intializePassport =require('./app/config/passport')
intializePassport(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(flash())

app.set('eventemitter',eventemitter)

//global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.users  = req.user
    next()
})



app.use(express.static(path.join(__dirname,'/public'))); 
hbs.registerPartials(path.join(__dirname,'/resources/views/partials'))

// set template engine
app.set('view engine','hbs') 
app.set('views',path.join(__dirname,'/resources/views')); 


// routes file  
// database connection
require('./app/config/connection')
intiRoutes(app);

const server = app.listen(port,()=>{
    console.log(`This ${port} port number listening.`);
})


// socket.io

const io = require('socket.io')(server)

io.on('connection',function(socket){
    socket.on('join',(id)=>{
        // socket join the private room
        socket.join(id);
    })

    eventemitter.on('orderUpdated',(data)=>{ 
        io.to(data.orderId+'_order').emit('orderUpdated',data)
    })


    eventemitter.on('newOrderAdded',(data)=>{
        io.to('AdminRoom').emit('newOrder',data)
    })
})
