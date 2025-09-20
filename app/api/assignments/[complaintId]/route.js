import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "e-oprogem";

export async function GET(request, { params }) {
  let client;
  try {
    const { complaintId } = params || {};
    if (!complaintId) {
      return Response.json({ message: "complaintId is required" }, { status: 400 });
    }

    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(DB_NAME);
    const assignments = db.collection("assign_case");

    const items = await assignments
      .find({ complaintId: String(complaintId) })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(items, { status: 200 });
  } catch (error) {
    console.error("Fetch assignments error:", error);
    return Response.json({ message: "Failed to fetch assignments", error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
