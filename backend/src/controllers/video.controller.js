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
//TODO videolink adding 
const getVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?.[0]?.id || null; // Ensure userId is null if not authenticated

  // Query to get video details
  const videoDetails = await sql`
      SELECT 
          v.title AS title,
          v.views AS view_count,
          v.createdAt AS time,
          u.fullName AS channel_name,
          u.id AS channel_id,
          u.avatar AS avatar
      FROM videos v
      JOIN users u ON u.id = v.owner
      WHERE v.id = ${videoId}
  `;

  if (videoDetails.length === 0) {
      throw new ApiError(404, "Video Not Found");
  }

  // Query to get subscription count
  const subCountResult = await sql`
      SELECT COUNT(*) AS sub_count
      FROM subscriptions s
      WHERE s.subscribedTo = ${videoDetails[0].channel_id}
  `;

  // Query to get like count
  const likeCountResult = await sql`
      SELECT COUNT(*) AS like_count
      FROM likes l
      WHERE l.videoId = ${videoId}
  `;

  // Query to check if the user is subscribed
  const isSubscribed = userId
      ? await sql`
          SELECT EXISTS (
              SELECT 1
              FROM subscriptions s
              WHERE s.subscriber = ${userId} AND s.subscribedTo = ${videoDetails[0].channel_id}
          ) AS subscribed
      `
      : [{ subscribed: false }];

  // Query to check if the user liked the video
  const isLiked = userId
      ? await sql`
          SELECT EXISTS (
              SELECT 1
              FROM likes l
              WHERE l.userId = ${userId} AND l.videoId = ${videoId}
          ) AS liked
      `
      : [{ liked: false }];

  // Query to get comments
  const comments = await sql`
      SELECT 
          c.content,
          c.createdAt AS time,
          u.username,
          u.avatar
      FROM comments c
      JOIN users u ON u.id = c.userId
      WHERE c.videoId = ${videoId}
      ORDER BY c.createdAt DESC
  `;

  const video = {
      ...videoDetails[0],
      sub_count: parseInt(subCountResult[0].sub_count, 10),
      like_count: parseInt(likeCountResult[0].like_count, 10),
      subscribed: isSubscribed[0].subscribed,
      liked: isLiked[0].liked,
      comments: comments.map(comment => ({
          content: comment.content,
          time: comment.time,
          username: comment.username,
          avatar: comment.avatar
      }))
  };

  return res.status(200).json(
      new ApiResponse(
          200,
          video,
          "Video fetched successfully"
      )
  );
});





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
      }
      await sql `update videos set thumbnail=${thumbnail.url} where id=${videoId}`
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
  SELECT videos.id,videos.owner, videos.thumbnail, videos.title, videos.views, users.fullName, users.avatar, videos.views, videos.createdAt
  FROM videos 
  JOIN users ON videos.owner = users.id
  limit 24`
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
//recommendation
const searchVideo = asyncHandler(async(req, res)=>{
  const searchKeyword = req.params.searchKeyword
  console.log(searchKeyword)
  const videos = await sql `
  SELECT videos.id,videos.owner, videos.thumbnail, videos.title, videos.views, users.fullName, users.avatar, videos.views, videos.createdAt
  FROM videos 
  JOIN users ON videos.owner = users.id
  WHERE videos.id IN (SELECT search_results(${searchKeyword},24));

  `
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      videos,
      "Searched Results"
    )
  )
})

const getSubscribedRecommendation = asyncHandler(async(req, res)=>{
  const userId = req.user[0].id
  const videos = await sql `
  select "id" ,"title", "description" from videos 
  where "id" in(select subscribed_recommendation(${userId}, 10))`;

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      videos,
      "Recommended Videos"
    )
  )
})

const getRecommendation = asyncHandler(async(req, res)=>{
  const userId = req.user[0].id
  const videos = await sql `
SELECT videos.thumbnail, videos.title, videos.views, users.username, users.avatar 
FROM videos 
JOIN users ON videos.owner = users.id
WHERE videos.id IN (SELECT get_recommendation(${userId}));`;
  console.log(videos)
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      videos,
      "Recommended Videos according to recent activity."
    )
  )
})

//get all video of a particular channel
const getChannelVideos = asyncHandler(async(req, res)=>{
  const {channelId} = req.params
  const videos = await sql `
  SELECT videos.id,videos.owner, videos.thumbnail, videos.title, videos.views, users.fullName, users.avatar, videos.views, videos.createdAt from
  videos
  JOIN users ON videos.owner = users.id
  WHERE videos.owner = ${channelId};`;
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      videos,
      "Videos of a particular channel"
    ));
  }
)
export { 
  uploadVideo,
  getVideo,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
  getRandomVideo,
  getRecommendation,
  getSubscribedRecommendation,
  searchVideo,
  getChannelVideos
}