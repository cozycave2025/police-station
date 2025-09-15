import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

export async function GET(request) {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('awareness');

    // Get all awareness messages
    const awarenessMessages = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return Response.json({
      message: 'Awareness messages retrieved successfully',
      awareness: awarenessMessages,
      count: awarenessMessages.length
    });

  } catch (error) {
    console.error('Error fetching awareness messages:', error);
    return Response.json(
      { message: 'Failed to fetch awareness messages', error: error.message },
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
    const newAwareness = await request.json();

    // Validate required fields
    if (!newAwareness.title || !newAwareness.description) {
      return Response.json(
        { message: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('awareness');

    // Add timestamp
    newAwareness.createdAt = new Date();
    
    // Insert new awareness message
    const result = await collection.insertOne(newAwareness);

    return Response.json({
      message: 'Awareness message added successfully',
      awareness: { ...newAwareness, _id: result.insertedId }
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding awareness message:', error);
    return Response.json(
      { message: 'Failed to add awareness message', error: error.message },
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
        { message: 'Awareness message ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('awareness');

    // Update awareness message
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { message: 'Awareness message not found' },
        { status: 404 }
      );
    }

    return Response.json({
      message: 'Awareness message updated successfully'
    });

  } catch (error) {
    console.error('Error updating awareness message:', error);
    return Response.json(
      { message: 'Failed to update awareness message', error: error.message },
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
        { message: 'Awareness message ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('awareness');

    // Delete awareness message
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json(
        { message: 'Awareness message not found' },
        { status: 404 }
      );
    }

    return Response.json({
      message: 'Awareness message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting awareness message:', error);
    return Response.json(
      { message: 'Failed to delete awareness message', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}