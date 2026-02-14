import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

let client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: process.env.AWS_REGION ?? "us-east-1",
    });
  }
  return client;
}

export async function uploadToS3(
  bucket: string,
  key: string,
  body: Buffer | string,
): Promise<void> {
  const s3 = getS3Client();
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
    }),
  );
}

export async function downloadFromS3(
  bucket: string,
  key: string,
): Promise<Buffer | null> {
  const s3 = getS3Client();
  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    const bytes = await response.Body?.transformToByteArray();
    return bytes ? Buffer.from(bytes) : null;
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.name === "NoSuchKey"
    ) {
      return null;
    }
    throw err;
  }
}
