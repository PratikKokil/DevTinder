const express =require('express');
const{connectDB}=require('./config/database.js');
const app= express();
const User=require("./models/user.js");
const validator= require('validator');
const{validateSignUpData}=require('./utilis/validation.js');
const bcrypt =require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth.js');

const authRouter= require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");


app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);








connectDB().then(() => {
  console.log("connection established successfully...!!");
  app.listen(7000,() => {
    console.log("Server is listning on port 7000");
    
  }
  )
}
).catch((err) => {
  console.log(err.message);
}
)



