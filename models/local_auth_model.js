const mongoose=require('mongoose')
const TaskSchema=new mongoose.Schema({
    
    user_name:{
        type:String
    },
    name:{
        type:String
    },
    cpassword:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:String
    },
    address:{
        type:String
    }

})
module.exports=mongoose.model('User2',TaskSchema)