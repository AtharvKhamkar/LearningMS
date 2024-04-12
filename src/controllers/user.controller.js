import prisma from "../DataBase/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessAndRefreshToken, hashPassword, isPasswordCorrect } from "../utils/user.functions.js";


const registerUser = asyncHandler(async (req, res) => {
    //get username,fullname,email,password,role from req.body
    //if user want to upload avatar picture or cover picture user can select file req.file
    //bcrypt the password
    //then create the user in database and send response
    const { username, fullname, email, password, role } = req.body;

    const isRegistered = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isRegistered) {
        throw new ApiError(400,"User is already registered.Please login")
    }

    const hashedPassword = await hashPassword(password);

    const registeredUser = await prisma.user.create({
        data: {
            username,
            fullname,
            email,
            password:hashedPassword,
            role
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                registeredUser,
                "User registered successfully"
        )
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //get email and password from req.body
    //check from that email user is registered or not..If not throw error
    //get password and compare with hashed password using bcrypt.compare
    //If the password is correct create accessToken and refreshToken
    //login in user add refreshToken in database and send both token as a cookie

    const { email, password } = req.body;
    
    //checks first user is registered in our system or not
    const isRegistered = await prisma.user.findUnique({
        where: {
            email
        }
    })
   
    if (!isRegistered) {
        throw new ApiError(400, "Please register first");
    }
    
    //checks password is correct or not
    const checkPassword = await isPasswordCorrect(isRegistered, password);

    if (!checkPassword) {
        throw new ApiError(400, "Password is incorrect");
    }
    
    //Tokens are generated and refreshToken saved in database using the function
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(isRegistered.id);

    //get loggedIn user 
    const loggedInUser = await prisma.user.findUnique({
        where: {
            id: isRegistered.id
        },
        select: {
            id: true,
            username: true,
            fullname: true,
            email: true,
            avatar: true,
            coverImage: true,
            role:true
        }
    });

    const options = {
        httpOnly: true,
        secure: true
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,accessToken
                },
                "User loggedIn successfully"
        )
    )
})

export { loginUser, registerUser };

