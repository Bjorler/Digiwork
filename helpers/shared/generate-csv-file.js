import { readFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { S3Service } from "@octopy/serverless-aws";
import { createObjectCsvWriter } from "csv-writer";

export const generateCSVFile = async (data, fileName) => {
  const s3 = new S3Service({
    accessKeyId: process.env.ACCESS_KEY_ID_S3,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_S3,
    bucketName: process.env.BUCKET_NAME,
    region: process.env.REGION_BUCKET,
  }, { useS3Plugin: false })

  fileName = fileName + ".csv";
  const tempFilesPath = "/tmp"

  if (!existsSync(tempFilesPath)) {
    mkdirSync(tempFilesPath)
  };
  
  const temporalFile = `${tempFilesPath}/${fileName}`;

  const csvWriter = createObjectCsvWriter({
    path: temporalFile,
    header: data.headers,
    fieldDelimiter: ",",
    encoding: process.env.CSV_ENCODING
  });

  let url = '';
  try {
    await csvWriter.writeRecords(data.content);
    const fileContent = readFileSync(temporalFile, { encoding: "utf-8" })

    url = await s3.uploadFile(fileName, fileContent, { createRandomName: false })
    unlinkSync(temporalFile) // local delete
  } catch (error) {
    throw { scode: "exportToSVCError" }
  }
  return { url };
};