require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./configs/db");
const http = require("http");
const { Server } = require("socket.io");
const initSocket = require("./socket");
const session = require("express-session");
const passport = require("./configs/passport");

const app = express();
const PORT = process.env.PORT || 3000;

// Convert comma-separated origins into an array
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

// Session configuration (place before passport middleware)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "f861228f4ec85918ca8baf9dbfaba473",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// // Create an HTTP server
// const server = http.createServer(app);
// // Initialize Socket.IO with the server
// const io = initSocket(server);

app.use(express.json());
app.get("/persona/api", (req, res) => {
  res.send("BACKEND IS RUNNING");
});

//routes
const authRoutes = require("./routes/authRoutes");
const baseRoutes = require("./routes/baseRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/persona/api/auth", authRoutes);
app.use("/persona/api/user", userRoutes);
app.use("/persona/api/base", baseRoutes);

//MongoDB connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
