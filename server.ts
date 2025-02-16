import express from 'express';
import passport from 'passport';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import router from './src/router';
import ErrorHandler from './src/middleware/errorHandler.middleware';
import './src/config/passportLocal'
import dotenv from 'dotenv';
import globalTypes from './src/index'; //this line imports extended express request object


dotenv.config();

const app = express();
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*', // Allow all headers
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', router);
app.use(ErrorHandler);



const port = process.env['PORT'] || 4000;
app.listen(port, () => {
    console.log(`Server started at port ${port}`);
})