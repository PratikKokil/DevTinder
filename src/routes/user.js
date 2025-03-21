const express =require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter =express.Router();
const ConnectionRequest=require("../models/connectionRequest");
const { replaceOne } = require('../models/user');
const User =require("../models/user");
const USER_SAFE_DATA ="firstName lastName gender age about photoUrl skills";


userRouter.get("/user/request/recevied",userAuth,async(req,res) => {
  
  try {
    const loggedInUser =req.user;
    const connectionRequest= await ConnectionRequest.find({
      toUserId:loggedInUser._id,
      status:"interested"
    }).populate("fromUserId",USER_SAFE_DATA);

    res.json({message:"Your connection request",connectionRequest})

  } catch (error) {
    res.status(400).send("ERROR: ",error.message);
  }

}
);
userRouter.get("/user/connections",userAuth,async(req,res) => {
  
  try {
    const loggedInUser=req.user;

    const connectionRequest=await ConnectionRequest.find({
      $or:[
        {fromUserId:loggedInUser._id , status:"accepted"},
        {toUserId:loggedInUser._id,status:"accepted"}
      ]
    }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

    const data = connectionRequest.map(row=>{
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({message:"Your Connections",data});

  } catch (error) {
    res.status(400).send("ERROR: "+error.message);
  
  }
}
);

userRouter.get("/feed",userAuth,async(req,res) => {
  try{
    const loggedInUser=req.user;
    const page =parseInt(req.query.page) || 1;
    const limit =parseInt(req.query.limit) || 10;
    const skip =(page-1)*limit;

    const connectionRequest=await ConnectionRequest.find({
      $or:[ {fromUserId:loggedInUser._id },{toUserId:loggedInUser._id}]
    }).select("fromUserId toUserId ");

    const hiddenUsersFromFeed = new Set();
    connectionRequest.forEach(req => {
      hiddenUsersFromFeed.add(req.fromUserId.toString());
      hiddenUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and:[
        {_id:{$ne:loggedInUser._id}},
        {_id:{$nin:Array.from(hiddenUsersFromFeed)}},
      ],
    }).select(USER_SAFE_DATA)
    .skip(skip).limit(limit);

    res.json({message:"Your Feed",users});
   
  }
  catch(error){
    res.status(400).send("ERROR: "+error.message);
  }
}
);

module.exports= userRouter; 