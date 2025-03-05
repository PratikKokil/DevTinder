const mongoose = require("mongoose");

const connectDB=async () => {
 await mongoose.connect("mongodb+srv://kokilpratik220:EV4CRSJDaXeRfKQO@namastenode.sgsuq.mongodb.net/devTinder");
}


module.exports={connectDB};