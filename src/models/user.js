const mongoose = require('mongoose');
const validator= require('validator');
const jwt =require('jsonwebtoken');
const bcrypt =require('bcrypt');

const userSchema = new mongoose.Schema({
   firstName:{
    type:String,
    required:true,
    minLength:3,
    maxLength:30,
   },
   lastName:{
    type:String,
    minLength:3,
    maxLength:30,
   },
   emailId:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value)){
         throw new Error("Invalid email:"+value)
      }
    }
   },
   password:{
    type:String,
    required:true,
    validate(value){
      if(!validator.isStrongPassword(value)){
         throw new Error("Enter a strong password:"+value)
      }
    }
   },
   age:{
    type:Number,
    required:true,
    min:18,
   },
   gender:{
    type:String,
    required:true,
    validate(value){
      if(!["male","female","other"].includes(value)){
         throw new Error("Gender data is not valid..!!");
      }
    }
   },
   photoUrl:{
      type:String,
      default:"https://imgs.search.brave.com/B_007OrR9eaWJenb736UiExgsQuLsEBMBBWkKs2A_Ao/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/a2luZHBuZy5jb20v/cGljYy9tLzI1Mi0y/NTI0Njk1X2R1bW15/LXByb2ZpbGUtaW1h/Z2UtanBnLWhkLXBu/Zy1kb3dubG9hZC5w/bmc",
      validate(value){
       if(!validator.isURL(value)){
          throw new Error("Invalid photoURL:"+value)
      }
    } 
   },
   about:{
     type:String,
     default:"I am tech Enthusiast..."
   },
   skills:{
      type:[String],
   },

},{
   timestamps:true
})

userSchema.methods.getJWT = async function () {
   const user =this;
    const token =await jwt.sign({_id:user._id},"Devtinder$750",{expiresIn:"7d"});
    return token;
}

userSchema.methods.valiDatePassword = async function(passwordInputByUser){
   const user = this;
   const passwordHash =user.password;
   const isValidPassword= await bcrypt.compare(passwordInputByUser,passwordHash);
   return isValidPassword;
}

module.exports=mongoose.model("User",userSchema);