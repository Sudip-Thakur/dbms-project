import {v2 as cloudinary} from 'cloudinary'
import { publicEncrypt } from 'crypto';
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

const determineResourceType = (url) => {
  const extension = url.split('.').pop();
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'webm'];

  if (videoExtensions.includes(extension.toLowerCase())) {
    return 'video';
  }
  return 'image';
};

const deleteFromCloudinary = async (url) => {
  const publicId = extractPublicId(url);
  const resourceType = determineResourceType(url);
  try {
    const result = await cloudinary.uploader.destroy(publicId, {resource_type: resourceType});
    console.log('Deleted:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

const videoDuration = async (url)=>{
  const publicId = extractPublicId(url);
  console.log(publicId)
  try{
    const result = await cloudinary.api.resource(publicId, { 
      resource_type: 'video',
      media_metadata: true}
    );
    
    return result.duration;
  }catch(error){
    console.error('Error when finding duration: ', error)
    throw error
  }
}

export {
  uploadOnCloudinary, 
  deleteFromCloudinary, 
  videoDuration
};  