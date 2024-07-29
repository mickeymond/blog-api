import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import expressOasGenerator from "@mickeymond/express-oas-generator";
import cors from "cors";
import errorHandler from "errorhandler";
import userRouter from "./routes/user.js";
import articleRouter from "./routes/article.js";

// Make database connection
await mongoose.connect(process.env.MONGO_URI);

// Create an app
const app = express();
expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: ['users', 'articles'],
    mongooseModels: mongoose.modelNames(),
});

// Use middlewares
app.use(cors({
    credentials: true,
    origin: process.env.ALLOWED_DOMAINS?.split(',') || []
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

// Use routes
app.use(userRouter);
app.use(articleRouter);
expressOasGenerator.handleRequests();
app.use((req, res) => res.redirect('/api-docs/'));
app.use(errorHandler({ log: false }));

// Listen for incoming request
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});