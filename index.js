import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRouter from "./routes/user.js";
import articleRouter from "./routes/article.js";

// Make database connection
await mongoose.connect(process.env.MONGO_URI);

// Create an app
const app = express();

// Use middlewares
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

// Use routes
app.use(userRouter);
app.use(articleRouter);

// Listen for incoming request
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});