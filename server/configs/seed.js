require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { insertDefaultValues } = require("../models/baseModel");
const connectDB = require("./db");

// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/AUTH_DB";

const seedUser = async () => {
  try {
    console.log("Seeding admin user...");

    let adminUser = await User.findOne({ email: "admin@mail.com" });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("1234", 10);

      adminUser = new User({
        fullname: "administrator",
        username: "@admin",
        email: "admin@mail.com",
        password: hashedPassword,
        userType: "Administrator",
        status: {
          isDeleted: false,
          isArchived: false,
        },
      });

      await adminUser.save();
      console.log("Default admin user created with full access.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error seeding user:", error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    // await mongoose.connect(MONGO_URI, {});
    console.log("Connected to MongoDB");

    await insertDefaultValues();
    await seedUser();
    console.log("Seeding completed.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
