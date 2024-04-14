import { Router } from "express";
import { addContent, deleteContent, getContent, updateContent, watchContent } from "../controllers/content.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkInstructor } from "../middlewares/checkInstructor.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isValidated } from "../middlewares/validation.middleware.js";
import { contentSchema } from "../schemas/content.schema.js";

const router = Router();

//Routes for student
router.route("/student/:course_id").get(verifyJWT, getContent);
router.route("/student/watch/:id").put(verifyJWT, upload.none(), watchContent);









//Routes for instructor
router.route("/instructor/add/:course_id").post(verifyJWT,upload.fields([
    {
        name: "video",
        maxCount:1
    },
    {
        name: "thumbnail",
        maxCount:1
    }
]), isValidated(contentSchema),checkInstructor, addContent)
router.route("/instructor/:course_id").get(verifyJWT, checkInstructor, getContent)
router.route("/instructor/update/:id").put(verifyJWT, upload?.fields([
    {
        name: "video",
        maxCount:1
    },
    {
        name: "thumbnail",
        maxCount:1
    }
]), checkInstructor, updateContent)
router.route("/instructor/delete/:id").delete(verifyJWT, checkInstructor, deleteContent);

export default router;