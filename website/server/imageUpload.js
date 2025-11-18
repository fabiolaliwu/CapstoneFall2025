import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";

dotenv.config();


// client config
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload image to amazon S3, this function will return the URL for the image
const uploadImage = async (base64String, fileName = "image") => {
  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 string");
    }

    const mimetype = matches[1]; // e.g., image/jpeg
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Determine file extension from mimetype
    const ext = mimetype.split("/")[1]; //  jpeg, png, etc file type
    const fullFileName = `${fileName}-${Date.now()}.${ext}`;

    // S3 upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${fullFileName}`,
      Body: buffer,
      ContentType: mimetype,
    };
    console.log("Uploading image ", params);

    // Upload to S3
    const parallelUpload = new Upload({
      client: s3Client,
      params,
    });
    // Wait for upload to complete
    const result = await parallelUpload.done();
    
    // Return the S3 URL
    const s3Url = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    
    return {
      url: s3Url,
      key: params.Key,
    };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error(`Failed to upload image to S3: ${error.message}`);
  }
};

export default uploadImage;

// Key workflow reference by https://medium.com/how-to-react/how-to-upload-files-on-an-s3-bucket-in-react-js-97a3ccd519d1