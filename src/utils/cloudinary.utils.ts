import { v2 } from "cloudinary";
import fs from "fs";
import ApiError from "./apiError.utils";

v2.config({
  cloud_name: process.env.CLOUD_STORAGE_NAME,
  api_key: process.env.CLOUD_STORAGE_API_KEY,
  api_secret: process.env.CLOUD_STORAGE_API_SECRET,
});

const uploadFileToCloud = async (localFilePath: string) => {
  try {
    if (!localFilePath) return "Could not find path!"; // Could not find file path
    const profile = await v2.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // Uploaded successfully
    return profile.url;
  } catch (error: any) {
    throw new ApiError(
      400,
      "SOMETHING_WENT_WRONG!",
      "Something went wrong while uploading files to the cloud!",
      error
    );
  } finally {
    fs.unlinkSync(localFilePath); // clear file storeyed on server tem.
  }
};

export default uploadFileToCloud;
