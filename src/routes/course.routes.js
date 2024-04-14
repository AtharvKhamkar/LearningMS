import { Router } from "express";
import { addCourse, allCourses, deleteCourse, getCourse, publishCourse, updateCourse } from "../controllers/course.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkInstructor } from "../middlewares/checkInstructor.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isValidated } from "../middlewares/validation.middleware.js";
import { courseSchema } from "../schemas/course.schemas.js";

const router = Router();

//middlewares to check user is authentic and user is instructor or admin

router.route("/").get(allCourses);
router.route("/:id").get(getCourse);
router.route("/add").post(upload.none(), verifyJWT, isValidated(courseSchema),checkInstructor, addCourse);
router.route("/publish/:id").put(upload.none(), verifyJWT, checkInstructor, publishCourse);
router.route("/update/:id").put(upload.none(), verifyJWT, checkInstructor, updateCourse);
router.route("/delete/:id").delete(verifyJWT, checkInstructor, deleteCourse);


export default router;