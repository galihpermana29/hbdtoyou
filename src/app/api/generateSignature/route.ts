import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'ddlus5qur',
  api_key: '221841315742512',
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: any, res: any) {
  let signature = '';
  try {
    const resBody = await req.json();
    const { paramsToSign } = resBody;
    // Generate a signature for the given parameters
    signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!
    );
  } catch (error) {
    return Response.error();
  }

  return Response.json({ signature });
}
