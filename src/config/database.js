const mongoose=require("mongoose");
async function connectDB(){
    const connection=await mongoose.connect(process.env.MONGO_URI)
}
module.exports={connectDB}





