import prisma from "../DataBase/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkInstructorOfCourse } from "../utils/course.function.js";


const addCourse = asyncHandler(async (req, res) => {
    //First use middleware checkInstructor to check whether user is instructor or not
    //get title,description,duration,price,published from req.body
    //check for title.If it is given to other course throw error
    //get instructorId from req.user

    const { title, description, duration, price } = req.body;
    const { id } = req.user;

    //check title
    const checkTitle = await prisma.course.findUnique({
        where: {
            title
        }
    })

    if (checkTitle) {
        throw new ApiError(400, "Please select another title");
    }

    const createdCourse = await prisma.course.create({
        data: {
            instructorId: id,
            title,
            description,
            duration,
            price:Number(price)
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdCourse,
                "Successfully added course"
        )
    )
})

const publishCourse = asyncHandler(async (req, res) => {
    //only owner of that course has right to publish course
    //get userId or InstructorId through req.user
    //pass courseId through params
    //find course using that Id match req.user.id = instructorId then only user have right to publish course

    const { id } = req.params;
    const user = req.user;

    const course = await checkInstructorOfCourse(user.id, id);

    if (!course) {
        throw new ApiError(400, "Unable to publish the course");
    }


    
    //set the  published field to true
    const updatedCourse = await prisma.course.update({
        where: {
            id
        },
        data: {
            published:true
        },
        select: {
            title:true,
            description:true,
            published:true
        }

    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                updatedCourse,
                "Successfully published course"
        )
    )
})

const allCourses = asyncHandler(async (req, res) => {
    //only published courses should be displayed

    const courses = await prisma.course.findMany({
        where: {
            published:true
        },
        include: {
            instructor: {
                select: {
                    fullname:true
                }
            }
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                courses,
                "Successfully fetched all courses"
        )
    )
})

const getCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const singleCourse = await prisma.course.findUnique({
        where: {
            id,
            published:true
        },
        include: {
            instructor: {
                select: {
                    fullname:true
                }
            }
        }
    })

    if (!singleCourse) {
        throw new ApiError(401, "Course not found");
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                singleCourse,
                "Course details fetched successfully"
        )
    )
})

const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    const course = await checkInstructorOfCourse(user?.id, id);

    if (!course) {
        throw new ApiError(400, "Unable to update course");
    }

    const updatedCourse = await prisma.course.update({
        where: {
            id
        },
        data: {
            title: req.body?.title,
            description: req.body?.description,
            duration: req.body?.duration,
            price: Number(req.body?.price),
            published: req.body?.published
        }
    });

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                updatedCourse,
                "Successfully updated course information"
        )
    )
})

const deleteCourse = asyncHandler(async (req, res) => {
    //Only owner of a specific course and Admin have right to delete a course
    //get userId from req.user
    //get course's instructor id by fetching course from database using course id which is obtained from req.params
    //If the userId and course's instructor id matches then only instructor can delete course
    const { id } = req.params;
    const user = req.user;

    const course = await checkInstructorOfCourse(user.id, id);

    if (!course) {
        throw new ApiError(400, "Unable to delete course");
    }

    const deletedCourse = await prisma.course.delete({
        where: {
            id
        }
    });

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                { deleted_Course: deletedCourse.title },
                "Course deleted successfully"
        )
    )

    
})

export { addCourse, allCourses, deleteCourse, getCourse, publishCourse, updateCourse };

