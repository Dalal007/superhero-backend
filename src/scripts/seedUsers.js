import "dotenv/config";
import User from "../models/User.js";
import { connectDB } from "../lib/db.js";

(async () => {
  await connectDB();
  
  // Check if admin user already exists
  const existingAdmin = await User.findOne({ email: "admin@admin.com" });
  
  if (!existingAdmin) {
    const adminUser = new User({
      email: "admin@admin.com",
      name: "Admin User",
      passwordHash: "$2a$10$JRaR3AVCkXuOJhR4sUYj1ua4Y0JmciBnPm0GEfVkSkOB9DQAHz.yW",
      role: "admin"
    });
    
    await adminUser.save();
    console.log("Admin user created successfully");
  } else {
    console.log("Admin user already exists");
  }
  
  process.exit(0);
})();
