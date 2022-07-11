
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_SECRET_KEY)  
.then(()=>{console.log('connect successfully');})
.catch((err)=>{console.log(err);})

