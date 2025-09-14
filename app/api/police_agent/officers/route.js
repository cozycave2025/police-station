import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("e-oprogem");
    const officers = db.collection("police_agent");

    // Password ko exclude karte hain
    const data = await officers.find({}, { projection: { password: 0 } }).toArray();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  } finally {
    await client.close();
  }
}
