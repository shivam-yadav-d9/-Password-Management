const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Credential = require("../models/Credential");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * ================= ADMIN LOGIN =================
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
});

/**
 * ================= CREATE USER (ADMIN ONLY) =================
 * Plain password + inject org email credentials
 */
router.post("/create-user", auth("admin"), async (req, res) => {
  try {
    const { fullName, email, password, organizationAccess } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    /**
     * 🔹 Helper to inject credentials
     */
    const injectCredential = async (org, type, target) => {
      const cred = await Credential.findOne({ organization: org, type });
      if (!cred) return;
      target.email = cred.email;
      target.password = cred.password;
    };

    /**
     * ================= AGORA FARMING =================
     */
    if (organizationAccess?.AgoraFarming?.email?.support?.enabled) {
      await injectCredential(
        "AgoraFarming",
        "support",
        organizationAccess.AgoraFarming.email.support
      );
    }

    if (organizationAccess?.AgoraFarming?.email?.info?.enabled) {
      await injectCredential(
        "AgoraFarming",
        "info",
        organizationAccess.AgoraFarming.email.info
      );
    }

    /**
     * ================= LHCPL (FIXED) =================
     */
    if (organizationAccess?.LHCPL?.email?.support?.enabled) {
      await injectCredential(
        "LHCPL",
        "support",
        organizationAccess.LHCPL.email.support
      );
    }

    if (organizationAccess?.LHCPL?.email?.info?.enabled) {
      await injectCredential(
        "LHCPL",
        "info",
        organizationAccess.LHCPL.email.info
      );
    }

    /**
     * ================= HOSTINGER =================
     */
    if (organizationAccess?.hostinger?.enabled) {
      const cred = await Credential.findOne({
        organization: "hostinger",
        type: "global",
      });

      if (cred) {
        organizationAccess.hostinger.email = cred.email;
        organizationAccess.hostinger.password = cred.password;
      }
    }

    /**
     * ================= CREATE USER =================
     */
    const user = await User.create({
      fullName,
      email,
      password, // ⚠️ plain password (as you requested)
      organizationAccess,
      role: "user",
      isActive: true,
    });

    res.json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User creation failed" });
  }
});

/**
 * ================= GET ALL USERS =================
 */
router.get("/users", auth("admin"), async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * ================= DELETE USER =================
 */
router.delete("/users/:id", auth("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});


/**
 * ================= GET ORGANIZATION CREDENTIALS =================
 * ADMIN ONLY
 */
router.get(
  "/organization-credentials",
  auth("admin"),
  async (req, res) => {
    try {
      const creds = await Credential.find();

      const response = {
        AgoraFarming: { email: { support: {}, info: {} } },
        LHCPL: { email: { support: {}, info: {} } },
        hostinger: {},
      };

      creds.forEach((c) => {
        if (c.organization === "hostinger") {
          response.hostinger = {
            email: c.email,
            password: c.password,
          };
        } else {
          response[c.organization].email[c.type] = {
            email: c.email,
            password: c.password,
          };
        }
      });

      res.json(response);
    } catch (err) {
      console.error("ORG CRED ERROR:", err);
      res.status(500).json({ message: "Failed to fetch credentials" });
    }
  }
);

/**
 * ================= UPDATE ORGANIZATION CREDENTIAL =================
 * ADMIN ONLY
 */
router.put(
  "/organization-credentials",
  auth("admin"),
  async (req, res) => {
    try {
      const { organization, type, email, password } = req.body;

      if (!organization || !type || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const cred = await Credential.findOneAndUpdate(
        { organization, type },
        { email, password },
        { new: true }
      );

      if (!cred) {
        return res.status(404).json({ message: "Credential not found" });
      }

      res.json({ message: "Credential updated successfully" });
    } catch (err) {
      console.error("UPDATE CRED ERROR:", err);
      res.status(500).json({ message: "Update failed" });
    }
  }
);



module.exports = router;
