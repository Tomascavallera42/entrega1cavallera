import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";

import userRouter from "./routes/userRouter.js";
import sessionsRouter from "./routes/sessionsRouter.js";
import configurePassport from "./config/passportConfig.js";

dotenv.config();
configurePassport();

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionsRouter);

app.listen(process.env.PORT, () => {});
