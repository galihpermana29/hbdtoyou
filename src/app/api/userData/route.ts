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

export async function GET(req: any, res: any) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');
  await client.connect();

  if (!query) return;
  if (query) {
    const db = client.db('userdata'); // Replace with your database name
    const collection = db.collection('netflix-new'); // Replace with your collection name

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
  const collection = db.collection('netflix-new'); // Replace with your collection name

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
