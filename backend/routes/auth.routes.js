const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * USER LOGIN — NO bcrypt
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isActive) {
    return res.status(401).json({ message: "User not found or inactive" });
  }

  // ✅ SIMPLE PASSWORD CHECK
  if (password !== user.password) {
    return res.status(401).json({ message: "Wrong password" });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

/**
 * GET LOGGED-IN USER
 */
router.get("/me", auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
