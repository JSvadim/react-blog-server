import express from 'express';
import 'dotenv/config';

//routers
import { userRouter } from "./routers/user-router.js";


const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json());

//routers
app.use("/user", userRouter);


app.listen(PORT, () => console.log(`server has been started on port: ${PORT}`));