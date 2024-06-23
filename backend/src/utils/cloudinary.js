import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) =>{
  try {
    if(!localFilePath) return null;
    //upload on cloudinary
    const response =await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    })
    // console.log("File uploaded successfully: ", response.url)
    fs.unlinkSync(localFilePath)

    return response
  } catch (error) {
    fs.unlinkSync(localFilePath)
  }
}

const extractPublicId = (url) => {
  const parts = url.split('/');
  const publicIdWithExtension = parts[parts.length - 1];
  const publicId = publicIdWithExtension.split('.')[0];
  return publicId;
};

const deleteImageOnCloudinary = async (url) => {
  const publicId = extractPublicId(url);
  try {
    console.log(publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export {uploadOnCloudinary, deleteImageOnCloudinary}