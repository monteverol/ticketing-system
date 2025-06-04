// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index.js';

dotenv.config();
const { User } = db;

// This middleware checks for a Bearer‐token in Authorization header,
// verifies it, and then sets req.user = { user_id, username, … }.
export const requireAuth = async (req, res, next) => {
  try {
    // 1) Look for “Authorization: Bearer <token>”
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing auth token' });
    }

    // 2) Verify JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //    (Adjust algorithm/options to what you used when signing.)

    // 3) Fetch the user from DB (optional, but it lets you confirm they still exist)
    const user = await User.findByPk(payload.user_id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 4) Attach the user object (or just user_id) to req.user
    req.user = {
      user_id: user.user_id,
      username: user.username,
      department: user.department,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error('requireAuth error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};