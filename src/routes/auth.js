const express=require('express');
const authRouter=express.Router();
const User=require("../models/user.js");
const validator= require('validator');
const{validateSignUpData}=require('../utilis/validation.js');
const bcrypt =require('bcrypt');



authRouter.post("/signUp",async(req,res) => {
 
  try {
    // validate the data
    validateSignUpData(req);
    const{firstName,lastName,age,emailId,password,gender}=req.body;
    //encrypting password
    const passwordHash = await bcrypt.hash(password,10);

    const newUser= new User({
      firstName,
      lastName,
      age,
      password:passwordHash,
      emailId,
      gender,
    });
    await newUser.save();
    res.send("User added successfully...")
  } catch (error) {
    res.status(400).send("Error: "+error.message);
  }
}
)
authRouter.post("/login",async(req,res) => {
  const {emailId ,password} =req.body;

 try {
  const user= await User.findOne({emailId:emailId});

  if(!user){
    throw new Error ("Please enter the valid emilId...")
  }

  const isPasswordValid= await user.valiDatePassword(password);

  if(isPasswordValid){
   const token =await user.getJWT();
   res.cookie("token",token);
   res.send("Logged in sucessfully");
  }
  else{
   throw new Error("Password is incorrect!!");
  }
} catch (error) {
  res.status(400).send("Error: "+error.message);
}
}
)
authRouter.post("/logout",(req,res) => {
  res.cookie("token",null,{
    expires:new Date(Date.now()),
  })
  res.send("You have logged out successfully");
}
)

module.exports=authRouter;