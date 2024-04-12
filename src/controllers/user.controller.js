import prisma from "../DataBase/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;

    console.log(avatarLocalPath);
    console.log(coverLocalPath)

    let [avatar, coverImage] = await Promise.all([uploadOnCloudinary(avatarLocalPath), uploadOnCloudinary(coverLocalPath)]);

    console.log(avatar.url);
    console.log(coverImage.url)

 
    const registeredUser = await prisma.user.create({
        data: {
            username,
            fullname,
            email,
            password: hashedPassword,
            avatar: avatar.url || "",
            coverImage:coverImage.url || "",
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

const profileDetails = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const user = await prisma.user.findUnique({
        where: {
            id
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
    })

    
    if (!user) {
        throw new ApiError(400,"User not found")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User profile fetched successfully"
        )
    )
})

const updateProfile = asyncHandler(async (req, res) => {
    const { id } = req.user;

    console.log(req?.body?.username);
    console.log(req?.body?.email);
    console.log(req?.body?.fullname);
    console.log(req?.body?.role);

    const updatedUser = await prisma.user.update({
        where: {
            id
        },
        data: {
            username: req?.body?.username,
            email: req?.body?.email,
            fullname: req?.body?.fullname,
            role:req?.body?.role
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
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "Successfully updated user information"
        )
    )
})

const updateProfileImages = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const avatarLocalFilePath = req.files?.avatar[0]?.path;
    const coverLocalFilePath = req.files?.coverImage[0]?.path;
    

    //If user want to updated only avatar or coverImage then only upload Image on cloudinary else update with previous image urls 
    if (avatarLocalFilePath) {
        var avatar = await uploadOnCloudinary(avatarLocalFilePath);
    }

    if (coverLocalFilePath) {
        var coverImage = await uploadOnCloudinary(coverLocalFilePath);
    }

    const upadatedUser = await prisma.user.update({
        where: {
            id
        },
        data: {
            avatar: avatar.url || req.user?.avatar,
            coverImage: coverImage.url || req.user?.coverImage
        },
        select: {
            username: true,
            avatar: true,
            coverImage:true
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                upadatedUser,
                "User profile pictures updated successfully"
        )
    )

    
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.user;

    const deletedUser = await prisma.user.delete({
        where: {
            id
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                { deleted_user: deletedUser.username },
                "User deleted successfully"
        )
    )
})

export { deleteUser, loginUser, profileDetails, registerUser, updateProfile, updateProfileImages };

