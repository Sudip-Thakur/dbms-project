import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sql from "../db/db.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user[0].id;

  const similarPlaylist = await sql`
  SELECT * FROM playlists WHERE name = ${name} AND owner = ${userId}
  `;

  if (similarPlaylist.length > 0) {
    throw new ApiError(400, "Playlist of similar name exists");
  }

  const createdPlaylist =
    await sql`insert into playlists(name, description, owner)
    values(${name}, ${description}, ${userId}) 
    returning name, description, owner`;
  return res
    .status(201)
    .json(
      new ApiResponse(201, createdPlaylist, "Playlist created successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const playlistId = req.params.playlistId;
  const userId = req.user[0].id;
  const playlist = await sql`
  SELECT * from playlists 
  WHERE id=${playlistId} and owner=${userId}`;
  if (playlist.length === 0) {
    throw new ApiError(404, "Playlist not found");
  }

  if (name) {
    const similarPlaylist = await sql`
    SELECT * FROM playlists WHERE name = ${name} AND owner = ${userId}
    `;
    if (similarPlaylist.length > 0) {
      throw new ApiError(400, "Playlist of similar name exists");
    }
    await sql`
    UPDATE playlists SET name=${name} WHERE id=${playlistId} and owner=${userId}
    `;
  }
  if (description) {
    await sql`
    UPDATE playlists SET description = ${description} WHERE id = ${playlistId} and owner=${userId}
    `;
  }
  const updatedPlaylist = await sql` 
    SELECT name, description, owner from playlists 
    WHERE id=${playlistId}
    `;

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.playlistId;
  const userId = req.user[0].id;
  const playlist = await sql`
  SELECT * from playlists
  WHERE id=${playlistId} and owner=${userId}
  `;
  if (playlist.length === 0) {
    throw new ApiError(404, "Playlist not found");
  }
  await sql`
  DELETE FROM playlists WHERE id=${playlistId} and owner=${userId}
  RETURNING name, description`;

  return res
    .status(200)
    .json(new ApiResponse(200, [], "Playlist deleted successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.playlistId;
  const userId = req.user[0].id;
  const videoId = req.params.videoId;

  //check if the video and playlist exist or not
  const video = await sql`
  SELECT * from videos
  WHERE id=${videoId} and isPublished=true
  `;
  if (video.length === 0) {
    throw new ApiError(404, "Video not found");
  }

  const playlist = await sql`
  SELECT * from playlists
  WHERE id=${playlistId} and owner=${userId}
  `;
  if (playlist.length === 0) {
    throw new ApiError(404, "Playlist not found");
  }

  //check if the video is already in the playlist
  const videoInPlaylist = await sql`
  SELECT * from playlist_videos
  WHERE playlistId=${playlistId}
  AND videoId=${videoId}
  `;
  if (videoInPlaylist.length > 0) {
    throw new ApiError(400, "Video already in the playlist");
  }
  //add the video to the playlist
  const addedVideo = await sql`
  INSERT INTO playlist_videos (playlistId, videoId)
  VALUES (${playlistId}, ${videoId})
  RETURNING playlistId, videoId
  `;
  return res
    .status(200)
    .json(
      new ApiResponse(200, addedVideo, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.playlistId;
  const userId = req.user[0].id;
  const videoId = req.params.videoId;

  //check if video playlist belong to that user
  const playlist = await sql`
  SELECT * from playlists
  WHERE id=${playlistId} and owner=${userId}
  `;
  if (playlist.length === 0) {
    throw new ApiError(404, "Playlist not found");
  }

  //check if the video is in playlist or not 
  const videoInPlaylist = await sql`
  SELECT * from playlist_videos pv
  JOIN playlists p
  ON pv.playlistId =p.id
  WHERE pv.playlistId=${playlistId}
  AND pv.videoId=${videoId}
  AND p.owner=${userId}
  `;
  if (videoInPlaylist.length === 0) {
    throw new ApiError(404, "Video not found in playlist");
  }
  //remove the video from the playlist
  const removedVideo = await sql`
  DELETE FROM playlist_videos
  WHERE playlistId=${playlistId}
  AND videoId=${videoId}
  `
})

//get the playlist of the logged in user
const getPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user[0].id;
  const playlist = await sql`
  SELECT * from playlists
  WHERE owner=${userId}
  `;
  if (playlist.length === 0) {
    return res
    .status(200)
    .json(
      new ApiResponse(200, [],"No Playlist Created Yet") 
    );
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200, playlist,"Yours Playlists")
  )
})

//get the videos of a particular playlist of currently used user
const getPlaylistVideos = asyncHandler(async (req, res) => {
  const userId = req.user[0].id;
  const playlistId = req.params.playlistId;

  //check if the playlist belong to the user or not 
  const playlist = await sql`
  SELECT * from playlists
  WHERE owner=${userId}
  AND id=${playlistId}
  `;
  if (playlist.length === 0) {
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        "Playlist Not found"
      )
    )
  }
  //get the videos of the playlist
  const playlistVideos = await sql`
  SELECT * from playlist_videos
  WHERE playlistId=${playlistId}
  `;
  if (playlistVideos.length === 0) {
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlistVideos,
        "No Videos in this Playlist"
      )
    )
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200, playlistVideos,"Videos of the Playlist")
  )
})

export { 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist, 
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylistVideos,
  getPlaylist
};
