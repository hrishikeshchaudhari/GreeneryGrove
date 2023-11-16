const express=require('express')
const app=express()
const connectDB=require("./db/connect.js")
require('dotenv').config()
const path=require('path')
const route1=require("./routes/routes1.js")
const MongoStore=require('connect-mongo')
// const {initializingPassport} = require('./config/passport-setup-local.js')
const local_auth_routes=require("./routes/local_auth_routes.js")
const auth_routes=require("./routes/auth_routes.js")
const plant_routes=require("./routes/plant_routes.js")
// const passportSetup=require('./config/passport-setup.js')
const cookieSession=require('cookie-session')
const passport=require('passport')
const expressSession=require('express-session')
const keys=require('./config/keys.js')
app.use(express.urlencoded({extended:false}))
app.use(express.json())
// require("./config/passport-setup.js")
// require("./config/passport-setup-local.js")
require("./config/passport_set.js")
app.set('view engine','ejs')


// initializingPassport(passport);
app.use(expressSession({
    secret: 'your-secret-key',
    saveUninitialized: true,
    resave: true,
    store:MongoStore.create({mongoUrl:process.env.MONGO_URI,collectionName:'sessions'}),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 7 days
        // httpOnly: false,
    },
}));
app.use(passport.initialize())
app.use(passport.session())
app.use('/',local_auth_routes);


app.use('/auth',auth_routes)

app.get('/',(req,res)=>{
    if(req.isAuthenticated()){

        res.sendFile(path.join(__dirname,"./index/index.html"))
    }
    else{
        res.redirect("/login")
    }
})

app.use(express.static(__dirname+'/index'))

app.use('/',plant_routes)
//admin page
app.get('/admin',(req,res)=>{
    if(req.isAuthenticated()){
        
        app.use(express.static(__dirname+'/admin'))
        res.sendFile(path.join(__dirname,"./admin/index.html"))
    }
    else{
        res.redirect("/login")
    }
})
//view all

//view one
app.get('/data2',(req,res)=>{
    
        res.sendFile(path.join(__dirname,"./index/productdetaill.html"))
   
})
app.use('/admin',plant_routes)
//routes for admin page and user handling
// app.use('/admin',route1);
const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(3000,()=>{
            console.log("server is running...")
        })
    } catch (error) {
        console.log(error)
    }
}
start()