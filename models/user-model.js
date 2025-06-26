const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    password:String,
    profilepic:{
        type:String,
        default: "default.webp",
    },
})
let users=mongoose.model("user",userSchema)
module.exports = users;