import fsPromises from 'fs/promises';
import path from 'path';

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

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db('admin').command({ ping: 1 });
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!'
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// const dataFilePath = path.join(process.cwd(), '/src/lib/userData.json');

export async function GET(req: any, res: any) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');
  await client.connect();
  console.log(query, 'queryyy');
  // const jsonData = await fsPromises.readFile(dataFilePath);
  // const objectData = JSON.parse(jsonData as any);
  if (!query) return;
  if (query) {
    const db = client.db('userdata'); // Replace with your database name
    const collection = db.collection('netflix'); // Replace with your collection name

    const data = await collection.findOne({ forName: query });

    return Response.json({ data: data });
  }
  return Response.json({ data: '' });
}

export async function POST(req: any, res: any) {
  // const jsonData = await fsPromises.readFile(dataFilePath);
  // const objectData = JSON.parse(jsonData as any);
  const resBody = await req.json();
  const { title, subTitle, jumbotronImage, modalContent, images, forName } =
    resBody;
  await client.connect();
  const db = client.db('userdata'); // Replace with your database name
  const collection = db.collection('netflix'); // Replace with your collection name

  const data = req.body;

  const result = await collection.insertOne({
    title,
    subTitle,
    jumbotronImage,
    modalContent,
    images,
    forName,
  });

  console.log(result);
  // objectData.data.push({
  //   title,
  //   subTitle,
  //   jumbotronImage,
  //   modalContent,
  //   images,
  //   forName,
  // });

  // const updatedData = JSON.stringify(objectData);
  // console.log(objectData.data.length, 'length of data');
  // Write the updated data to the JSON file
  // await fsPromises.writeFile(dataFilePath, updatedData);

  // Send a success response
  return Response.json({ status: 'ok' });
}
