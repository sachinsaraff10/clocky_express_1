const mongoose = require("mongoose");
const Website  = require("./websites.model").Website;


// const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)?[a-z0-9-]+\.[a-z]{2,}\/?.*$/i;
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    confirmed:Boolean,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      },
      ]
,

websites: [{type: mongoose.Schema.Types.ObjectId,
  ref: 'Website'}]
  })
);
module.exports = User;
