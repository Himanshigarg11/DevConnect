const express=require("express");
const {connectDB}=require("./config/database")
const app=express();
require("dotenv").config();
const cookieParser=require("cookie-parser")
const cors=require("cors")
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(cookieParser())
app.use(express.json())

const {authRouter}=require("./routes/auth")
const {profileRouter}=require("./routes/profile")
const {requestRouter}=require("./routes/request")
const {userRouter}=require("./routes/user")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

connectDB()
.then(()=>{
    console.log("connection made successfully")
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=>{
    console.log(`server is successfully listening on port ${PORT}`)
});
})
.catch(()=>{console.log("Something ERROR occured")}) 

