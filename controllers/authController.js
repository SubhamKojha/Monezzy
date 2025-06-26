const {generateToken}=require('../utils/generateToken')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const userModel=require('../models/user-model')

exports.login=async(req,res)=>{
    res.render("login")
}
exports.create=async(req,res)=>{
    res.render("index")
}
exports.profile=async(req,res)=>{
    let user=await userModel.findOne({email:req.user.email})
    res.render("profile",{user})
}

module.exports.registerUser=async(req,res)=>{
    let{name,phone,email,password}=req.body
    bcrypt.genSalt(10,(err,Salt)=>{
        bcrypt.hash(password,Salt,async(err,hash)=>{
            let create_user=await userModel.create({
                name,
                phone,
                email,
                password : hash
            })
            let token = generateToken(create_user)
            res.cookie("token",token)
            res.redirect("/login")
        })
    })
}

module.exports.loginUser=async(req,res)=>{
    let checking_user=await userModel.findOne({email:req.body.email})
    if(!checking_user){
        res.status(400).send("User not exists")
    }
    bcrypt.compare(req.body.password,checking_user.password,(err,result)=>{
        if(err){
            res.status(400).send("comparison error")
        }
        if(result){
            let token=generateToken(checking_user)
            res.cookie("token",token)
            res.redirect("profile")
        }
        else{
            res.status(400).send("Error occured")
        }
    })
}

exports.uploadImage = async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  user.profilepic = req.file.filename;
  await user.save();
  res.redirect("/profile");
};


