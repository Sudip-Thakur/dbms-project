import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import sql from "../db/db.js";


const addComment = asyncHandler(async(req, res)=>{
  const {content} = req.body;
  const {videoId} = req.params;
  const userId = req.user[0].id;

  const comment = await sql `
    insert into comments(userId, videoId, content)
    VALUES(${userId}, ${videoId}, ${content})
    RETURNING userId, videoId, content `

  console.log(comment)

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      comment,
      "Comment added successfully",
    )
  )
})

const getVideoComments = asyncHandler(async(req, res)=>{
  const { videoId } = req.params;
  console.log(videoId);
  const comments = await sql `
    select * from comments
    where videoId = ${videoId}
  `
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      comments,
      "Comments fetched successfully",
    )
  )
})

const editComment = asyncHandler(async(req, res)=>{
  const {content} = req.body;
  const {commentId} = req.params;
  const userId = req.user[0].id;
  const comment = await sql `
    UPDATE comments
    SET content = ${content}
    WHERE id = ${commentId} and userId=${userId}
    RETURNING userId, videoId, content 
  `
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      comment,
      "Comment edited successfully"
    )
  )
})

const deleteComment = asyncHandler(async(req, res)=>{
  const {commentId} = req.params;
  const userId = req.user[0].id;
  const comment = await sql `
    DELETE FROM comments
    WHERE id = ${commentId} and userId=${userId}
    RETURNING userId, videoId, content
  `
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      comment,
      "Comment deleted successfully"
    )
  )
})


export {
  addComment,
  getVideoComments,
  editComment,
  deleteComment
}