import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: any, res: any) {
  cloudinary.config({
    cloud_name: 'dxuumohme',
    api_key: '886125678413288',
    api_secret: 'YfxzRyGWAfTbYgvo4s2_3NBWLUc',
  });

  const resBody = await req.json();
  const { image } = resBody;
  // console.log(image, 'imageee');
  const data = await cloudinary.uploader.upload(
    image,
    {
      use_filename: true,
      width: 500,
      height: 300,
      crop: 'limit',
    },
    (error: any) => {
      if (error) {
        console.log(error);
        return Response.error();
      }
    }
  );
  console.log(data.rul, 'apaa?');
  return Response.json({ data: data.url });
}
