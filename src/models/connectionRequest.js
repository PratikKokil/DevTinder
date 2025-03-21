const mongoose = require('mongoose');
const {User} = require("./user");
const connectionRequestSchema = new mongoose.Schema({
   
  fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
  },
 toUserId:{
  type:mongoose.Schema.Types.ObjectId,
  required:true,
  ref:"User",
 },
 status:{
  type:String,
  enum:{
    values:["ignored","interested","accepted","rejected"],
    message: `{VALUE} is incorrect status type`
  },
  required:true,
 }

},
{ 
  timestamps:true,
}); 

const ConnectionRequest= new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);
connectionRequestSchema.index({fromUserId:1},{toUserId:1});

// connectionRequestSchema.pre("save",function(next){
//   const connectionRequest = this;
//   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//     throw new Error("Cannot sent request to yourself!");
//   }
//   next();
// })

module.exports =ConnectionRequest;