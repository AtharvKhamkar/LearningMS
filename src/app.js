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
import userRoutes from "./routes/user.routes.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/content", contentRouter);


export default app;