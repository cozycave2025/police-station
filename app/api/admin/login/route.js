import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("e-oprogem");
    const collection = db.collection("admin");

    const body = await req.json();
    const { adminId, password } = body;
    console.log("Received login request:", { adminId, password });

    const admin = await collection.findOne({ adminId, password });
    console.log("Found admin:", admin);

    if (!admin) {
      return new Response(
        JSON.stringify({ message: "Invalid credentials!" }),
        { status: 401 }
      );
    }

    return Response.json(
      { message: "Login successful!", fullName: admin.fullName },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/admin/login:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}