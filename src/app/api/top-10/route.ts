const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.NEXT_PUBLIC_MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function GET(req: Request) {
  try {
    // Connect to the database
    await client.connect();

    const db = client.db('userdata'); // Replace with your database name
    const collection = db.collection('netflix-new'); // Replace with your collection name

    // Method 1: Using $sample (Most Efficient)
    const randomEntries = await collection
      .aggregate([
        {
          $match: {
            jumbotronImage: {
              $regex: /^http:\/\/res\.cloudinary\.com/,
            },
          },
        },

        // Random sampling
        { $sample: { size: 10 } },

        {
          $project: {
            title: 1,
            subTitle: 1,
            jumbotronImage: 1,
            forName: 1,
          },
        },
      ])
      .toArray();

    // Method 2: Alternative approach with additional options
    // const randomEntries = await collection.aggregate([
    //   { $sample: { size: 10 } },
    //   { $project: {
    //     title: 1,
    //     description: 1,
    //     // Add other fields you want to include
    //   }}
    // ]).toArray();

    return Response.json({
      success: true,
      count: randomEntries.length,
      data: randomEntries,
    });
  } catch (error) {
    console.error('MongoDB Random Entries Error:', error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  } finally {
    // Ensure connection is closed
    await client.close();
  }
}
