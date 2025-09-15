import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'e-oprogem';

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
  }
  return db;
}

// Initialize with sample data if collection is empty
async function initializeData() {
  const database = await connectToDatabase();
  const collection = database.collection('news');
  
  const count = await collection.countDocuments();
  if (count === 0) {
    const sampleNews = [
      {
        title: 'Conakry Cultural Festival Celebrates Guinean Heritage',
        description: 'The 2025 Conakry Cultural Festival drew thousands to showcase traditional music, dance, and crafts at the Palais du Peuple.',
        image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e',
        category: 'Culture',
        type: 'headline',
        createdAt: '2025-09-14',
      },
      {
        title: 'New Solar Power Plant Opens in Kankan',
        description: 'A new solar power plant was inaugurated in Kankan, aiming to provide sustainable energy to over 50,000 households.',
        image: 'https://guinea.iom.int/sites/g/files/tmzbdl796/files/styles/max_1300x1300/public/stories/2023-05/0i1a9495.jpg?itok=SSMQHKHI',
        category: 'Infrastructure',
        type: 'regular',
        createdAt: '2025-09-13',
      },
      {
        title: 'Guinea National Football Team Prepares for AFCON',
        description: 'The Syli National team began training in Conakry for the 2026 Africa Cup of Nations, boosting national pride.',
        image: 'https://guinea.iom.int/sites/g/files/tmzbdl796/files/styles/max_1300x1300/public/stories/2023-05/337519453_1283708708887892_3661657572976708681_n-enhanced-sr_0.jpg?itok=5qnCOasq',
        category: 'Sports',
        type: 'banner',
        createdAt: '2025-09-12',
      },
      {
        title: 'Government Launches Free Education Program in Labé',
        description: 'A new initiative in Labé provides free primary education, aiming to increase school attendance across the region.',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
        category: 'Education',
        type: 'regular',
        createdAt: '2025-09-11',
      },
      {
        title: 'Conakry Port Expansion Project Approved',
        description: 'The government approved a plan to expand Conakry\'s port, aiming to enhance trade and logistics.',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206',
        category: 'Infrastructure',
        type: 'regular',
        createdAt: '2025-09-08',
      },
      {
        title: 'Guinea\'s Music Scene Shines at International Festival',
        description: 'Guinean artists wowed audiences at an international music festival, promoting Mande music globally.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
        category: 'Culture',
        type: 'regular',
        createdAt: '2025-09-07',
      },
      {
        title: 'Youth Entrepreneurship Program Launched in Kindia',
        description: 'A new program in Kindia supports young entrepreneurs with training and funding to start businesses.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        category: 'Education',
        type: 'regular',
        createdAt: '2025-09-06',
      },
    ];
    
    await collection.insertMany(sampleNews);
  }
}

// GET - Fetch all news or with pagination
export async function GET(request) {
  try {
    await initializeData();
    const database = await connectToDatabase();
    const collection = database.collection('news');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const type = searchParams.get('type'); // filter by type if needed

    // Build query filter
    let query = {};
    if (type) {
      query.type = type;
    }

    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);

    // Fetch news with pagination and sorting
    const news = await collection
      .find(query)
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Convert ObjectId to string for JSON serialization
    const serializedNews = news.map(item => ({
      ...item,
      id: item._id.toString(),
      _id: undefined
    }));

    return NextResponse.json({
      news: serializedNews,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: (page * limit) < totalCount
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST - Create new news
export async function POST(request) {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('news');
    
    const body = await request.json();
    const { title, description, image, category, type } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const newNews = {
      title,
      description,
      image: image || '',
      category: category || 'General',
      type: type || 'regular',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const result = await collection.insertOne(newNews);
    const insertedNews = { ...newNews, id: result.insertedId.toString() };

    return NextResponse.json({
      message: 'News created successfully',
      news: insertedNews
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

// PUT - Update existing news
export async function PUT(request) {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('news');
    
    const body = await request.json();
    const { id, title, description, image, category, type } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (category) updateData.category = category;
    if (type) updateData.type = type;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    const updatedNews = await collection.findOne({ _id: new ObjectId(id) });
    const serializedNews = {
      ...updatedNews,
      id: updatedNews._id.toString(),
      _id: undefined
    };

    return NextResponse.json({
      message: 'News updated successfully',
      news: serializedNews
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

// DELETE - Delete news
export async function DELETE(request) {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('news');
    
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      );
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'News deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    );
  }
}