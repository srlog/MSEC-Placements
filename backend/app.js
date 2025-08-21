const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const sequelize = require("./config/db");
const allRoutes = require("./routes/index");

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Health check route
app.get("/", (req, res) => {
	res.send("Server is running!!");
});

// API routes
app.use("/api/", allRoutes);

// Database sync
async function syncDb() {
	try {
		console.log("Syncing database...");
		await sequelize.sync({ alter: true }); // keeps data
		console.log("Database sync complete ✅");
	} catch (error) {
		console.error("Error initializing database:", error.message, error.stack);
	}
}

// Global error handler (for Express routes)
app.use((err, req, res, next) => {
	console.error("Express Error:", err.message, err.stack);
	res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Catch unhandled Promise rejections
process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection:", reason);
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err.message, err.stack);
});

// Start server after DB sync
syncDb().then(() => {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(
			`🚀 Server is running on port ${PORT} at http://localhost:${PORT}`
		);
	});
});

// app.listen(process.env.PORT, () => {
//   console.log(
//     `Server is running on port ${process.env.PORT} at http://localhost:${process.env.PORT}`
//   );
// });
