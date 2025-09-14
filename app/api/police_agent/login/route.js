// app/api/police_agent/login/route.js
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  let client;
  
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('police_agent');

    // Find officer by username
    const officer = await collection.findOne({ username });
 
    if (!officer) {
      return Response.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, officer.password);
    console.log("Password valid:", isPasswordValid);
    if (!isPasswordValid) {
      return Response.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...officerData } = officer;

    return Response.json({
      message: 'Login successful',
      officer: officerData
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

// Handle OPTIONS request for CORS
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}