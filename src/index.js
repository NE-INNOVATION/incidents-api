import { createErrorResponse } from "./utils/index.js";
import errorConstants from "./errors/constants.js";
import createIncident from "./handlers/incident.js";

export async function handler(event) {
  console.log("\n\n\n###", JSON.stringify(event), "###\n\n\n");

  try {
    const { path, method } = event.requestContext.http;

    if (path.startsWith("/api/incidents/incidentInfo")) {
      if (method.toLowerCase() === "post") {
        return await createIncident(
          JSON.parse(event.body),
          event?.pathParameters?.quoteId
        );
      }
    }
  } catch (err) {
    return createErrorResponse(500, errorConstants.commons.internalServerError);
  }
}
