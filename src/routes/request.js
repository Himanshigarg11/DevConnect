const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middelware/auth")
const {ConnectionRequest}=require("../models/connectionRequest")
const {User}=require("../models/user")
// post api /sendConnectionRequest
requestRouter.post("/request/send/:status/:touserId",userAuth,async (req,res)=>{
    try{
      const fromUserId=req.user._id
      const toUserId=req.params.touserId
      const status=req.params.status
      
      const allowedStatus=["interested","ignored"]
      if(!allowedStatus.includes(status)){
       return res.status(400).json({message:"invalid status type: "+status})
      }
      if(fromUserId.toString() === toUserId){
      throw new Error("You cannot send request to yourself");
}
       const existingConnectionRequest=await ConnectionRequest.findOne({
                  $or:[
                      {fromUserId,toUserId},
                      {fromUserId:toUserId,toUserId:fromUserId}
                  ]
                })
                if(existingConnectionRequest){
                  throw new Error("connection request already exist, you cant send request to: "+toUserId)
                }
      
      const toUser=await User.findById(toUserId)
      if (!toUser) {
      throw new Error("User not found");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });
      await connectionRequest.save();
      res.json({
        message:req.user.firstName+" is "+status+" in "+toUser.firstName,
        data:connectionRequest,
      })
    }
    catch(err){
        res.status(400).send("Error: "+err.message)
    }
})


// review request 

requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
  try{
      const loggedInUser=req.user
      const status=req.params.status
      const requestId=req.params.requestId
       
      const allowedStatus=["accepted","rejected"]
      if(!allowedStatus.includes(status)){
       return res.status(400).json({message:"invalid status type: "+status})
      }

      const connectionRequest=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
      })
      if(!connectionRequest){
        throw new Error("connection request not found")
      }

      connectionRequest.status=status
      await connectionRequest.save();
      res.json({
        message:"connection request "+status,
        data: connectionRequest
      })
  }
  catch(err){
     res.status(400).send("Error: "+err.message)
  }
})

module.exports={requestRouter}