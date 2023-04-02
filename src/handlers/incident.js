import { dbConnectAndExecute } from "../db/index.js";
import { createErrorResponse, createResponse } from "../utils/index.js";
import Incident from "../db/models/Incident.js";
import errorConstants from "../errors/constants.js";
import MONGO_CONNECTION_STRING from "../env/index.js";

export default async function createIncident(body, quoteId) {
  const { category, driver, responsible, when } = body;

  if (!quoteId || !category || !driver || !responsible || !when) {
    return createErrorResponse(400, errorConstants.commons.badRequest);
  }

  const incident = new Incident({
    quoteId,
    category,
    driver,
    responsible,
    when,
  });

  const result = await dbConnectAndExecute(MONGO_CONNECTION_STRING, () =>
    incident.save()
  );

  if (result) {
    return createResponse(200, {
      message: "Incident Created Successfully!!!",
      quoteId,
    });
  } else {
    throw new Error();
  }
}
