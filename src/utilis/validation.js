const validator= require('validator');

const validateSignUpData = (req) => {
  const {firstName,lastName,emailId,password,about,skills}=req.body;

  if(!firstName || !lastName){
    throw new Error("first and lastname are required!");
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("EmailId is not valid!");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password!");
  }
  else if(about?.length>100){
    throw new Error("Please be specific while writing about section")
  }
  else if(skills?.length>10){
    throw new Error("More than 10 skills are not allowed..")
  }
}

const validateProfileEditData=(req) =>{
 

    const allowedEditData=[
     "firstName",
     "lastName",
     "age",
     "gender",
     "photoUrl",
     "about",
     "skills",
     "emailId"
    ];

  return Object.keys(req.body).every(key=> allowedEditData.includes(key));


}
module.exports={validateSignUpData,validateProfileEditData};
