import prisma from "../DataBase/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { checkInstructorOfCourse } from "../utils/course.function.js";

const addContent = asyncHandler(async (req, res) => {
    //get courseId from req.params
    //get title,description from req.body
    //get thumbnail and video LocalPath from req.files
    //first check userId (from req.user.id) is the instructor of that course
    //then upload thumbnail and video file on cloudinary

    const { course_id } = req.params;
    const { title, description } = req.body;
    const  user  = req.user;

    const course = await checkInstructorOfCourse(user.id, course_id);

    if (!course) {
        throw new ApiError(400, "You have no right to add content in course");
    }
    
    //get local file path
    const videoFileLocalPath = req.files?.video[0]?.path;
    const thumbnailFileLocalPath = req.files?.thumbnail[0]?.path;
    
    //upload video and thumbnail on cloudinary
    const thumbnail = await uploadOnCloudinary(thumbnailFileLocalPath);
    const video = await uploadOnCloudinary(videoFileLocalPath);
 
    const addedContent = await prisma.content.create({
        data: {
            course_id,
            title,
            description,
            thumbnail: thumbnail.url,
            video: video.url,
            duration: Math.ceil(video.duration)
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                addedContent,
                "Content added successfully"
        )
    )
})

const getContent = asyncHandler(async (req, res) => {
    const { course_id } = req.params;

    const allContent = await prisma.content.findMany({
        where: {
            course_id
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                allContent,
                "Successfully fetched content of the course"
        )
    )
})

const updateContent = asyncHandler(async (req, res) => {
    //send course_id from req.body
    //get content_id from req.params
    //Only instructor of a that course can update content
    //get videoFile path and thumbnailFile path from req.files
    //retrive content from content table and update

    const course_id = req.body?.course_id;
    const { id } = req.params;
    const user = req.user;

    const course = await checkInstructorOfCourse(user.id, course_id);
    if (!course) {
        throw new ApiError(400, "You can't update content of the course");
    }

    //only upload video and thumbnail to cloudinary whern video and thumbnail file selected for upload
    if (req.files.video && req.files.thumbnail) {
        var videoLocalFilePath = await req?.files?.video[0]?.path || "";
        var thumbnailFileLocalPath = await req?.files?.thumbnail[0]?.path || "";
    }

    if (videoLocalFilePath) {
        var video = await uploadOnCloudinary(videoLocalFilePath);
    }

    if (thumbnailFileLocalPath) {
        var thumbnail = await uploadOnCloudinary(thumbnailFileLocalPath);
    }

    const updateContent = await prisma.content.update({
        where: {
            id
        },
        data: {
            title: req?.body?.title,
            description: req?.body?.description,
            thumbnail:thumbnail?.url,
            video: video?.url,
            duration:Math.ceil(video?.duration)
            
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                updateContent,
                "Successfully updated content"
        )
    )
})

const deleteContent = asyncHandler(async (req, res) => {
    //get contentId from req.params
    //only the instructor of that course can delete content in the course

    const { id } = req.params;
    const user = req.user;
    
    //check the content is available in the database
    const checkContent = await prisma.content.findUnique({
        where: {
            id
        },
        include: {
            course: {
                select: {
                    instructorId:true
                }
            }
        }
    });

    if (!checkContent) {
        throw new ApiError(400, "Content not found");
    }
    
    //check whether the user is instructor of that course
    if (user.id !== checkContent.course.instructorId) {
        throw new ApiError(400, "You can not delete content in the course");
    }
    
    //delete the content from that course
    const deletedContent = await prisma.content.delete({
        where: {
            id
        }
    });

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    deleted_content:deletedContent.title
                },
                "Successfully deleted content from course"
        )
    )

    
})

export { addContent, deleteContent, getContent, updateContent };

