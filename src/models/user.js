const mongoose=require("mongoose")
const validator=require("validator")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"],
        minLength:[3,"First name must be at least 3 characters"],
        maxLength:[20,"First name cannot exceed 20 characters"],
        trim: true
    },
    lastName:{
        type:String,
        required:[true,"Last name is required"],
        minLength:[3,"Last name is required"],
        maxLength:[20,"Last name must be at least 3 characters"],
        trim: true
    },
    emailID:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("emailId is not correct"+value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password must be 8+ chars with uppercase, lowercase, number & symbol")
            }
        }
    },
    age:{
        type:Number,
        min:[18,"Age must be at least 18"],
        max:[90,"Age cannot exceed 90"]
    },
    gender:{
       type:String,
       validate(value){
        if(value !== "male" && value !== "female" && value !== "other"){
             throw new Error ("gender is not valid")
        }
       },
       default:"other"
    },
    photoURL:{
        type:String,
        default:"https://hancockogundiyapartners.com/wp-content/uploads/2019/07/dummy-profile-pic-300x300.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("photo url is nor correct")
            }
        }
    },
    about:{
        type:String,
        default:"this is a default about of the user!",
        maxLength:250
    },
    skills:{
        type:[String],
        validate(arr){
            if(arr.length>10){
                throw new Error("maximum 10 skills you can add")
            }
        },
        trim: true,
        lowercase:true,
    }
    
},{
    timestamps:true,
})


userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({userId:user._id},process.env.JWT_SECRET,
                {expiresIn:"7d"});
    return token; 
}

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const actualPassword=user.password
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,actualPassword)
    return isPasswordValid;
}
const User=mongoose.model("User",userSchema)
module.exports={User}