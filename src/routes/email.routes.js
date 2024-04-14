import { Router } from "express";
import { Resend } from "resend";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
const resend = new Resend("re_ELtvBMYb_Ay7bV63w79C7FK3ovAuUiwJC");


const sendEmail = asyncHandler(async (req, res) => {
    const { data, error } = await resend.emails.send({
        from: "khamkaratharv2002@gmail.com",
        to: ["alkakhamkar08@gmail.com"],
        subject: "test",
        html: "<strong>Hello world</strong>"
    });

    if (error) {
        console.log(error.message);
    }

    return res.status(200).json({ data });
})

router.route("/test").get(sendEmail);




export default router;