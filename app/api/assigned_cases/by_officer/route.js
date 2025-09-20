import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "e-oprogem";

export async function POST(request) {
  let client;
  try {
    const { agentUsername } = await request.json();
    if (!agentUsername) {
      return Response.json({ message: "agentUsername is required" }, { status: 400 });
    }

    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(DB_NAME);
    const assignments = db.collection("assign_case");

    // Find assignments for this officer, newest first
    const items = await assignments
      .find({ agentUsername: agentUsername })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({ assignments: items, count: items.length }, { status: 200 });
  } catch (error) {
    console.error("Fetch assigned cases error:", error);
    return Response.json({ message: "Failed to fetch assigned cases", error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
