import { Router } from "express";
import { deleteUser, enrolledCourses, loginUser, profileDetails, registerUser, updatePassword, updateProfile, updateProfileImages } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isValidated } from "../middlewares/validation.middleware.js";
import { registrationSchema } from "../schemas/user.schemas.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name: "coverImage",
            maxCount:1
        }
    ]),isValidated(registrationSchema),
    registerUser)
router.route("/login").put(upload.none(),loginUser)
router.route("/profile").get(verifyJWT, profileDetails)
router.route("/update-profile").put(verifyJWT,upload.none(),updateProfile)
router.route("/profile-images").post(upload.fields([
    {
        name: "avatar",
        maxCount:1
    },
    {
        name: "coverImage",
        maxCount:1
    }
]), verifyJWT, updateProfileImages)
router.route("/update-password").put(verifyJWT, upload.none(), updatePassword)
router.route("/my-courses").get(verifyJWT, enrolledCourses);
router.route("/delete").delete(verifyJWT,deleteUser)

export default router;