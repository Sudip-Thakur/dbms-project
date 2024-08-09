import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import sql from "../db/db.js";

export const setUser = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await sql`SELECT id, username, email, fullName FROM users WHERE users.id = ${decodedToken?.id}`;
            
            if (user) {
                req.user = user;
            }
        }
    } catch (error) {
        // Log the error if needed
        console.error("Error decoding token:", error);
    } finally {
        next();
    }
});
