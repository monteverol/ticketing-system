import db from "../db/index.js";
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Respond with user data (no password)
    const { password: _, ...userInfo } = user;
    res.json(userInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
