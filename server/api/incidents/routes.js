const express = require("express");
var rn = require("random-number");
const router = express.Router({ mergeParams: true });
const dataStore = require("../../data/dataStore");
const axios = require("axios");
const { Agent } = require("https");
const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

var gen = rn.generator({
  min: 100000000,
  max: 999999999,
  integer: true,
});

const client = axios.create({
  httpsAgent: new Agent({
    rejectUnauthorized: false,
  }),
});

router
  .route("/incidentInfo/:id/:quoteId")
  .get(async (req, res) => {
    logger.info(
      `app.api.incidents - getting incident with id - ${req.params.id}`
    );
    res.send(
      JSON.stringify(await getIncidentInfo(req.params.id, req.params.quoteId))
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

let getIncidentInfo = async (id, quoteId) => {
  try {
    let incident = await dataStore.findIncident(quoteId);
    return incident;
  } catch (error) {
    logger.error(
      `app.api.incidents - getting incident#${id}, from quote#${quoteId} failed - ${JSON.stringify(
        error
      )}`
    );
  }
};

let saveIncidentInfo = async (data, quoteId) => {
  try {
    let incident = "";
    incident = {};
    incident.quoteId = quoteId;
    incident.category = data.category;
    incident.driver = data.driver;
    incident.responsible = data.responsible;
    incident.when = data.when;

    if (!data.id) {
      incident.id = gen().toString();
    }

    await client.post(
      `${process.env.DB_SERVICE_URL}/${process.env.COLLECTION_NAME}`,
      incident,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    logger.error(
      `app.api.incidents - error creating new incident - ${JSON.stringify(
        error
      )}`
    );
  }

  return incident.id;
};

module.exports = router;
