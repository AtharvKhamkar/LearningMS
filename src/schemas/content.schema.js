import { z } from "zod";

const contentSchema = z.object({
    title: z.
        string({ required_error: "Title is required to upload content" })
        .trim()
        .min(10, { message: "Title should be minimum of 10 characters" })
        .max(100, { message: "Title should not be greater than 100 characters" }),
    description: z.
        string({ required_error: "Description is required to upload the content" })
        .trim()
        .min(10, { message: "description should be minimum of 10 characters" }),
    
})

export { contentSchema };
