import jwt from "jsonwebtoken";
import User from "../models/User.js";

function sign(user) {
  return jwt.sign(
    { sub: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  const { email, name, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email in use" });
    const user = new User({ email, name });
    await user.setPassword(password);
    await user.save();
    res.json({
      token: sign(user),
      user: { id: user.id, email, name, role: user.role },
    });
  } catch (err) {
    // Handle duplicate key and validation errors from Mongo/Mongoose
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: "Email in use" });
    }
    if (err && err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
      return res.status(422).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.validatePassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  res.json({
    token: sign(user),
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}

export async function me(req, res) {
  const u = req.user;
  res.json({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    favorites: u.favorites,
  });
}
