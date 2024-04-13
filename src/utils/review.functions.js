import prisma from "../DataBase/db.config.js";
import { ApiError } from "./ApiError.js";

const checkEnrollment = async (userId, courseId) => {
    try {
        const isEnrolled = await prisma.enrollment.findFirst({
            where: {
                student_id: userId,
                course_id:courseId
            }
        })

        if (!isEnrolled) {
            throw new ApiError(400, "You are not enrolled for this course");
        }
        return isEnrolled;
    } catch (error) {
        throw new ApiError(400, `Error while checking enrollment ${error.message}`);
    }
}

export { checkEnrollment };
