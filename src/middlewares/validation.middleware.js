import { asyncHandler } from "../utils/asyncHandler.js";

const isValidated = (schema) => asyncHandler(async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        console.log(error.issues[0].message)
        res.status(400).json({msg:error.issues[0].message})
    }
})

export { isValidated };