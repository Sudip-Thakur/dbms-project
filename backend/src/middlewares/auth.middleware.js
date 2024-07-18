import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import sql from "../db/db.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        console.log(req.cookies);
        console.log("1")
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decodedToken);
        const user = await sql `SELECT id, username, email, fullName FROM users WHERE users.id = ${decodedToken?.id}`
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
        // console.log(user)
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})