import { Router } from "express";
import { getRatings, rateCourse, removeRating } from "../controllers/rating.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add/:course_id").post(verifyJWT, upload.none(), rateCourse);
router.route("/all/:course_id").get(verifyJWT, getRatings);
router.route("/delete/:course_id").delete(verifyJWT, removeRating);








export default router;