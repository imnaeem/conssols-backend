import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import authRoute from "./routes/auth.js";
import companyRoutes from "./routes/companyRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// app.use("/company/profile", upload, CompanyProfile);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use("/company", companyRoutes);
app.use("/client", clientRoutes);
app.use("/admin", adminRoutes);

app.use("/", homeRoutes);
app.use("/user", authRoute);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, { useNewUrlParser: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
