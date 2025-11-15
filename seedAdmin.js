const mongoose = require("mongoose");
const User = require("./src/models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await User.findOne({ email: "admin@gmail.com" });

  if (!admin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      isAdmin: true
    });

    console.log("Admin created successfully");
  } else {
    console.log("Admin already exists");
  }

  mongoose.connection.close();
}

createAdmin();
