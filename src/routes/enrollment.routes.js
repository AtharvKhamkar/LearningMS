import { Router } from "express";
import { allEnrolledStudent, enrollStudent, removeEnrollment, searchEnrolledStudent, withdrawEnrollment } from "../controllers/enrollment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkInstructor } from "../middlewares/checkInstructor.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//Routes for student
router.route("/student/:course_id").post(verifyJWT, enrollStudent);
router.route("/student/withdraw/:course_id").delete(verifyJWT, withdrawEnrollment);










//Routes for instructor
router.route("/instructor/all/:course_id").get(verifyJWT, checkInstructor, allEnrolledStudent)
router.route("/instructor/search-student/:course_id").get(verifyJWT, checkInstructor, searchEnrolledStudent)
router.route("/instructor/remove/:course_id").delete(upload.none(), verifyJWT, checkInstructor, removeEnrollment);





export default router;