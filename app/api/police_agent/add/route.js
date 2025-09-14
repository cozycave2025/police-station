import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const { name, rank, badge, username, password, commissionerUsername } = await req.json();
    console.log(name, rank, badge, username, password, commissionerUsername);
    if (!name || !rank || !badge || !username || !password || !commissionerUsername) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 400 });
    }

    await client.connect();
    const db = client.db("e-oprogem");
    const officers = db.collection("police_agent");
    const commissioners = db.collection("Commissaires");

    // Find the commissioner to get their city and station
    const commissioner = await commissioners.findOne({ username: commissionerUsername });
    if (!commissioner) {
      return NextResponse.json({ message: "Commissioner not found!" }, { status: 400 });
    }

    // Check duplicate username
    const existing = await officers.findOne({ username });
    if (existing) {
      return NextResponse.json({ message: "Username already exists!" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await officers.insertOne({
      name,
      rank,
      badge,
      username,
      password: hashedPassword,
      city: commissioner.city,
      policeStation: commissioner.policeStation,
      commissionerUsername: commissionerUsername,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Officer registered!", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  } finally {
    await client.close();
  }
}
