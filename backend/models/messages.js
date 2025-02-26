const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts', required: true },
  name: { type: String, required: true },
  audioBase64: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  transcription: { type: [String], default: [] },
  title: { type: String, required: true }
});

module.exports = mongoose.model('messages', audioSchema);
