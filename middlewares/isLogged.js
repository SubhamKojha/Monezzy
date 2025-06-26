const jwt=require('jsonwebtoken')
function isLogged(req,res,next){
    if(req.cookies.token === ""){
        res.status(400).send("You need to login")
    }
    else{
        
        let data=jwt.verify(req.cookies.token,process.env.JWT_KEY)
        req.user = data
        next();
    }
}
module.exports= isLogged;