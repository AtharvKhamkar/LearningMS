import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import app from "./app.js";



dotenv.config({
    path:"./env"
})

const swaggerJsDoc = YAML.load("src/api.yaml");

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsDoc)
)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
})