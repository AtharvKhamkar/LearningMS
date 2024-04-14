import { z } from "zod";

const role = ["STUDENT","INSTRUCTOR","ADMIN"];

const registrationSchema = z.object({
    username: z.
        string({ required_error: "username is required" })
        .trim()
        .min(3, { message: "Username must be greater than 3 characters" })
        .max(50, { message: "Username must be smaller than 50 characters" }),
    fullname: z.
        string({ required_error: "fullname is required" })
        .trim()
        .min(3, { message: "fullname must be greater than 3 characters" })
        .max(50, { message: "fullname must be smaller than 50 characters" }),
    email: z.
        string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid Email" })
        .min(3, { message: "Email must be greater than 3 characters" })
        .max(50, { message: "Email must not be greater than 255 character" }),
    password: z.
        string({ required_error: "Password is required" })
        .trim()
        .min(8, { message: "Password must be atleast 8 characters" })
        .max(50, { message: "Password must be smaller than 50 characters" }),
    role: z.
        enum(role)
})

export { registrationSchema };
