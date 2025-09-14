import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 400 });
    }

    await client.connect();
    const db = client.db("e-oprogem"); // apna DB name likhna
    const admins = db.collection("Commissaires");

    // Find user by username
    const admin = await admins.findOne({ username });
    if (!admin) {
      return NextResponse.json({ message: "Invalid username or password!" }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid username or password!" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Login successful!", adminId: admin._id },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  } finally {
    await client.close();
  }
}
