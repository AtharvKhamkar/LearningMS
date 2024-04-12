import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const checkInstructor = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role !== "INSTRUCTOR" && user.role!=="ADMIN") {
            throw new ApiError(400,"You are not instructor. You have no right of course section.")
        }

        next();
    } catch (error) {
        throw new ApiError(400, "Error while detecting the roles");
    }
})

export { checkInstructor };
