const express = require("express");
const app = express();
console.log("Express app created");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

// Load environment variables
dotenv.config();
console.log("Environment variables loaded");

const PORT = process.env.PORT || 4000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

// Initialize database connection
database.Connect().catch((err) => {
    console.error("Database connection failed:", err);
});

console.log("Database connection initiated");

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(
	fileUpload({
		useTempFiles: true,
	})
);

// Connect to Cloudinary
cloudinaryConnect();
console.log("Cloudinary connected");

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

console.log("Routes added");

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Welcome To StudyNotion",
	});
});

// Export the app for Vercel
module.exports = app;

// Only listen when not in production (for local development)
if (process.env.NODE_ENV !== "production") {
	app.listen(PORT, () => {
		console.log(`App is listening at ${PORT}`);
	});
}
