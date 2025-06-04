// controllers/authController.js
import bcrypt from "bcrypt";
import { User } from "../models/index.js";   // ⬅️ correct named import

const JWT_SECRET = process.env.JWT_SECRET || "replace_with_strong_secret";

// POST /api/auth/register (if you choose to add registration)
export const register = async (req, res) => {
  try {
    const { username, password, department, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, department, role });
    res.status(201).json({ user_id: user.user_id, username, department, role });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });  // now User is defined
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({
      user_id: user.user_id,
      username: user.username,
      role: user.role,
      department: user.department,
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: err.message });
  }
};
