const express=require('express');
const requestRouter=express.Router();
const { userAuth } = require('../middlewares/auth.js');


requestRouter.post("/sentConnectionRequest",userAuth,(req,res) => {
  try {
    const user=req.user;
    res.send("Connection request is sent by "+user.firstName+" "+user.lastName);
  } catch (error) {
    res.status(400).send(error.message);
  }
}
)

module.exports=requestRouter;