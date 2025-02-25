const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  aud: String,
  azp: String,
  email: String,
  email_verified: Boolean,
  exp: Number,
  given_name: String,
  iat: Number,
  iss: String,
  jti: String,
  name: String,
  nbf: Number,
  picture: String,
  sub: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('accounts', userSchema);
