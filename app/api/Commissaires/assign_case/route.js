import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'e-oprogem';

export async function POST(request) {
  let client;
  try {
    const { complaintId, agentUsername, message, commissionerUsername } = await request.json();

    if (!complaintId || !agentUsername || !commissionerUsername) {
      return Response.json({ message: 'complaintId, agentUsername and commissionerUsername are required' }, { status: 400 });
    }

    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(DB_NAME);
    const cases = db.collection('cases');
    const officers = db.collection('police_agent');
    const commissioners = db.collection('Commissaires');
    const assignments = db.collection('assign_case');

    // Fetch complaint
    const complaint = await cases.findOne({ _id: new ObjectId(complaintId) });
    if (!complaint) {
      return Response.json({ message: 'Complaint not found' }, { status: 404 });
    }

    // Fetch agent and commissioner
    const agent = await officers.findOne({ username: agentUsername });
    if (!agent) {
      return Response.json({ message: 'Agent not found' }, { status: 404 });
    }
    const commissioner = await commissioners.findOne({ username: commissionerUsername });
    if (!commissioner) {
      return Response.json({ message: 'Commissioner not found' }, { status: 404 });
    }

    const doc = {
      // Linkage
      complaintId: String(complaint._id),
      // Store the full complaint document as-is for auditing/reference
      complaint: complaint,
      // Helpful denormalized fields for quick querying
      complaintTitle: complaint.title || complaint.description || '',
      complaintStatus: complaint.status || null,
      complainantName: complaint.name || null,
      phone: complaint.phone || null,
      cnic: complaint.cnic || null,
      policeStation: agent.policeStation || complaint.policeStation || commissioner.policeStation || null,
      city: agent.city || commissioner.city || complaint.city || null,
      // Agent info
      agentUsername: agent.username,
      agentName: agent.name || null,
      // Commissioner info
      commissionerUsername: commissioner.username,
      commissionerName: commissioner.fullName || commissioner.name || null,
      // Instructions
      message: message || '',
      // Meta
      status: 'Assigned',
      createdAt: new Date(),
    };

    const res = await assignments.insertOne(doc);
    return Response.json({ message: 'Case assigned successfully', id: res.insertedId, assignment: doc }, { status: 201 });
  } catch (error) {
    console.error('Assign case error:', error);
    return Response.json({ message: 'Failed to assign case', error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
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

