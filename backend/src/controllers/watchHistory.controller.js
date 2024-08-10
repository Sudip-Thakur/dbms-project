import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../db/db.js";

const addToWatched = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const currentUser = req.user[0];

  // Check if the video has already been watched by the user
  const alreadyWatched = await sql`
    SELECT * FROM watch_history WHERE userId = ${currentUser.id} AND videoId = ${videoId}
  `;

  // Increment the view count of the video
  await sql`
    UPDATE videos
    SET views = views + 1
    WHERE id = ${videoId}
  `;

  if (alreadyWatched.length === 0) {
    // If the video is not in the watch history, insert it
    await sql`
      INSERT INTO watch_history (userId, videoId) VALUES (${currentUser.id}, ${videoId})
    `;
  } else {
    // If the video is already in the watch history, update the watched timestamp
    await sql`
      UPDATE watch_history
      SET watchedAt = CURRENT_TIMESTAMP
      WHERE userId = ${currentUser.id} AND videoId = ${videoId}
    `;
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        addedToHistory: true
      },
      "Video added to watch history"
    )
  );
});


const getWatchedVideo = asyncHandler(async (req, res) => {
  const currentUser = req.user[0];
  
  const watchedVideos = await sql`
    SELECT 
      w.videoId,
      v.title AS videoTitle,
      v.thumbnail AS videoThumbnail,
      v.views AS videoViews,
      v.createdAt AS videoCreatedAt,
      u.id AS channelId,
      u.username AS channelName,
      u.avatar AS channelAvatar,
      w.watchedAt
    FROM watch_history w
    JOIN videos v ON w.videoId = v.id
    JOIN users u ON v.owner = u.id
    WHERE w.userId = ${currentUser.id}
    ORDER BY w.watchedAt DESC
  `;

  return res.status(200).json(
    new ApiResponse(
      200,
      watchedVideos,
      "watched videos"
    )
  );
});



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

