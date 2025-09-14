// app/api/dashboard/register/route.js
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  let client;
  
  try {
    const formData = await request.json();

    // Validate required fields
    if (!formData.password || !formData.confirmPassword) {
      return Response.json(
        { message: 'Password and confirm password are required' },
        { status: 400 }
      );
    }

    if (formData.password !== formData.confirmPassword) {
      return Response.json(
        { message: 'Passwords do not match!' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('users'); // New collection for users

    // Check for existing user
    let existingUser;
    if (formData.role === "anonymous") {
      if (!formData.username) {
        return Response.json(
          { message: 'Username is required for anonymous users' },
          { status: 400 }
        );
      }
      existingUser = await collection.findOne({ username: formData.username });
    } else if (formData.role === "user") {
      if (!formData.fullName || !formData.phone || !formData.email || !formData.city) {
        return Response.json(
          { message: 'Full name, phone, email, and city are required for user registration' },
          { status: 400 }
        );
      }

      // Validate city exists in database
      const stationsCollection = db.collection('police_stations');
      const cityExists = await stationsCollection.findOne({ 
        city: { $regex: new RegExp(`^${formData.city.trim()}$`, 'i') }
      });
      
      if (!cityExists) {
        return Response.json(
          { message: 'City doesn\'t exist!' },
          { status: 400 }
        );
      }
      existingUser = await collection.findOne({
        $or: [
          { email: formData.email },
          { phone: formData.phone }
        ]
      });
    }

    if (existingUser) {
      return Response.json(
        { message: 'User with this info already exists!' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

    // Build user object
    let newUser = {
      role: formData.role,
      password: hashedPassword,
      createdAt: new Date()
    };

    if (formData.role === "anonymous") {
      newUser.username = formData.username;
    } else if (formData.role === "user") {
      newUser.fullName = formData.fullName;
      newUser.phone = formData.phone;
      newUser.email = formData.email;
      newUser.city = formData.city || "";
      newUser.address = formData.address || "";
      newUser.cnic = formData.cnic || "";
    }

    // Insert user into database
    const result = await collection.insertOne(newUser);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;
    userResponse._id = result.insertedId;

    return Response.json({
      message: 'Registration successful!',
      user: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
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