import prisma from "../DataBase/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkEnrollment } from "../utils/review.functions.js";

//transaction functions
//function to add review and update reviews count in course table
const addReview = async (courseId, userId, comment) => {
    
    //start the prisma transaction
    const tx = await prisma.$transaction([
        prisma.review.create({
            data: {
                course_id: courseId,
                user_id: userId,
                comment: comment
            }
        }),

        //Increment the review count for the course
        prisma.course.update({
            where: {
                id:courseId
            },
            data: {
                reviews: {
                    increment:1              //Increment count by 1 whenever the review is added
                }
            }
        })
    ])
     
    //Commit the the transaction
    await tx;

    return { success: true };
}

//function to delete review and decrement reviews count in course table
const removeReview = async (courseId, reviewId) => {
    //Starting the transaction
    const tx = await prisma.$transaction([
        prisma.review.delete({
            where: {
                id:reviewId
            }
        }),
        prisma.course.update({
            where: {
                id:courseId
            },
            data: {
                reviews: {
                    decrement:1
                }
            }
        })
    ])

    await tx;

    return { success: true };
}

const reviewCourse = asyncHandler(async (req, res) => {
    //Only users who are enrolled for the course can make review
    //pass course_id through req.params
    //to check user enrolled or not use req.user.id to match enrollment.student_id
    //If user found then only user is allowed to make review

    const { course_id } = req.params;
    const user = req.user;
    const { comment } = req.body;

    //check user  is enrolled for given course or not
    const isEnrolled = await prisma.enrollment.findFirst({
        where: {
            student_id: user.id,
            course_id
        }
    })
    if (!isEnrolled) {
        throw new ApiError(400, "You can not make review");
    }

    //If it is enrolled then make review
    const makeReview = await addReview(course_id, user.id, comment);



    return res.status(200)
        .json(
            new ApiResponse(
                200,
                makeReview,
                "Successfully make review"
        )
    )


})

const allReviews = asyncHandler(async (req, res) => {
    const { course_id } = req.params;

    const reviewList = await prisma.review.findMany({
        where: {
            course_id
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatar:true
                }
            }
        }
    })

    const reviewCount = reviewList.length;

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {reviewList,reviewCount},
                "Successfully fetched all the reviews"
        )
    )
})

const updateReview = asyncHandler(async (req, res) => {
    const { course_id } = req.params;
    const user = req.user;
    const review_id = req.body?.review_id;
    

    const isEnrolled = await checkEnrollment(user.id, course_id);
    if (!isEnrolled) {
        throw new ApiError(400, "You can not update this review");
    }

    const changedReview = await prisma.review.update({
        where: {
            id:review_id
        },
        data: {
            comment: req.body?.comment
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                changedReview,
                "Review updated successfully"
        )
    )

})

const deleteReview = asyncHandler(async (req, res) => {
    const { course_id } = req.params;
    const user = req.user;
    const { review_id } = req.body;

    const isEnrolled = await checkEnrollment(user.id, course_id);
    if (!isEnrolled) {
        throw new ApiError(400, "You can not delete the review");
    }

    const removedReview = await removeReview(course_id, review_id);

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                removedReview,
                "review deleted successfully"
        )
    )
})

export { allReviews, deleteReview, reviewCourse, updateReview };

