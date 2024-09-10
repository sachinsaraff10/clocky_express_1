const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.emailverification = require("./userverification.model");
const websites=require("./websites.model");
db.sites=websites.Sites
db.website=websites.Website;
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;