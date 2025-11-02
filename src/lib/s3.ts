
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFile(file: Buffer, fileName: string) {
  const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    return `https://${bucketName}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}
