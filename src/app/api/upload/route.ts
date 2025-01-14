import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: any, res: any) {
  cloudinary.config({
    cloud_name: 'dxuumohme',
    api_key: '886125678413288',
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  });

  const resBody = await req.json();
  const { image, type } = resBody;
  const data = await cloudinary.uploader.upload(
    image,
    {
      use_filename: true,
      ...(type === 'free'
        ? { aspect_ratio: '1.5', width: 500, crop: 'crop' }
        : null),
    },
    (error: any) => {
      if (error) {
        return Response.error();
      }
    }
  );
  return Response.json({ data: data.url });
}
