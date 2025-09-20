// app/api/police_agent/report/route.jsx
// Handles report uploads (PDF/images) to Cloudinary and stores metadata in MongoDB
import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'e-oprogem';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_REPORTS_FOLDER || 'police-reports';

async function uploadToCloudinary(file) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary environment variables are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  }
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const timestamp = Math.floor(Date.now() / 1000);

  // Build signature
  // Params must be sorted alphabetically and concatenated as key=value pairs joined by &
  const paramsToSign = {
    folder: CLOUDINARY_FOLDER,
    timestamp,
  };
  const sortedKeys = Object.keys(paramsToSign).sort();
  const toSign = sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join('&');
  const signature = crypto
    .createHash('sha1')
    .update(`${toSign}${CLOUDINARY_API_SECRET}`)
    .digest('hex');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signature);
  formData.append('folder', CLOUDINARY_FOLDER);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || 'Cloudinary upload failed';
    throw new Error(message);
  }
  return data; // includes secure_url, public_id, original_filename, resource_type, format, bytes
}

export async function POST(request) {
  let client;
  try {
    const form = await request.formData();
    const file = form.get('file');
    const complaintJson = form.get('complaint');
    const agentName = form.get('agentName');
    const agentUsername = form.get('agentUsername');
    const station = form.get('station');

    if (!file || typeof file === 'string') {
      return Response.json({ message: 'File is required' }, { status: 400 });
    }
    if (!complaintJson) {
      return Response.json({ message: 'Complaint data is required' }, { status: 400 });
    }

    let complaint;
    try {
      complaint = JSON.parse(complaintJson);
    } catch (e) {
      return Response.json({ message: 'Invalid complaint JSON' }, { status: 400 });
    }

    const uploadResult = await uploadToCloudinary(file);

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const reports = db.collection('report'); // per requirement: collection name is 'report'
    const assignments = db.collection('assign_case');

    const doc = {
      complaintId: complaint._id ? String(complaint._id) : complaint.id ?? null,
      complaint,
      policeStation: station || complaint.policeStation || null,
      agentName: agentName || null,
      agentUsername: agentUsername || null,
      reportUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      status: 'Pending',
      createdAt: new Date(),
    };

    const insertRes = await reports.insertOne(doc);

    // Mark the assignment as In Progress so it moves to the reports section
    if (doc.complaintId && agentUsername) {
      await assignments.updateMany(
        { complaintId: String(doc.complaintId), agentUsername: agentUsername },
        { $set: { complaintStatus: 'In Progress', updatedAt: new Date() } }
      );
    } 
      return Response.json(
      {
        message: 'Report uploaded successfully',
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        insertedId: insertRes.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading report:', error);
    return Response.json(
      { message: 'Failed to upload report', error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function PATCH(request) {
  let client;
  try {
    const { reportId, status } = await request.json();
    if (!reportId || !status) {
      return Response.json({ message: 'reportId and status are required' }, { status: 400 });
    }
    const allowed = ['Approved', 'Rejected', 'Pending'];
    if (!allowed.includes(status)) {
      return Response.json({ message: 'Invalid status' }, { status: 400 });
    }

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const reports = db.collection('report');

    const res = await reports.updateOne({ _id: new ObjectId(reportId) }, { $set: { status, updatedAt: new Date() } });
    if (res.matchedCount === 0) {
      return Response.json({ message: 'Report not found' }, { status: 404 });
    }
    return Response.json({ message: 'Report status updated', modifiedCount: res.modifiedCount });
  } catch (error) {
    console.error('Error updating report:', error);
    return Response.json({ message: 'Failed to update report', error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


export async function GET(request) {
  let client;
  try {
    const { searchParams } = new URL(request.url);
    const agentUsername = searchParams.get('agentUsername');
    const policeStation = searchParams.get('policeStation');
    const complaintId = searchParams.get('complaintId');

    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const reports = db.collection('report');

    const query = {};
    if (agentUsername) query.agentUsername = agentUsername;
    if (policeStation) query.policeStation = policeStation;
    if (complaintId) query.complaintId = complaintId;

    const items = await reports.find(query).sort({ createdAt: -1 }).toArray();
    return Response.json({ reports: items, count: items.length });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return Response.json({ message: 'Failed to fetch reports', error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

