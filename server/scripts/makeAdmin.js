const mongoose = require("mongoose");
const User = require("../models/User");

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://kanugulajyothsna:0muCVSEV9VnmhtUv@cluster0.tkstb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected for admin update"))
  .catch((error) => console.log(error));

// Function to make a user an admin
async function makeUserAdmin(email) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found!");
      return;
    }

    user.role = "admin";
    await user.save();
    console.log(`User ${email} is now an admin!`);
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log("Please provide an email address!");
  process.exit(1);
}

makeUserAdmin(email);