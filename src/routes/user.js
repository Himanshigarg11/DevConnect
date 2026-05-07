const express=require("express");
const userRouter=express.Router();
const {userAuth}=require("../middelware/auth")
const {ConnectionRequest}=require("../models/connectionRequest")
const {User}=require("../models/user");
const { connection } = require("mongoose");


const SAFE_USER_DATA="firstName lastName age gender about skills photoUrl"

// /get all the pending connection request for logged in user

userRouter.get("/user/requests",userAuth,async (req,res)=>{
    try{
       const loggedInUser=req.user 
       const connectionRequest=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
       }).populate("fromUserId",SAFE_USER_DATA)
       if(!connectionRequest){
        throw new Error("No request found")
       }
       res.json({
        message:"these are your requestes",
        data:connectionRequest
       })
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user
         const connectionRequest=await ConnectionRequest.find({
        $or:[
            { toUserId:loggedInUser._id, status:"accepted" },
            { fromUserId:loggedInUser._id,status:"accepted" }
        ]
       })
       .populate("fromUserId",SAFE_USER_DATA)
       .populate("toUserId",SAFE_USER_DATA)
        if(!connectionRequest){
        throw new Error("make connections first")
       }
       console.log(connectionRequest)
      const data=connectionRequest.map((row)=>{
        if(row.fromUserId._id.equals(loggedInUser._id)){
            return row.toUserId
        }
            return  row.fromUserId

        });
       res.json({
        message:"these are your connections",
        data:data
       })

    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})


userRouter.get("/feed",userAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user
       // find all connection Request (send request+ received request) 

       const connectionRequest=await ConnectionRequest.find({
        $or:[
             {fromUserId:loggedInUser._id},
             {toUserId:loggedInUser._id}
        ]
       })
       .select("fromUserId toUserId status")
       
       const hideUsersFromFeed=new Set();
        connectionRequest.forEach((req)=>{
        hideUsersFromFeed.add(req.toUserId.toString())
        hideUsersFromFeed.add(req.fromUserId.toString())
       })
      console.log(hideUsersFromFeed)

      const users=await User.find({
        $and:[
             {_id: {$nin: Array.from(hideUsersFromFeed)}},
             {_id:  {$ne:loggedInUser._id} }
        ]
       
      }).select(SAFE_USER_DATA)
       res.send(users)
    }
    catch(err){ 
       res.status(400).send("Error: "+err.message) 
    }
})



module.exports={userRouter}