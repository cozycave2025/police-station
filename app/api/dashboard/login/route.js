// app/api/dashboard/login/route.js
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  let client;
  
  try {
    const { identifier, password, role } = await request.json();

    if (!identifier || !password || !role) {
      return Response.json(
        { message: 'Identifier, password, and role are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('users');

    // Find user based on role
    let user;
    if (role === "anonymous") {
      user = await collection.findOne({ username: identifier, role: "anonymous" });
    } else if (role === "user") {
      user = await collection.findOne({ 
        $or: [
          { email: identifier, role: "user" },
          { phone: identifier, role: "user" }
        ]
      });
    } else {
      return Response.json(
        { message: 'Invalid role specified' },
        { status: 400 }
      );
    }

    if (!user) {
      return Response.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userData } = user;

    return Response.json({
      message: 'Login successful',
      user: userData
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
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