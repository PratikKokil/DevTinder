const jwt =require('jsonwebtoken');
const User =require('../models/user.js');
const userAuth = async (req,res,next) => {
  const cookies =req.cookies;
  const {token} =cookies;
  try {
    if(!token){
      throw new Error("Token is invalid !!!")
    }
  const decodedData =await jwt.verify(token,"Devtinder$750");
   const {_id}=decodedData;
   const user=await User.findById(_id);
   if(!user){
    throw new Error("User does not exsist!!");
   }
   else{
    req.user=user;
    next();
   }
  } catch (error) {
    res.send("Error: "+error.message);
  }

}

module.exports={userAuth};