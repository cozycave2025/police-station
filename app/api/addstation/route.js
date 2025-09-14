import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("e-oprogem");
    const collection = db.collection("police_stations");
    const stations = await collection.find({}).toArray();
    // Map _id to id for frontend
    const mappedStations = stations.map((station) => ({
      ...station,
      id: station._id.toString(),
      _id: undefined, // Remove _id if not needed
    }));
    return new Response(JSON.stringify(mappedStations), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/police_stations:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, city, commander, officers } = body;
    console.log(body);

    if (!name || !city) {
      return new Response(
        JSON.stringify({ message: "Required fields: name, city" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await client.connect();
    const db = client.db("e-oprogem");
    const collection = db.collection("police_stations");

    const result = await collection.insertOne({
      name,
      city,
      commander: commander || "",
      officers: parseInt(officers) || 0,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "Police station added!", id: result.insertedId.toString() }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in POST /api/police_stations:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, city, commander, officers } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "ID is required for update" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await client.connect();
    const db = client.db("e-oprogem");
    const collection = db.collection("police_stations");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          city,
          commander: commander || "",
          officers: parseInt(officers) || 0,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Police station not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Police station updated" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in PUT /api/police_stations:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "ID is required for deletion" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await client.connect();
    const db = client.db("e-oprogem");
    const collection = db.collection("police_stations");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Police station not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Police station deleted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in DELETE /api/police_stations:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.close();
  }
}