import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // .env.local me URI rakho
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phone, adminId, designation, city, password } = body;

    // MongoDB connect
    await client.connect();
    const db = client.db("e-oprogem"); // apna DB name
    const collection = db.collection("admin");

    // Email ya AdminID already exist check
    const existingAdmin = await collection.findOne({
      $or: [{ email }, { adminId }],
    });

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Admin already exists!" }),
        { status: 400 }
      );
    }

    // Insert new admin
    const result = await collection.insertOne({
      fullName,
      email,
      phone,
      adminId,
      designation,
      city,
      password,
      role: "admin",
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "Admin registered!", id: result.insertedId }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    await client.close();
  }
}
