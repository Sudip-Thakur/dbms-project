import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../db/db.js";

const toggleVideoLike = asyncHandler( async(req, res)=>{
  const { videoId } = req.params;
  const currentUser = req.user[0];

  const liked = await sql `select * from likes where userId=${currentUser.id} and videoId=${videoId} `

  if(liked.length ===0){
    await sql `
      insert into likes(videoId, userId)
      VALUES (${videoId}, ${currentUser.id});
    `
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          liked:true
        },
        "Video liked"
      )
    )
  }
  else{
    await sql `
      delete from likes 
      where userId=${currentUser.id} and videoId=${videoId} 
    `
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          liked:false
        },
        "Video unliked"
      )
    )
  }
})

const getLikedVideo = asyncHandler( async(req, res)=>{
  const userId = req.user[0].id;
  console.log(userId)
  const likedVideos = await sql `
SELECT videos.id,videos.owner, videos.thumbnail, videos.title, videos.views, users.fullName, users.avatar, videos.views, videos.createdAt from likes 
join videos
    on likes.videoId = videos.id
    join users
    on videos.owner=users.id
    where likes.userId=${userId}
  `
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      likedVideos,
      "Liked videos"
    )
  )

})
export {
  toggleVideoLike,
  getLikedVideo
}