const jwt=require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth= async(req,res,next)=>{
  try{
   // read the token from req cookies
   const cookies=req.cookies;
   const {token}=cookies;
   if(!token){
      return res.status(401).send("you are not loggedIn!!")
   }
   //validate the token
   const decodedMessage=jwt.verify(token,process.env.JWT_SECRET)
   const {userId}=decodedMessage;
   
   //find the user
    const user=await User.findById(userId)
    if(!user){
      throw new Error("user not found")
    }
      req.user=user
      next();
   }
   catch(err){
      res.status(400).send("something wend wrong: "+err.message)
   }

}

module.exports={userAuth}