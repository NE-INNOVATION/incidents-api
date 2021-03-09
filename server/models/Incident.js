const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IncidentSchema = new Schema({
  quoteId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  driver: {
    type: String,
    required: true,
  },
  responsible: {
    type: String,
    required: true,
  },
  when: {
    type: Date,
    required: true,
  },
});

module.exports = Incident = mongoose.model("incidents", IncidentSchema);
