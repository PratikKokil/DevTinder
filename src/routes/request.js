const express=require('express');
const requestRouter=express.Router();
const { userAuth } = require('../middlewares/auth.js');
const ConnectionRequest = require('../models/connectionRequest.js');
const User = require('../models/user.js');

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res) => {
  try {
    const fromUserId=req.user._id;
    const toUserId = req.params.toUserId;
    const status =req.params.status;

    const allowedStatus=["ignored","interested"];

    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"invalid status type"});
    }
    
    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(400).json({message:"User does not exist"});
    }

    const existingConnection =await ConnectionRequest.findOne({
      $or:[
        {fromUserId:fromUserId,toUserId:toUserId},{fromUserId:toUserId,toUserId:fromUserId},
      ],
    })
    if(existingConnection){
      return res.status(400).json({message:"Connection is already exist!!"});
    }
    if(fromUserId.equals(toUserId)){
      throw new Error("Cannot sent request to yourself!")
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });
    
    const data = await connectionRequest.save();
    res.json({message:`Coonection request sent successfully`,data:data});


  } catch (error) {
    res.status(400).send(error.message);
  }
}
)



module.exports=requestRouter;