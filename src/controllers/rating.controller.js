import prisma from "../DataBase/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//transaction functions
//function to add rating
const addRating = async (userId, courseId, stars) => {
    
    //start transaction
    const tx = await prisma.$transaction([
        //add rating or update rating
        prisma.rating.upsert({
            where: {
                course_id_user_id: {
                    course_id: courseId,
                    user_id:userId
                }
            },
            update: {
                stars:Number(stars)
            },
            create: {
                course_id: courseId,
                user_id: userId,
                stars:Number(stars)
            }
        })
    ]);
    
    //calculate the average
    const averageRating = await calculateAverage(courseId);
    await prisma.course.update({
        where: { id: courseId },
        data:{ratings:averageRating}
    })

    //commit the transaction
    await tx;
    return { success: true };
}

const calculateAverage = async (courseId) => {
    try {
        const average = await prisma.rating.aggregate({
            where: { course_id: courseId },
            _avg: { stars: true }
        });

        return average._avg.stars || 0;
    } catch (error) {
        throw new ApiError(400, "Error while calculating average");
    }

}

const deleteRating = async (ratingId,courseId) => {
    try {
        //start transaction to delete rating and recalculating average rating updating
        const tx = await prisma.$transaction([
            //delete rating
            prisma.rating.delete({
                where:{id:ratingId}
            }),
        ])
        
        //calculate average rating after deleting
        const avgRating = await calculateAverage(courseId);

        //update with calculated rating
        await prisma.course.update({
            where: { id: courseId },
            data:{ratings:avgRating}
        })

        //commit transaction
        await tx;
        return {success:true}
    } catch (error) {
        throw new ApiError(400, "Error while deleting rating");
    }
}

const rateCourse = asyncHandler(async (req, res) => {
    /*Only enrolled student can give rating to a given course
      get course_id through req.params
      get user_id through req.user
      add rating using req.body
      first check user is enrolled in that course
      If it is enrolled create transaction to perform 2 operations
      1. create rating entry in the table
      2.calculate mean/avg of the rating for a given course update in the course table
    */
    
    const { course_id } = req.params;
    const user = req.user;
    const { stars } = req.body;

    //check user is enrolled for the course or not
    const isEnrolled = await prisma.enrollment.findFirst({
        where: {
            student_id: user.id,
            course_id
        }
    })

    if (!isEnrolled) {
        throw new ApiError(400, "You have not enrolled for the course.You can not rate course");
    }



    const result = await addRating(user.id, course_id, stars);

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Rating added successfully"
        )
    )
})

const getRatings = asyncHandler(async (req, res) => {
    //get list of all ratings for a specific course
    //pass courseId through req.params

    const { course_id } = req.params;

    const result = await prisma.rating.findMany({
        where: {
            course_id
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatar:true
                }
            },
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Successfully fetched ratings of a course"
        )
    )
})

const removeRating = asyncHandler(async (req, res) => {
    /*
        1.Only users that have given rating can delete rating
        2.whenever user delete the rating recalculate average of a rating of that course and update in the course table
        3.get course_id from req.params
        4.get user.id from req.user
    */
    
    const { course_id } = req.params;
    const user = req.user;
    
    const checkRating = await prisma.rating.findUnique({
        where: {
            course_id_user_id: {
                course_id,
                user_id:user.id
            
            }
        }
    })
    if (!checkRating) {
        throw new ApiError(400, "Rating not found");
    }

    const result = await deleteRating(checkRating.id, course_id);

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Successfully deleted the rating"
        )
    )
})

export { getRatings, rateCourse,removeRating };

