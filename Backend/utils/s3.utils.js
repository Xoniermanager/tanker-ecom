const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");


const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});


async function listCSVFiles(bucket, prefix = "") {
  const files = [];
  let continuationToken;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });
    const response = await s3Client.send(cmd);

    const csvFiles = (response.Contents || []).filter((obj) =>
      obj.Key.toLowerCase().endsWith(".csv")
    );
    files.push(...csvFiles);
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return files;
}


async function getFileContent(bucket, key) {
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(cmd);

  return new Promise((resolve, reject) => {
    const chunks = [];
    response.Body.on("data", (chunk) => chunks.push(chunk));
    response.Body.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    response.Body.on("error", reject);
  });
}


async function uploadFile(bucket, key, body, contentType = "text/csv") {
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3Client.send(cmd);
}


async function deleteFile(bucket, key) {
  const cmd = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await s3Client.send(cmd);
}


async function moveFile(sourceBucket, sourceKey, destBucket, destKey, overrideBody) {
  const body = overrideBody ?? (await getFileContent(sourceBucket, sourceKey));
  const targetKey = destKey || sourceKey;
  await uploadFile(destBucket, targetKey, body);
  await deleteFile(sourceBucket, sourceKey);
}


async function fileExists(bucket, key) {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  s3Client,
  listCSVFiles,
  getFileContent,
  uploadFile,
  deleteFile,
  moveFile,
  fileExists,
};