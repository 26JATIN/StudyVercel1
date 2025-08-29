const mongoose=require("mongoose");
require("dotenv").config();

exports.Connect=()=>{
mongoose.connect(process.env.DATABASE_URL)
.then(()=>{
    console.log("Db Connect Successfully");
})
.catch((error)=>{
    console.log("Failed to connect with db");
    console.error(error);
    // Don't exit process in serverless environment
    // process.exit(1);
})
};
