import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import sql from "../db/db.js";
import bcrypt, { compareSync, hash } from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  validateToken,
} from "../utils/jwt.js";

// generate access and refresh token
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await sql`
      select * from users 
      where id = ${userId}
      `;
    const accessToken = generateAccessToken(user[0]);
    const refreshToken = generateRefreshToken(user[0]);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

//register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password, bio } = req.body;

  const existedUser = await sql`
  select * from users 
  where users.username = ${username} or users.email = ${email}
  `;

  if (existedUser.length > 0) {
    throw new ApiError(409, "User of this email or username already exist");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const createdUser = await sql`
  insert into users(username, email, fullname, password, bio) 
  values (${username}, ${email}, ${fullname}, ${hashPassword}, ${bio})
  RETURNING username, email, fullName, bio ;
  `;

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User Created Successfully"));
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await sql`select * from users where username=${username}`;

  if (user.length == 0) {
    throw new ApiError(404, "User not Found");
  }
  const ispasswordValid = await bcrypt.compare(password, user[0].password);
  if (!ispasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user[0].id
  );

  const loggedInUser =
    await sql`select username, email, fullName from users where id = ${user[0].id}`;

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
    path :'/'
  };
  console.log("Logged in success")

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

//logout the user
const logoutUser = asyncHandler(async (req, res) => {
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", "", option)
    .cookie("accessToken", "", option)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

//change the password of the current password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user =
    await sql`select password from users where id=${req.user[0]?.id}`;
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user[0].password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);
  await sql`update users set password=${hashPassword} where id=${req.user[0]?.id}`;

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

//get current user
const currentUser = asyncHandler(async(req, res) => {
  //read avatar, username
  const user = await sql`select avatar, username, email from users where id=${req.user[0]?.id
    }`;
  return res.status(200).json(new ApiResponse(200, user[0], "Current User"));
});

//update the full name
const updateFullName = asyncHandler(async (req, res) => {
  const { fullname } = req.body;

  const user =
    await sql`update users set fullname=${fullname} where id=${req.user[0]?.id}
  RETURNING username, email, fullName`;

  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "Full name update successfully"));
});

//update avatar
const updateAvatar = asyncHandler(async (req, res) => {
  if (
    req.files &&
    Array.isArray(req.files.avatar && req.files.avatar.length > 0)
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  const avatarLocalPath = req.files.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required !");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const currentAvatarUrl =
    await sql`select avatar from users where id=${req.user[0]?.id}`;
  const result =
    await sql`update users set avatar=${avatar.url} where id=${req.user[0]?.id} 
  RETURNING username, avatar`;

  if (currentAvatarUrl[0].avatar) {
    await deleteFromCloudinary(currentAvatarUrl[0].avatar);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result[0], "Avatar updated successfully"));
});

//update coverImage
const updateCoverImage = asyncHandler(async (req, res) => {
  if (
    req.files &&
    Array.isArray(req.files.coverImage && req.files.coverImage.length > 0)
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  const coverImageLocalPath = req.files.coverImage[0].path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Avatar is required !");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    throw new ApiError(400, "Avatar file is required");
  }

  const currentCoverImageUrl =
    await sql`select coverimage from users where id=${req.user[0]?.id}`;
  const result =
    await sql`update users set coverimage=${coverImage.url} where id=${req.user[0]?.id} 
  RETURNING username, coverimage`;

  if (currentCoverImageUrl[0].cover) {
    await deleteFromCloudinary(currentCoverImageUrl[0].cover);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result[0], "Cover Image updated successfully"));
});

//update the bio
const updateBio = asyncHandler(async (req, res) => {
  const { bio } = req.body;

  const user = await sql`update users set bio=${bio} where id=${req.user[0]?.id}
  RETURNING username, email, bio`;

  return res
    .status(200)
    .json(new ApiResponse(200, user[0], "Bio update successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  currentUser,
  updateFullName,
  updateAvatar,
  updateCoverImage,
  updateBio,
};
