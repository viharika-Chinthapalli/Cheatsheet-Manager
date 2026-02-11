/**
 * Mongoose model for cheatsheets data.
 * Stores the full courses tree (Course → Module → Unit → Cheatsheet) in a single document
 * for simple GET/POST API compatibility and easy deployment.
 */

const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cheatsheet: { type: String, default: '' },
  },
  { _id: false }
);

const moduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    units: [unitSchema],
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    modules: [moduleSchema],
  },
  { _id: false }
);

const cheatsheetsSchema = new mongoose.Schema(
  {
    courses: {
      type: [courseSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cheatsheets', cheatsheetsSchema);
