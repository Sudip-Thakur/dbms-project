import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { 
  uploadOnCloudinary,
  deleteFromCloudinary,
  videoDuration,
 } from "../utils/cloudinary.js";
import sql from "../db/db.js";


// const isValidVideoId = async(videoId)=>{
//   const result = await sql `SELECT * FROM videos where video=${videoId}`
//   if(result.length ===0){
//     throw new ApiError(404, "Video not found")
//   }
//   return true
// }
const uploadVideo = asyncHandler(async(req, res)=>{
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
  
  const uploadedVideo = await sql `insert into videos(videoLink, thumbnail, title, description, duration , owner, isPublished, views)
  values(${video.url}, ${thumbnail.url}, ${title}, ${description}, ${duration}, ${req.user[0]?.id}, ${isPublished==='public'? true:false},${0})
  returning id, videoLink, thumbnail, title, description, duration, views, createdAt `

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
  const video = await sql `select v.videoLink, v.thumbnail, v.title, v.description, v.duration, v.views,
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
  const video = await sql `select owner, videoLink, thumbnail from videos where id=${videoId}`
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

const updateVideo = asyncHandler(async(req, res)=>{
  const {videoId} = req.params;
  const {title, description} = req.body;

  const video = await sql `select owner, thumbnail from videos where id=${videoId}`
  if(video.length===0){
    throw new ApiError(404, "Video Not found.")
  }

  if(video[0].owner !== req.user[0].id){
    throw new ApiError(401, "Unauthorized Access")
  }

  if(title){
    const updatedVideo = await sql `update videos set title=${title} where id=${videoId}`
  }

  if(description){
    const updatedVideo = await sql `update videos set description=${description} where id=${videoId}`
  }

  if(req.files && req.files.thumbnail && req.files.thumbnail[0]){
    const thumbnailLocalPath = req.files.thumbnail[0].path

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(thumbnail){
      if(video[0].thumbnail){
        await deleteFromCloudinary(video[0].thumbnail)
        await sql `update videos set thumbnail=${thumbnail.url} where id=${videoId}`
      }
    }
    console.log("Thumbnail Updated")
  }

  const updatedDetails = await sql `select title, description, thumbnail from videos where id=${videoId}`

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      updatedDetails,
      "Video updated successfully"
    )
  )

})


const togglePublishStatus = asyncHandler(async (req, res)=>{
  const {videoId} = req.params;

  console.log(videoId)
  const video = await sql `select owner, isPublished from videos where id=${videoId}`

  if(video.length===0){
    throw new ApiError(404, "Video Not found.")
  }

  if(video[0].owner !== req.user[0].id){
    throw new ApiError(401, "Unauthorized Access")
  }

  const updatedVideo = await sql `update videos set isPublished=${!video[0].ispublished} where id=${videoId}
  RETURNING id, isPublished`

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      updatedVideo,
      "Video status changed successfully"
    )
  )
})


const getRandomVideo = asyncHandler(async(req, res)=>{
  const videos = await sql `
    select * from videos 
    where isPublished=true 
    order by random() 
    limit 10`
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      videos,
      "Videos fetched successfully"
      )
  )
})


export { 
  uploadVideo,
  getVideo,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
  getRandomVideo
}