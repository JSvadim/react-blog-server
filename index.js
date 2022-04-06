import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, `server has been started on port: ${PORT}`);