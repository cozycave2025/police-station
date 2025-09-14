// app/api/complaints/submit/route.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  let client;
  
  try {
    const complaintData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'cnic', 'phone', 'address', 'title', 'description', 'policeStation'];
    const missingFields = requiredFields.filter(field => !complaintData[field]);

    if (missingFields.length > 0) {
      return Response.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('e-oprogem');
    const collection = db.collection('cases'); // Cases collection

    // Get current date and time in PKT
    const now = new Date();
    const submissionDate = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' }); // YYYY-MM-DD
    const submissionTime = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Karachi' }); // HH:MM:SS (24-hour)

    // Generate unique complaint ID
    const complaintId = `CASE-${Date.now()}`;

    // Build complaint object
    const newComplaint = {
      complaintId,
      name: complaintData.name.trim(),
      cnic: complaintData.cnic.trim(),
      phone: complaintData.phone.trim(),
      address: complaintData.address.trim(),
      title: complaintData.title.trim(),
      description: complaintData.description.trim(),
      evidence: complaintData.evidence || null, // File name if uploaded
      policeStation: complaintData.policeStation.trim(),
      status: "Pending",
      submissionDate,
      submissionTime,
      createdAt: now,
      updatedAt: now,
      assignedOfficer: null, // Will be assigned later by admin
      priority: "Normal", // Default priority
      category: "General", // Can be updated later
      notes: [] // Officer notes will be added here
    };

    // Insert complaint into database
    const result = await collection.insertOne(newComplaint);

    // Return success response with complaint ID
    return Response.json({
      message: 'Complaint submitted successfully!',
      complaintId: complaintId,
      caseNumber: result.insertedId
    }, { status: 201 });

  } catch (error) {
    console.error('Complaint submission error:', error);
    return Response.json(
      { message: 'Failed to submit complaint. Please try again.', error: error.message },
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