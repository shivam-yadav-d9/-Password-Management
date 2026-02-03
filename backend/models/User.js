const mongoose = require("mongoose");

const emailAccessSchema = new mongoose.Schema(
  {
    enabled: Boolean,
    email: String,
    password: String,
  },
  { _id: false }
);

const organizationSchema = new mongoose.Schema(
  {
    email: {
      support: emailAccessSchema,
      info: emailAccessSchema,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    organizationAccess: {
      AgoraFarming: organizationSchema,
      LHCPL: organizationSchema,
      hostinger: {
        enabled: Boolean,
        email: String,
        password: String,
      },
    },

    role: { type: String, default: "user" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
