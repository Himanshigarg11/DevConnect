const express= require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middelware/auth")
const {validateEditProfileData}=require("../utils/validation")
const {validateEditPassword}=require("../utils/validation")
const bcrypt=require("bcrypt")
// get /profile api
profileRouter.get("/profile",userAuth,async (req,res)=>{
    try{
      const user=req.user
      res.send(user)
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

// edit /profile api

profileRouter.patch("/profile",userAuth,async(req,res)=>{
   try{
        if(!validateEditProfileData(req)){
            throw new Error("edit is not allowed!!")
        }
      const loggedInUser=req.user
      Object.keys(req.body).forEach((fields)=>{
        loggedInUser[fields]=req.body[fields]
      })
      await loggedInUser.save();
      res.send({
        message:`${loggedInUser.firstName},your profile updated successfully`,
        data: loggedInUser,
      })
   } 
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

// edit /profile password

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
     try{
     const loggedInUser=req.user
  
     const {currentPassword,newPassword}=req.body
     const isCurrentPassword=await loggedInUser.validatePassword(currentPassword)
     if(!isCurrentPassword){
        throw new Error("current password is wrong")
     }
     validateEditPassword(req)
     const hashedPassword=await bcrypt.hash(req.body.newPassword,10)
     loggedInUser.password=hashedPassword
     await loggedInUser.save();
     res.send("password is updated")
     }
     catch(err){
         res.status(400).send("ERROR: "+err.message)
     }
})

module.exports={profileRouter}
