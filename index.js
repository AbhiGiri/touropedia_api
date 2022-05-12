import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import tourRouter from './routes/tourRoute.js';

const app = express()
dotenv.config();

app.use(morgan('dev'));
app.use(express.json({limit: '30mb', extended: true }));
app.use(express.urlencoded({limit: '30mb', extended: true}));
app.use(cors());

app.use('/api/user', userRouter);
app.use('/api/tour', tourRouter);
app.use('/', (req, res) => {
  res.send('Welcome to Touropedia API');
});


const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

