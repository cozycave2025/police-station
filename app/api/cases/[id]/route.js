import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "e-oprogem";

export async function GET(request, { params }) {
  let client;
  try {
    const { id } = params || {};
    if (!id) {
      return Response.json({ message: "Case ID is required" }, { status: 400 });
    }
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(DB_NAME);
    const cases = db.collection("cases");

    const doc = await cases.findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return Response.json({ message: "Case not found" }, { status: 404 });
    }
    return Response.json(doc, { status: 200 });
  } catch (error) {
    console.error("Fetch case error:", error);
    return Response.json({ message: "Failed to fetch case", error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
