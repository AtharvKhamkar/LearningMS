import { Router } from "express";
import { deleteUser, loginUser, profileDetails, registerUser, updateProfile, updateProfileImages } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

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
    ]),
    registerUser)
router.route("/login").put(loginUser)
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
router.route("/delete").delete(verifyJWT,deleteUser)

export default router;