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


const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}));
app.use(cookieParser());
app.use(express.json());
//routers
app.use("/user", userRouter);
app.use("/auth", authRouter);
//error handler middleware
app.use(errorHandler);


app.listen(PORT, () => console.log(`server has been started on port: ${PORT}`));