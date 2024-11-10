import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), '/src/lib/userData.json');

export async function GET(req: any, res: any) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');

  console.log(query, 'queryyy');
  const jsonData = await fsPromises.readFile(dataFilePath);
  const objectData = JSON.parse(jsonData as any);

  if (query) {
    console.log(objectData.data.length, 'objectData.data length');
    const filteredData = objectData.data.find(
      (data: any) => data.forName === query
    );
    return Response.json({ data: filteredData });
  }
  return Response.json({ data: objectData.data });
}

export async function POST(req: any, res: any) {
  const jsonData = await fsPromises.readFile(dataFilePath);
  const objectData = JSON.parse(jsonData as any);
  const resBody = await req.json();
  const { title, subTitle, jumbotronImage, modalContent, images, forName } =
    resBody;

  objectData.data.push({
    title,
    subTitle,
    jumbotronImage,
    modalContent,
    images,
    forName,
  });

  const updatedData = JSON.stringify(objectData);
  console.log(objectData.data.length, 'length of data');
  // Write the updated data to the JSON file
  await fsPromises.writeFile(dataFilePath, updatedData);

  // Send a success response
  return Response.json({ status: 'ok' });
}
