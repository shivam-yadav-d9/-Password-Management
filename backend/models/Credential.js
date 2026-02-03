const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      enum: ["AgoraFarming", "LHCPL", "hostinger"],
      required: true,
    },
    type: {
      type: String, // support | info | global
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Credential", credentialSchema);
