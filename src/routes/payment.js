const express=require("express")
const paymentRouter=express.Router();
const {userAuth}=require("../middelware/auth")
const RazorPayInstance=require("../utils/razorPay")
const Payment=require("../models/payment")
const User=require("../models/user")
const {membershipAmount}=require("../utils/constants")
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

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

paymentRouter.post("/payment/webhook",async(req,res)=>{
  try{
      console.log("Webhook route hit");
        const webhookSignature=req.get("x-razorpay-signature")
        console.log("Signature:", webhookSignature);
 console.log("Raw Body:",
         req.body.toString()
      );
        const isWebhookValid=validateWebhookSignature(req.body.toString(),
                         webhookSignature,
                         process.env.RAZORPAY_WEBHOOK_SECRET)

                           console.log("Webhook Valid:",
         isWebhookValid
      );

              if(!isWebhookValid){
                return res.status(400).json({msg:"webhook signature is invalid"})
              }
              const body = JSON.parse(req.body.toString());
                console.log("Parsed Body:", body);
              const paymentDetails=body.payload.payment.entity;
              const payment=await Payment.findOne({orderId:paymentDetails.order_id})
                console.log("Payment Found:", payment);
              if(!payment){
               return res.status(404).json({msg:"Payment not found"})
}
              payment.status = paymentDetails.status
              await payment.save()
 console.log("Payment Updated");
              const user=await User.findOne({_id:payment.userId})
              console.log("User Found:", user);
              user.isPremium=true;
              user.membershipType=payment.notes.membershipType
               console.log("User Updated");
              await user.save()
         
              res.status(200).json({msg:"webook received successfully"})
  }
  catch(err){
         res.status(400).send("ERROR: "+err.message)
  }
})

module.exports={paymentRouter};