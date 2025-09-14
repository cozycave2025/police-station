import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI; // apni .env.local me define karein
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phone, username, password, city, policeStation } = body;
    console.log(fullName, email, phone, username, password, city, policeStation);
    if (!fullName || !email || !phone || !username || !password || !city || !policeStation) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 400 });
    }

    await client.connect();
    const db = client.db("e-oprogem"); 
    const admins = db.collection("Commissaires");
    const stations = db.collection("police_stations");

    // Check if city and police station exist
    console.log("Searching for station with:", { name: policeStation, city: city });
    
    // First, let's see all stations in the database
    const allStations = await stations.find({}).toArray();
    console.log("All stations in database:", allStations);
    
    const stationExists = await stations.findOne({ 
      name: { $regex: new RegExp(`^${policeStation.trim()}$`, 'i') }, 
      city: { $regex: new RegExp(`^${city.trim()}$`, 'i') }
    });
    console.log("Station found:", stationExists);
    
    if (!stationExists) {
      return NextResponse.json({ message: "City or Police Station doesn't exist!" }, { status: 400 });
    }

    // Check duplicate email
    const existingEmail = await admins.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ message: "Email already exists!" }, { status: 400 });
    }

    // Check duplicate username
    const existingUser = await admins.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: "Username already exists!" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const newAdmin = {
      fullName,
      email,
      phone,
      username,
      password: hashedPassword,
      city,
      policeStation,
      role: "commissioners",
      createdAt: new Date(),
    };

    const result = await admins.insertOne(newAdmin);

    return NextResponse.json(
      { message: "Admin registered successfully!", adminId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  } finally {
    await client.close();
  }
}
