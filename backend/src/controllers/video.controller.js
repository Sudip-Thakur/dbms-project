import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { 
  uploadOnCloudinary,
  deleteFromCloudinary,
  videoDuration,
 } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../db/db.js";


// const isValidVideoId = async(videoId)=>{
//   const result = await sql `SELECT * FROM videos where video=${videoId}`
//   if(result.length ===0){
//     throw new ApiError(404, "Video not found")
//   }
//   return true
// }
const uploadVideo = asyncHandler(async(req, res)=>{
  console.log(req.body)
  const {title, description, isPublished} = req.body
  console.log(req.files)

  const videoLocalPath = req.files.video[0]?.path

  const thumbnailLocalPath = req.files.thumbnail[0]?.path

  if(!videoLocalPath){
    throw  new ApiError(400, "Video is required")
  }

  if(!thumbnailLocalPath){
    throw  new ApiError(400, "Thumbnail is required")
  }

  const video = await uploadOnCloudinary(videoLocalPath)
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

  const duration = Math.round(await videoDuration(video.url)) 
  console.log(duration)
  
  const uploadedVideo = await sql `insert into videos(video, thumbnail, title, description, duration , owner, isPublished)
  values(${video.url}, ${thumbnail.url}, ${title}, ${description}, ${duration}, ${req.user[0]?.id}, ${isPublished==='public'? true:false})
  returning id, video, thumbnail, title, description, duration, views, createdAt `

  console.log(uploadedVideo);

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      uploadedVideo,
      "Video uploaded successfully"
    )
  )
});

const getVideo = asyncHandler(async (req,res)=>{
  const { videoId } = req.params
  console.log(videoId);
  const video = await sql `select v.video, v.thumbnail, v.title, v.description, v.duration, v.views,
   (select u.fullname from users u
   where u.id =v.owner) as channel 
   from videos v
   where v.id = ${videoId}`

   if(video.length === 0){
    throw new ApiError(404, "Video Not found")
   }

   console.log(video);

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      video[0],
      "Video fetched successfully"
    )
  )
})

const deleteVideo = asyncHandler(async(req, res)=>{
  const { videoId } = req.params
  console.log(videoId);
  const video = await sql `select owner, video, thumbnail from videos where id=${videoId}`
  console.log(video)

  if(video.length === 0){
    throw new ApiError(404, "Video Not found.")
  }

  if(video[0].owner !== req.user[0].id){
    throw new ApiError(401, "Unauthorized Access")
  }
 

  const deletedVideo = await sql `delete from videos where id=${videoId}`
  console.log(deletedVideo)
  if(video[0].video){
    await deleteFromCloudinary(video[0].video)
  }
  if(video[0].thumbnail){
    await deleteFromCloudinary(video[0].thumbnail)
  }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      deletedVideo,
      "Video deleted successfully"
    )
  )
})

const updateVideo = asyncHandler(async(req, res)=>{})

export { 
  uploadVideo,
  getVideo,
  deleteVideo

}