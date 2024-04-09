import Express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import dbConnection from "./DataBase/DataBase.js";

dotenv.config({ path: "./config/config.env" });
dbConnection();

const app = Express();

app.use(Express.json({ limit: "50mb" }));
app.use(Express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// routes import and use as middlware
import UserRoutes from "./routes/userRoutes.js";
import ProductRoutes from "./routes/productRoutes.js";
import OrderRoutes from "./routes/orderRoutes.js";

app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/product", ProductRoutes);
app.use("/api/v1/order", OrderRoutes);

app.get("/", (req, res) => {
  res.send("server is working");
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on port : ${process.env.PORT}`);
});
