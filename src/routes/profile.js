const express=require('express');
const profileRouter=express.Router();
const { userAuth } = require('../middlewares/auth.js');
const {validateProfileEditData} = require('../utilis/validation.js');
const User=require("../models/user.js");
const validator= require('validator');
const bcrypt =require('bcrypt');

profileRouter.get("/profile/view",userAuth,async (req,res) => {
  try {
     const user=req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: "+ error.message);
  }

})
profileRouter.post("/profile/edit",userAuth,async(req,res) => {
  try {
    if(!validateProfileEditData(req)){
      throw new Error("invalid credentials")
    }

    const loggedInUser =req.user;
    
    Object.keys(req.body).forEach(key => (loggedInUser[key]=req.body[key]));
 
    await loggedInUser.save();
    res.json({message:`${loggedInUser.firstName}, your profile has been updated successfully!`,data:loggedInUser});
  } catch (error) {
    res.status(404).send("ERROR: "+error.message);
  }
}
)
profileRouter.post("/profile/password",userAuth,async(req,res) => {
   const loggedInUser =req.user;
   const oldPasswordByLoggedInUser = req.body.oldPassword;
   const newPasswordByLoggedInUser = req.body.newPassword;
  try {
    const isPasswordValid= await loggedInUser.valiDatePassword(oldPasswordByLoggedInUser);

    if(!isPasswordValid){
     throw new Error("Old password is not valid!")
    }
    else{
      if(!validator.isStrongPassword(newPasswordByLoggedInUser)){
        throw new Error("Please Enter a strong password")
      }
      else{
        const passwordHash = await bcrypt.hash(newPasswordByLoggedInUser,10);
        loggedInUser.password=passwordHash;
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName},your password has been updated !!`);
      }
    }
  } catch (error) {
    res.status(400).send('ERROR: '+error.message);
  }


}
)


module.exports=profileRouter;