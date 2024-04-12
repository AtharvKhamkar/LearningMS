import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../DataBase/db.config.js";
import { ApiError } from "./ApiError.js";

const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        throw new ApiError(400, `${error.message}`);
    }
}

const isPasswordCorrect = async (isRegistered,password) => {
    try {
        return await bcrypt.compare(password, isRegistered.password);
    } catch (error) {
        throw new ApiError(400, `${error.message}`);
    }
}

const generateAccessToken = async (id,email,username,fullname) => {
    return jwt.sign(
        {
            id,
            email,
            username,
            fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

const generateRefreshToken = async (id) => {
    return jwt.sign(
        {
            id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        //find user from the database from given userId
        const user = await prisma.user.findUnique({
            where: {
                id:userId
            }
        })
        
        //generate accessToken and refreshToken
        const accessToken = await generateAccessToken(user.id,user.email,user.username,user.fullname)
        const refreshToken = await generateRefreshToken(user.id);
        
        //add the refreshToken for that user
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken
            }
        });


        //pass access and refresh Token
        return { accessToken, refreshToken };


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

export { generateAccessAndRefreshToken, generateAccessToken, generateRefreshToken, hashPassword, isPasswordCorrect };

