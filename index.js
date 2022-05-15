//third-party
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

//routers
import { userRouter } from "./routers/user-router.js";
import { authRouter } from "./routers/auth-router.js";
//middlewares
import { errorHandler }from "./middlewares/errorHandler.js";

// this heops to prevent node app crash if nodemailer gets unavailible email :)
process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})
process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
//routers
app.use("/user", userRouter);
app.use("/auth", authRouter);
//error handler middleware
app.use(errorHandler);


app.listen(PORT, () => console.log(`server has been started on port: ${PORT}`));