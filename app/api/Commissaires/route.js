import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

export async function GET(request) {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('Commissaires');

    // Get all commissioners
    const commissioners = await collection.find({}).toArray();

    return Response.json({
      message: 'Commissioners retrieved successfully',
      commissioners: commissioners,
      count: commissioners.length
    });

  } catch (error) {
    console.error('Error fetching commissioners:', error);
    return Response.json(
      { message: 'Failed to fetch commissioners', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function POST(request) {
  let client;
  
  try {
    const newCommissioner = await request.json();

    // Validate required fields
    if (!newCommissioner.name || !newCommissioner.username || !newCommissioner.badgeId) {
      return Response.json(
        { message: 'Name, username, and badge ID are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('Commissaires');

    // Check if username already exists
    const existingCommissioner = await collection.findOne({ 
      $or: [
        { username: newCommissioner.username },
        { badgeId: newCommissioner.badgeId }
      ]
    });

    if (existingCommissioner) {
      return Response.json(
        { message: 'Commissioner with this username or badge ID already exists' },
        { status: 409 }
      );
    }

    // Add timestamp
    newCommissioner.createdAt = new Date();
    
    // Insert new commissioner
    const result = await collection.insertOne(newCommissioner);

    return Response.json({
      message: 'Commissioner added successfully',
      commissioner: { ...newCommissioner, _id: result.insertedId }
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding commissioner:', error);
    return Response.json(
      { message: 'Failed to add commissioner', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function PUT(request) {
  let client;
  
  try {
    const { id, ...updateData } = await request.json();

    if (!id) {
      return Response.json(
        { message: 'Commissioner ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('Commissaires');

    // Update commissioner
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { message: 'Commissioner not found' },
        { status: 404 }
      );
    }

    return Response.json({
      message: 'Commissioner updated successfully'
    });

  } catch (error) {
    console.error('Error updating commissioner:', error);
    return Response.json(
      { message: 'Failed to update commissioner', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function DELETE(request) {
  let client;
  
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json(
        { message: 'Commissioner ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('Commissaires');

    // Delete commissioner
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json(
        { message: 'Commissioner not found' },
        { status: 404 }
      );
    }

    return Response.json({
      message: 'Commissioner deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting commissioner:', error);
    return Response.json(
      { message: 'Failed to delete commissioner', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}