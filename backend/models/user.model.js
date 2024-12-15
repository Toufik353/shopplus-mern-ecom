const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String, unique: true },
  password: { type: String, required: true },
  addresses: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
          ref: "Address"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
