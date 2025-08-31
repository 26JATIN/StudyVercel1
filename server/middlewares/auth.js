
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../Model/User");
const mongoose = require("mongoose");

dotenv.config();

// first fetch the token
// validate
// then jwt.verify(tojken,jwtsecret)
// then req.user=decode

exports.auth = async (req, res, next) => {
	try {
		console.log("Auth middleware called");
		
		// Check DB connection
		if (mongoose.connection.readyState !== 1) {
			console.log("DB not connected, readyState:", mongoose.connection.readyState);
			return res.status(500).json({ success: false, message: "Database not connected" });
		}
		
		const token =
			req.cookies.token ||
			req.body.token ||
			(req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "") : null);
			
		console.log("Token:", token ? "Present" : "Missing");
		
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {
			if (!process.env.JWT_SECRET) {
				console.log("JWT_SECRET not set");
				return res.status(500).json({ success: false, message: "Server configuration error" });
			}
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			console.log("JWT decoded:", decode);
			
			req.user = decode;
			console.log("User set in req");
		} catch (error) {
			
			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}

		
		next();
	} catch (error) {
		
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};
exports.isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};