const mongoose = require("mongoose");

// Create Schema
const Contact = mongoose.model("contact", {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  noHP: {
    type: String,
    required: true,
  },
});

module.exports = Contact;
