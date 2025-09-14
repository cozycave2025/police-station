import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// DELETE officer
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await client.connect();
    const db = client.db("e-oprogem");
    const officers = db.collection("police_agent");

    await officers.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Officer deleted!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  } finally {
    await client.close();
  }
}

// UPDATE officer
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    await client.connect();
    const db = client.db("e-oprogem");
    const officers = db.collection("police_agent");

    // Agar password bhi update karna hai to hash karna hoga
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    await officers.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Officer updated!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error!" }, { status: 500 });
  } finally {
    await client.close();
  }
}
