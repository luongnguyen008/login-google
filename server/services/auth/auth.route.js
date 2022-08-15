import express from 'express';
import * as controller from './auth.controller.js';

const authRouter = express.Router();

/** POST /api/auth */
authRouter.post('/', controller.create);
authRouter.post('/login', controller.login);
authRouter.post('/refresh-token', controller.refreshToken);

export default authRouter