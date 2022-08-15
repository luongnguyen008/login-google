import express from 'express';
import * as controller from './user.controller.js';

const userRouter = express.Router();

/** GET /api/user */
userRouter.get('/', controller.find);

/** POST /api/user */
userRouter.post('/', controller.create);

export default userRouter