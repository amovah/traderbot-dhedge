const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  sourceToken: {
    type: String,
    required: true,
  },
  destToken: {
    type: String,
    required: true,
  },
  sourceAmount: {
    type: String,
    required: true,
  },
  conditionTarget: {
    type: String,
  },
  conditionType: {
    type: String,
  },
  conditionPrice: {
    type: String,
  },
  expireAfter: {
    type: Date,
  },
  state: {
    type: String,
    required: true,
    default: 'WAITING',
  },
  txHash: {
    type: String,
  },
  completeTime: {
    type: Date,
  },
  errorMessage: {
    type: String,
  },
  tryCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('trade', schema);
