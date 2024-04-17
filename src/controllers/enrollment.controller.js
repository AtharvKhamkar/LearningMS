import prisma from "../DataBase/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkInstructorOfCourse } from "../utils/course.function.js";
import { welcomeEmail, withdrawEnrollmentEmail } from "../utils/email.function.js";
import { calculateEndDate } from "../utils/enrollment.function.js";


const enrollStudent = asyncHandler(async (req, res) => {
    //only user that have role student can enroll in the course
    //get id from user.id
    //get course_id through req.params
    //check user has already enrolled or not
    //then check user is student or not
    //if it is student enroll in the course add start date as now() and end as now() + courseDuration

    const { course_id } = req.params;
    const user = req.user;

    //check user already enrolled or not
    const checkEnrolled = await prisma.enrollment.findFirst({
        where: {
            course_id,
            student_id:user.id
        }
    })

    if (checkEnrolled) {
        throw new ApiError(400, "You have already enrolled for this course");
    }

    //check user is student or not
    if (user.role !== "STUDENT") {
        throw new ApiError(400, "You can not enroll to course");
    }
    
    //get course detail to get courseDuration
    const enrolledCourse = await prisma.course.findUnique({
        where: {
            id: course_id
        }
    });

    //create enrollment
    const createEnrollment = await prisma.enrollment.create({
        data: {
            course_id,
            student_id: user.id,
            endDate: calculateEndDate(new Date(), enrolledCourse.duration)
        }
    })

    console.log(user.email);

    await welcomeEmail(user.email,user.username,enrolledCourse.title);

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createEnrollment,
                "Student enrolled for the course successfully"
        )
    )

})

const withdrawEnrollment = asyncHandler(async (req, res) => {
    //student should only withdraw its enrollment
    //get course_id through req.params
    //check first whether user is enrolled for tha course
    //if it is enrolled then delete the enrollment
    const { course_id } = req.params;
    const user = req.user;

    const enrollmentDetails = await prisma.enrollment.findFirst({
        where: {
            course_id,
            student_id: user.id
        }
    });


    const deletedEnrollment = await prisma.enrollment.delete({
        where: {
            id:enrollmentDetails.id
        },
        select: {
            id:true
        }   
    })

    if (!deletedEnrollment) {
        throw new ApiError(400, `You have not enrolled for ${course_id} course`);
    }

    await withdrawEnrollmentEmail(user.email,user.username,enrollmentDetails.course_id);



    return res.status(200)
        .json(
            new ApiResponse(
                200,
                deletedEnrollment,
                "Successfully withdraw enrollment"
        )
    )
})

const allEnrolledStudent = asyncHandler(async (req, res) => {
    //only instructor of a course can see the enrolled students
    //pass course_id using req.params
    //then check user is instructor of that course
    //then get all the enrolled entries according to course_id

    const { course_id } = req.params;
    const user = req.user;

    const checkInstructor = await checkInstructorOfCourse(user.id, course_id);
    if (!checkInstructor) {
        throw new ApiError(400, "Only instructor can see the enrolled students");
    }

    const enrolledStudents = await prisma.enrollment.findMany({
        where: {
            course_id
        },
        include: {
            student: {
                select: {
                    id: true,
                    username: true,
                    fullname: true,
                    email: true,
                    avatar: true,
                    coverImage:true
                }
            }
        },
    })

    const totalEnrolledStudents = enrolledStudents.length;

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {enrolledStudents,totalEnrolledStudents},
                "Successfully fetched all enrolled student for course"
        )
    )
})

const searchEnrolledStudent = asyncHandler(async (req, res) => {
    //get specific enrolled student by searching his name
    //only instructor of a course can search student who is enrolled in a course
    //pass course_id using req.params
    //passed keyword that we want to search using req.query
    //search that student and return
    
    const { course_id } = req.params;
    const user = req.user;
    const {query} = req?.query;

    const checkInstructor = await checkInstructorOfCourse(user.id, course_id);
    if (!checkInstructor) {
        throw new ApiError(400, "You are not instructor of a course");
    }

    const enrolledStudent = await prisma.enrollment.findMany({
        where: {
            course_id,
            student: {
                fullname: {
                    search:query || ""
                }
            }
        },
        include: {
            student: {
                select: {
                    id: true,
                    username: true,
                    fullname: true,
                    email: true,
                    avatar: true,
                    coverImage:true
                }
            }
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                enrolledStudent,
                "Successfully searched enrolled student"
        )
    )
})

const removeEnrollment = asyncHandler(async (req, res) => {
    //course instructor can remove course access from student
    //pass course_id using req.params
    //pass enrollment_id using req.body
    //check first user is instructor of that course
    //delete the enrollment

    const { course_id } = req.params;
    const { enrollment_id } = req.body;
    const user = req.user;

    const checkInstructor = await checkInstructorOfCourse(user.id, course_id);
    if (!checkInstructor) {
        throw new ApiError(400, "You can not remove enrollment");
    }

    const deleteEnrollment = await prisma.enrollment.delete({
        where: {
            id:enrollment_id
        }
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                { deleted_enrollment: deleteEnrollment.id },
                "Successfully deleted enrollment"
        )
    )
})


export { allEnrolledStudent, enrollStudent, removeEnrollment, searchEnrolledStudent, withdrawEnrollment };

