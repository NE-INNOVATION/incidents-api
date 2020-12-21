const express = require("express");
var rn = require("random-number");
const router = express.Router({ mergeParams: true });
const dataStore = require("../../data/dataStore");
const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

var gen = rn.generator({
  min: 100000000,
  max: 999999999,
  integer: true,
});

router
  .route("/incidentInfo/:quoteId/:incidentId?")
  .get(async (req, res) => {
    logger.info(
      `app.api.incidents - getting incident with id - ${req.params.incidentId}`
    );
    res.send(
      JSON.stringify(
        await getIncidentInfo(req.params.incidentId, req.params.quoteId)
      )
    );
  })
  .post(async (req, res) => {
    logger.info(`app.api.incidents - creating new driver`);
    res.send(
      JSON.stringify({
        result: await saveIncidentInfo(req.body, req.params.quoteId),
      })
    );
  });

let getIncidentInfo = async (incidentId, quoteId) => {
  try {
    let incident = await dataStore.findIncident(incidentId, quoteId);
    return incident;
  } catch (error) {
    logger.error(
      `app.api.incidents - getting incident#${incidentId}, from quote#${quoteId} failed - ${JSON.stringify(
        error
      )}`
    );
  }
};

let saveIncidentInfo = async (data, quoteId) => {
  try {
    let incident = {};
    if (data.id) {
      incident = await dataStore.findIncident(data.id, quoteId);
    } else {
      incident.id = gen().toString();
    }
    incident.quoteId = quoteId;
    incident.category = data.category;
    incident.driver = data.driver;
    incident.responsible = data.responsible;
    incident.when = data.when;

    dataStore.addIncident(incident);
    return incident.id;
  } catch (error) {
    logger.error(
      `app.api.incidents - error creating new incident - ${JSON.stringify(
        error
      )}`
    );
  }
};

module.exports = router;
