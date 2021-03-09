const express = require("express");
const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Incident = require("../models/Incident");

// @route   GET api/incidents/incidentInfo/:quoteId
// @desc    Get Incident
// @access  Private
router.get("/incidents/incidentInfo/:quoteId", async (req, res) => {
  try {
    res.json({});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/incidents/incidentInfo/:quoteId
// @desc    Create or update an incident
// @access  Private
router.post(
  "/incidents/incidentInfo/:quoteId",
  [
    [
      check("category", "Category is required").not().isEmpty(),
      check("driver", "Driver is required").not().isEmpty(),
      check("quoteId", "Quote ID is required").not().isEmpty(),
      check("responsible", "Who is responsible is required").not().isEmpty(),
      check("when", "Incident Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quoteId, category, driver, responsible, when } = req.body;

    try {
      const incident = new Incident({
        quoteId,
        category,
        driver,
        responsible,
        when,
      });

      await incident.save();

      res.json({ quoteId });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/incidents/incidentInfo/:id?
// @desc    Delete incident by Id
// @access  Private
router.delete("/incidents/incidentInfo/:id?", async (req, res) => {
  try {
    res.json({ msg: "Incident deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
