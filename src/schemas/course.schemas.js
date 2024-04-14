import { z } from "zod";

const duration = ["ONE_MONTH", "THREE_MONTHS", "SIX_MONTHS", "TWELVE_MONTHS"];

const courseSchema = z.object({
    title: z.
        string({ required_error: "title is required" })
        .trim()
        .min(10, { message: "Title should be minimum of 10 characters." })
        .max(255, { message: "Title should ne be greater than 255 characters" }),
    description: z.
        string({ required_error: "description is required" })
        .trim()
        .min(50, { message: "Description should be of minimun 50 characters" }),
    duration: z.
        enum(duration),
    price: z.
        string({ required_error: "Course price is required" }),

})

export { courseSchema };
