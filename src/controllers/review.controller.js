import prisma from "../DataBase/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkEnrollment } from "../utils/review.functions.js";

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
    const makeReview = await prisma.review.create({
        data: {
            course_id,
            user_id: user.id,
            comment
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                makeReview,
                "Successfully make review"
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

    const removedReview = await prisma.review.delete({
        where: {
            id:review_id
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                { "deleted_review": removedReview.comment },
                "review deleted successfully"
        )
    )
})

export { deleteReview, reviewCourse, updateReview };

