const mongoose=require("mongoose");
const {User}=require("./user")
const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    toUserId:{
       type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       required:true,
    },
    status:{
        type:String,
        enum:{
            values:["ignored", "interested" , "accepted" , "rejected"],
            message:"{VALUE} status is not defined"
        },
        required:true,
    }
}, 
{
    timestamps:true,
});

connectionRequestSchema.pre("save",async function(){
    const connectionRequest=this;
    const {fromUserId,toUserId} =connectionRequest
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you can send request to yourself")
    }
     const isToUserIdExist=await User.findById(connectionRequest.toUserId)
            if(!isToUserIdExist){
            throw new Error("this user not exist")
          }
})

connectionRequestSchema.index({fromUserId:1, toUserId:1})

const ConnectionRequest=new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports={ConnectionRequest}