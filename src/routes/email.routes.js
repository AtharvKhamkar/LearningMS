import { Router } from "express";
import fs from "fs";
import { Resend } from "resend";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const resend = new Resend("re_ELtvBMYb_Ay7bV63w79C7FK3ovAuUiwJC");


const sendEmail = asyncHandler(async (req, res) => {
    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: ["khamkaratharv2002@gmail.com"],
        subject: "test",
        html:fs.ReadStream("/home/mahesh/LearningMS/src/routes/welcome.html")
    });

    if (error) {
        console.log(error.message);
    }

    return res.status(200).json({ data });
})

router.route("/test").get(sendEmail);




export default router;