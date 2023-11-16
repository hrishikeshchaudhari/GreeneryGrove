const mongoose=require('mongoose')
const TaskSchema=new mongoose.Schema({
    upname:String,
    name: {
        type: String,
        required: true,
    },
    url:{
        type:String
    },
    price: {
        type: Number,
        // required: true,
    },
    description: String,
    stock: String,

    whatYouGet: {
        pot: String,
        plant: String,
    },
    quickFacts: {
        knownAs: String,
        growingDifficulty: String,
        light: String,
        water: String,
        airPurifying: String,
      },
})
module.exports=mongoose.model('Plant',TaskSchema)