import express from 'express';

import authRouter from './auth/auth.route.js';
import userRouter from './user/user.route.js';
import authMiddleware from './middleware/authMiddleware.js';
const services = express.Router();

services.use('/auth', authRouter);
services.use(authMiddleware.isAuth)
services.use('/user', userRouter);

export default services