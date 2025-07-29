const express = require("express");
const cors = require("cors");
require("dotenv").config();

const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");


const app = express();

// Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(hpp()); // Prevent parameter pollution

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Basic Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/tasks", require("./routes/tasks"));

// Server Listening
const PORT = process.env.PORT || 2224;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
