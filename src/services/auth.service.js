import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";

function sign(user) {
  return jwt.sign({ sub: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export const authService = {
  async register({ email, name, password }) {
    const exists = await userRepository.findByEmail(email);
    if (exists) return { error: { status: 400, message: "Email in use" } };
    const user = await userRepository.create({ email, name });
    await user.setPassword(password);
    try {
      await userRepository.save(user);
    } catch (err) {
      if (err && err.code === 11000 && err.keyPattern?.email) {
        return { error: { status: 400, message: "Email in use" } };
      }
      if (err && err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
        return { error: { status: 422, message: "Validation failed", errors } };
      }
      return { error: { status: 500, message: "Registration failed" } };
    }
    return {
      token: sign(user),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.validatePassword(password))) {
      return { error: { status: 400, message: "Invalid credentials" } };
    }
    return {
      token: sign(user),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  },
};


