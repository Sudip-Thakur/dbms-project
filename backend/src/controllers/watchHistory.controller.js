import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../db/db.js";

const addToWatched = asyncHandler(async(req, res)=>{
  const { videoId} = req.params
  const currentUser = req.user[0]
  const alreadyWatched = await sql `
    select * from watch_history where userId=${currentUser.id} and videoId=${videoId}
  `
  if(alreadyWatched.length===0){
    await sql `
    insert into watch_history (userId, videoId) values (${currentUser.id}, ${videoId})
    `
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          addedToHistory: true
        },
        "video added to watch history"
      )
    )
  }
  else{
    await sql `
      update watch_history set watchedAt=CURRENT_TIMESTAMP where userId=${currentUser.id} and videoId=${videoId}
    `
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          addedToHistory: true
        },
        "video added to watch history"
      )
    )

  }


})

const getWatchedVideo = asyncHandler(async(req, res)=>{
  const currentUser = req.user[0]
  const watchedVideo = await sql `
    select w.videoId from watch_history w
    where w.userId=${currentUser.id}
    ORDER BY w.watchedAt DESC
  `
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      watchedVideo,
      "watched videos"
    )
  )
})


const deleteOneWatchHistory = asyncHandler(async(req, res)=>{
  const currentUser = req.user[0]
  const {videoId} = req.params
  await sql `
    delete from watch_history where userId=${currentUser.id} and videoId=${videoId}
  `
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {
        deleted: true
      },
      "video deleted from watch history"
    )
  )

})

const clearWatchHistory = asyncHandler(async(req, res)=>{
  const currentUser = req.user[0]
  await sql `
  delete from watch_history where userId=${currentUser.id}
  `
  return res
  .status(200)
  .json(
     new ApiResponse(
      200,
      {
        deleted: true
      },
      "watch history cleared"
     )
  )

})

export {
  addToWatched,
  getWatchedVideo,
  deleteOneWatchHistory,
  clearWatchHistory
}

