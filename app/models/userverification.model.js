const mongoose = require("mongoose");

// const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)?[a-z0-9-]+\.[a-z]{2,}\/?.*$/i;
const Userverify = mongoose.model(
  "UserVerification",
  new mongoose.Schema({
    userId: String,
    uniqueString: String,
    createdOn: Date,
    expiresOn:Date,
    confirmed:Boolean,
  })  
);
module.exports = Userverify;
