import { Resend } from "resend";
import { transporter } from "../DataBase/nodemailer.config.js";
import { ApiError } from "../utils/ApiError.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const welcomeEmail = async (receiverEmail,receiverName,courseName) => {
    try {
        const result = await transporter.sendMail({
            from: 'onboarding@resend.dev',
            to: [`${receiverEmail}`],
            subject: "Welcome to learningMS",
            html:`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html dir="ltr" lang="en">
              <head>
                <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                <style>
                  p {
                    font-size: 16px;
                    line-height: 26px;
                    margin: 16px 0;
                  }
                </style>
              </head>
              <body>
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="max-width: 37.5em; margin: 0 auto; padding: 20px 0 48px"
                >
                  <tbody>
                    <tr style="width: 100%">
                      <td>
                        <img
                          alt="Koala"
                          height="150"
                          src="https://static.vecteezy.com/system/resources/thumbnails/009/206/775/small_2x/lms-learning-management-system-line-icon-vector.jpg"
                          style="
                            display: block;
                            outline: none;
                            border: none;
                            text-decoration: none;
                            margin: 0 auto;
                          "
                          width="170"
                        />
                        <p>
                          Hi
                          <!-- -->${receiverName}<!-- -->,
                        </p>
                        <p>Welcome to our learning community! 🚀</p>
                        <p>
                          We're thrilled to have you join us on this educational journey in
                          ${courseName}. Whether you're here to explore new topics, enhance
                          your skills, or pursue your passions, we're here to support you
                          every step of the way.
                        </p>
                        <p>
                          Get ready to learn, grow, and connect with like-minded individuals
                          from around the world. Together, we'll achieve great things!
                        </p>
                        <p>
                          If you have any questions or need assistance, feel free to reach
                          out to our team at [support email].
                        </p>
                        <p>Happy learning!</p>
                        <p>Best regards,</p>
                        <p>Learning Management System,</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </body>
            </html>
            `

        })
        return result;
    } catch (error) {
        new ApiError(400, "Error while sending email to receiver");
    }
}

const withdrawEnrollmentEmail = async (receiverEmail,receiverName,courseName) => {
    try {
        const result = await transporter.sendMail({
            from: 'onboarding@resend.dev',
            to: [`${receiverEmail}`],
            subject: "Withdraw course enrollment",
            html:`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html dir="ltr" lang="en">
              <head>
                <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                <style>
                  p {
                    font-size: 16px;
                    line-height: 26px;
                    margin: 16px 0;
                  }
                </style>
              </head>
              <body>
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="max-width: 37.5em; margin: 0 auto; padding: 20px 0 48px"
                >
                  <tbody>
                    <tr style="width: 100%">
                      <td>
                        <img
                          alt="Koala"
                          height="150"
                          src="https://static.vecteezy.com/system/resources/thumbnails/009/206/775/small_2x/lms-learning-management-system-line-icon-vector.jpg"
                          style="
                            display: block;
                            outline: none;
                            border: none;
                            text-decoration: none;
                            margin: 0 auto;
                          "
                          width="170"
                        />
                        <p>
                          Hi
                          <!-- -->${receiverName}<!-- -->,
                        </p>
                        <p>We're sorry to see you go!</p>
                        <p>
                          You've successfully withdrawn your enrollment from ${courseName}.
                          If you ever decide to rejoin us, you're always welcome back!
                        </p>
                        <p>
                          If you have any feedback or questions regarding your withdrawal,
                          feel free to reach out to our team at [support email].
                        </p>
                        <p>Best regards,</p>
                        <p>Learning Management System,</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </body>
            </html>
            `

        })
        return result;
    } catch (error) {
        new ApiError(400, "Error while sending email to receiver");
    }
}



export { welcomeEmail, withdrawEnrollmentEmail };

