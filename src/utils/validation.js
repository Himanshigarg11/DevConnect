const validator=require("validator")
const validateSignUpData=(req)=>{
    const {firstName,lastName,emailID,password}=req.body
    if(!firstName||!lastName){
       throw new Error("name is not valid")
    }
    if(!validator.isEmail(emailID)){
        throw new Error("email id is not correct")
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password must be strong");
    }
}

// even though all these validation also checked from 
// schema but u can also write here 


const validateEditProfileData=(req)=>{
    const allowedEditFields=[
        "firstName",
        "lastName",
        "gender",
        "age",
        "skills",
        "about",
        "photoURL"
    ];

    const isEditAllowed=Object.keys(req.body).every((fields)=>
        allowedEditFields.includes(fields)
    )
    return isEditAllowed;
}


validateEditPassword=(req)=>{
    const {newPassword}=req.body

     if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Password must be strong");
    }
}
module.exports={
validateSignUpData,
validateEditProfileData,
validateEditPassword
}