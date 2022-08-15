import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import createError from 'http-errors';
import connectDB from './config/dbConnection.js';

import services from './services/index.js';

const PORT = process.env.PORT || 5000;
const app = express();
connectDB()

// Middlewares
app.use(express.json());
// app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

// Mount REST on /api
app.use('/api', services);

app.use((req, res, next) => {
	next(createError(404));
});

// app.use((res, req, next) => {
// 	console.log(err.stack);
// 	res.status(err.status || 500).send(err.message);
// });

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () =>
        console.log(`Express app listening on localhost:${PORT}`)
    );
});

