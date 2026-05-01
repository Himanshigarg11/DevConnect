const mongoose=require("mongoose")
const validator=require("validator")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
        trim: true
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
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
    phoneNumber:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isMobilePhone(value,"en-IN")){
                throw new Error("phone number is not valid")
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
        min:18,
        max:90
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
        maxLength:300
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

const User=mongoose.model("User",userSchema)
module.exports={User}