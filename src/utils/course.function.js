import prisma from "../DataBase/db.config.js";
import { ApiError } from "./ApiError.js";

const checkInstructorOfCourse = async (userId, courseId) => {
    try {

        //find course from database of a given courseId
        const course = await prisma.course.findUnique({
            where: {
                id: courseId
            }
        });

        if (!course) {
            throw new ApiError(400, "Course not found");
        }
        
        //check user that is modefing the course is the instructor of that course
        if (userId !== course.instructorId) {
            throw new ApiError(400, "You can not add , update or delete course");
        }

        return course;


    } catch (error) {
        throw new ApiError(400, "Unable to get instructor of course");
    }
}

export { checkInstructorOfCourse };
