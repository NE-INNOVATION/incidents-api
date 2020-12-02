const mongo = require("mongodb").MongoClient;
const collection = process.env.COLLECTION_NAME;
const connectionString = process.env.CONNECTION_STRING;
const dbName = process.env.DB_NAME;
let clientPromise;

const createDbConnection = () => {
  if (!clientPromise) {
    clientPromise = getDbConnection();
  }
};

const getDbConnection = () => {
  return new Promise((resolve, reject) => {
    mongo.connect(
      connectionString,
      {
        connectTimeoutMS: 30000,
        useNewUrlParser: true,
        keepAlive: 1,
        reconnectTries: 30,
        reconnectInterval: 2000,
      },
      (err, client) => {
        if (err) {
          console.log("Failed to connect MongoDB");
          reject(err);
        } else {
          console.log("Successfully created MongoDB connection");
          resolve(client);
        }
      }
    );
  });
};

const findIncident = async (incidentId, quoteId) => {
  let client = await clientPromise;
  let db = client.db(dbName);
  let filter = { quoteId: quoteId, id: incidentId };
  return new Promise((resolve, reject) => {
    try {
      db.collection(collection).findOne(filter, async (err, incident) => {
        if (err) {
          console.log(`Something went wrong - ${err}`);
          reject();
        }
        resolve(incident);
      });
    } catch (error) {
      console.log(`Something went wrong, Error - ${error}`);
      reject();
    }
  });
};

const addIncident = async (incidentInfo) => {
  let client = await clientPromise;
  let db = client.db(dbName);
  let filter = { quoteId: incidentInfo.quoteId, id: incidentInfo.id };
  let objectId, action;
  try {
    let saveResult = await db
      .collection(collection)
      .replaceOne(filter, incidentInfo, {
        upsert: true,
      });
    objectId = saveResult.insertedId;
    action = "upserted";
  } catch (error) {
    console.log(`Failed to update mongo - QuoteID : ${incidentInfo.quoteId}`);
  }
  console.log(`incident with QuoteID - ${incidentInfo.quoteId} ${action}`);
  // client.close()
  return objectId;
};

module.exports = {
  createDbConnection,
  addIncident,
  findIncident,
};
