import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// GET - Fetch all commissioners
export async function GET(request) {
  let client;
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('Commissaires');

    const commissioners = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      message: 'Commissioners retrieved successfully',
      commissioners: commissioners,
      count: commissioners.length
    });

  } catch (error) {
    console.error('Error fetching commissioners:', error);
    return NextResponse.json(
      { message: 'Failed to fetch commissioners', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// POST - Create new commissioner
export async function POST(req) {
  let client;
  try {
    client = new MongoClient(uri);
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
     name: policeStation,
     city: city
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
    if (client) {
      await client.close();
    }
  }
}

// PUT - Update commissioner
export async function PUT(req) {
  let client;
  
  try {
    const body = await req.json();
    const { id, fullName, email, phone, username, city, policeStation, password } = body;
    
    if (!id || !fullName || !email || !phone || !username || !city || !policeStation) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 400 });
    }

    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("e-oprogem");
    const admins = db.collection("Commissaires");
    const stations = db.collection("police_stations");

    // Check if station exists
    const stationExists = await stations.findOne({ 
      name: { $regex: new RegExp(`^${policeStation.trim()}$`, 'i') }, 
      city: { $regex: new RegExp(`^${city.trim()}$`, 'i') }
    });
    
    if (!stationExists) {
      return NextResponse.json({ message: "City or Police Station doesn't exist!" }, { status: 400 });
    }

    // Check for duplicate email (excluding current record)
    const existingEmail = await admins.findOne({ 
      email, 
      _id: { $ne: new ObjectId(id) } 
    });
    if (existingEmail) {
      return NextResponse.json({ message: "Email already exists!" }, { status: 400 });
    }

    // Check for duplicate username (excluding current record)
    const existingUser = await admins.findOne({ 
      username, 
      _id: { $ne: new ObjectId(id) } 
    });
    if (existingUser) {
      return NextResponse.json({ message: "Username already exists!" }, { status: 400 });
    }

    // Prepare update data
    const updateData = {
      fullName,
      email,
      phone,
      username,
      city,
      policeStation,
      updatedAt: new Date(),
    };

    // Hash password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const result = await admins.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Commissioner not found!" }, { status: 404 });
    }

    return NextResponse.json({ message: "Commissioner updated successfully!" });

  } catch (error) {
    console.error('Error updating commissioner:', error);
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// DELETE - Delete commissioner
export async function DELETE(req) {
  let client;
  
  try {
    const body = await req.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ message: "Commissioner ID is required!" }, { status: 400 });
    }

    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("e-oprogem");
    const admins = db.collection("Commissaires");

    const result = await admins.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Commissioner not found!" }, { status: 404 });
    }

    return NextResponse.json({ message: "Commissioner deleted successfully!" });

  } catch (error) {
    console.error('Error deleting commissioner:', error);
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
