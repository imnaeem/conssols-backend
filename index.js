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

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname + "/public"));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname +
        "_" +
        // new Date().toLocaleDateString("es-CL") +
        // Date.now() +
        path.extname(file.originalname)
    );
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: fileStorage, fileFilter: imageFilter }).single(
  "profileImage"
);

// app.use("/company/profile", upload, CompanyProfile);
app.use("/company", companyRoutes);
app.use("/client", clientRoutes);
app.use("/admin", adminRoutes);

app.use("/user", authRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  // const path = require("path");

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use("/", homeRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, { useNewUrlParser: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
