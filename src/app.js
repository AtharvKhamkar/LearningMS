import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit:"16kb"
}))

app.use(express.static("public"));

app.use(cookieParser());


//Routes
import contentRouter from "./routes/content.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRouter from "./routes/enrollment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import userRoutes from "./routes/user.routes.js";
import ratingRoutes from "./routes/rating.routes.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/enrollment", enrollmentRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/rating", ratingRoutes);


export default app;