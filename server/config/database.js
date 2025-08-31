const mongoose=require("mongoose");
require("dotenv").config();

exports.Connect=async ()=>{
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected to DB");
        return;
    }
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Db Connect Successfully");
    } catch (error) {
        console.log("Failed to connect with db");
        console.error(error);
        throw error; // Throw to handle in caller
    }
};
