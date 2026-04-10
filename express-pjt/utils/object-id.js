const mongoose = require("mongoose");

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function toObjectId(value) {
  return new mongoose.Types.ObjectId(value);
}

function isSameId(a, b) {
  if (!a || !b) return false;
  return String(a) === String(b);
}

module.exports = {
  isValidObjectId,
  toObjectId,
  isSameId,
};
