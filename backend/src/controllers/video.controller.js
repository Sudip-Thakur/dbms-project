import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { 
  uploadOnCloudinary,
  deleteImageOnCloudinary
 } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../db/db.js";

const uploadVideo = asyncHandler(async(req, res)=>{
  console.log(req.body)

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      req.body,
      "Video uploaded successfully"
    )
  )
})

export { uploadVideo }