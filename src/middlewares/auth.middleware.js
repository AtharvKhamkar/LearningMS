import jwt from "jsonwebtoken";
import prisma from "../DataBase/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJWT = asyncHandler(async (req, res,next) => {
    try {

        //get token from cookies
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        
        //decode that token
        const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET)
        

        //retrive that user from database using id from decoded token
        const user = await prisma.user.findUnique({
            where: {
                id:decodedToken?.id
            }
        })

        if (!user) {
            throw new ApiError(400,"Invalid Access Token")
        }
       

        //Pass all user information with request
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }
})

export { verifyJWT };
