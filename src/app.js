const express=require("express");
const {connectDB}=require("./config/database")
const app=express();
const {User}=require("./models/user")

app.use(express.json())

// post /signup add user
app.post("/signup", async (req,res)=>{
 const user=new User(req.body)
 try{
    await user.save();
    res.send("user added successfully")
 }
 catch(err){
   res.status(400).send("Something went wrong:"+err.message)
 }

})

// get /usr findOne by email
app.get("/user", async(req,res)=>{
    const userEmail=req.body.emailId
    try{
        const user=await User.findOne({emailId: userEmail})
        if(!user){
            res.status(400).send("NO USER FOUND")
         }
        else{
            res.send(user)
        }
    }
    catch(err){
        res.status(400).send("can't find this user"+err.message)
    }

})

// get /feed  get all user from DB

app.get("/feed", async (req,res)=>{
   try{
     const user=await User.find({})
     if(user.length===0) res.status(400).send("NO USER FOUND")
     else{res.send(user)}
   }
   catch(err){
    res.status(400).send("something went wrong:"+err.message)
   }
    
})

// delete /user by id 
app.delete("/user", async (req,res)=>{
    const userId=req.body.userId;
    
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user){
              res.status(400).send("NO USER FOUND WITH THIS EMAIL")
        }
        else{
            res.send("user Deleted")
        }
    }
    catch(err){
        res.status(400).send("Something went wrong"+err.message)
    }
})

app.patch("/user/:userId",async (req,res)=>{
   const userId=req.params?.userId;
   const data=req.body
   try{
   const ALLOWED_UPDATES=[
    "photoURL","about","skills","age"
   ]
   const isUpdateAllowed=Object.keys(data).every((k)=>
    ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
        throw new Error("update not allowed")
    }
   
      const user = await User.findByIdAndUpdate({_id:userId},data,{
        returnDocument:"before",
        runValidators:true
    });
            res.send("user updated")
    }
    catch(err){
        res.status(400).send("Something went wrong: "+err.message)
    }
})

connectDB()
.then(()=>{
    console.log("connection made successfully")
    app.listen(3000, ()=>{
    console.log("server is sucessfully listening on port 3000")
});
})
.catch(()=>{console.log("Something ERROR occured")}) 

