import { Router } from "express";
import { deleteReview, reviewCourse, updateReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add/:course_id").post(verifyJWT, upload.none(), reviewCourse);
router.route("/update/:course_id").put(verifyJWT, upload.none(), updateReview);
router.route("/delete/:course_id").delete(verifyJWT, upload.none(), deleteReview);



export default router;