import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

export async function GET(request) {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('urgent_alert');

    // Get all urgent alerts
    const alerts = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return Response.json({
      message: 'Urgent alerts retrieved successfully',
      alerts: alerts,
      count: alerts.length
    });

  } catch (error) {
    console.error('Error fetching urgent alerts:', error);
    return Response.json(
      { message: 'Failed to fetch urgent alerts', error: error.message },
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
    const newAlert = await request.json();

    // Validate required fields
    if (!newAlert.title || !newAlert.description) {
      return Response.json(
        { message: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('urgent_alert');

    // Add timestamp
    newAlert.createdAt = new Date();
    
    // Insert new urgent alert
    const result = await collection.insertOne(newAlert);

    return Response.json({
      message: 'Urgent alert added successfully',
      alert: { ...newAlert, _id: result.insertedId }
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding urgent alert:', error);
    return Response.json(
      { message: 'Failed to add urgent alert', error: error.message },
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
        { message: 'Alert ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('urgent_alert');

    // Update urgent alert
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return Response.json(
        { message: 'Urgent alert not found' },
        { status: 404 }
      );
    }

    return Response.json({
      message: 'Urgent alert updated successfully'
    });

  } catch (error) {
    console.error('Error updating urgent alert:', error);
    return Response.json(
      { message: 'Failed to update urgent alert', error: error.message },
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
        { message: 'Alert ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('urgent_alert');

    // Delete urgent alert
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json(
        { message: 'Urgent alert not found' },
        { status: 404 }
      );
    }

    return Response.json({
      message: 'Urgent alert deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting urgent alert:', error);
    return Response.json(
      { message: 'Failed to delete urgent alert', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}