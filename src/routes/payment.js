const express=require("express")
const paymentRouter=express.Router();
const {userAuth}=require("../middelware/auth")
const RazorPayInstance=require("../utils/razorPay")
const Payment=require("../models/payment")
const {membershipAmount}=require("../utils/constants")
paymentRouter.post("/payment/create",userAuth,async (req,res)=>{
     try{
      const user=req.user
      const {firstName,lastName,_id,emailID}=user
      const {membershipType}=req.body
        const order=await RazorPayInstance.orders.create({
               "amount":membershipAmount[membershipType]*100,
               "currency":"INR",
                "receipt":"receipt#1",
                "partial_payment":false,
                "notes":{
                    "firstName":firstName,
                    "lastName":lastName,
                    "emailId":emailID,
                    "membershipType":membershipType,
                },
             });

             const payment=new Payment({
               userId: _id,
               orderId: order.id,
               status: order.status,
               amount: order.amount,
               currency: order.currency,
               receipt: order.receipt,
               notes:order.notes,
             })

             const savedPayment=await payment.save();
             res.json({
               ...savedPayment.toJSON(),
               keyId:process.env.RAZORPAY_KEY_ID
            });
     }
     catch(err){
        res.status(400).send("ERROR: "+err.message)
     }
})

module.exports={paymentRouter};