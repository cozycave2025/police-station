// app/api/complaints/user/route.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  let client;
  
  try {
    const { userIdentifier, userType } = await request.json();

    if (!userIdentifier || !userType) {
      return Response.json(
        { message: 'User identifier and type are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('cases');

    // Query based on user type
    let query = {};
    
    if (userType === 'email') {
      // Find by email in users collection first, then match complaints by CNIC/phone
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ email: userIdentifier });
      
      if (user) {
        query = {
          $or: [
            { phone: user.phone },
            { cnic: user.cnic },
            // Also match by name if exact match
            { name: user.fullName }
          ]
        };
      } else {
        // If user not found, return empty result
        return Response.json({
          message: 'No complaints found',
          complaints: []
        });
      }
    } else if (userType === 'cnic') {
      query = { cnic: userIdentifier };
    } else if (userType === 'phone') {
      query = { phone: userIdentifier };
    } else if (userType === 'username') {
      query = { name: userIdentifier };
    } else if (userType === 'commissioner') {
      // For commissioners, find their station first, then get complaints for that station
      console.log(userIdentifier);
      const commissairesCollection = db.collection('Commissaires');
      const commissioner = await commissairesCollection.findOne({ username: userIdentifier });
      console.log(commissioner);
      if (commissioner) {
        // Get complaints for this commissioner's station
        query = { policeStation: commissioner.policeStation };
        const complaints = await collection.find(query)
          .sort({ createdAt: -1 })
          .toArray();
        return Response.json({
          message: 'Complaints retrieved successfully',
          complaints: complaints,
          count: complaints.length
        });
      } else {
        // If commissioner not found, return empty result
        return Response.json({
          message: 'No complaints found',
          complaints: []
        });
      }
    }

    // Get complaints sorted by creation date (newest first)
    const complaints = await collection.find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      message: 'Complaints retrieved successfully',
      complaints: complaints,
      count: complaints.length
    });

  } catch (error) {
    console.error('Error fetching user complaints:', error);
    return Response.json(
      { message: 'Failed to fetch complaints', error: error.message },
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