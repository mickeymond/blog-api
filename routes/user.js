import { Router } from "express";
import { login, logout, profile, register, token } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

// Create router
const userRouter = Router();

// Define routes
userRouter.post('/users/register', register);

userRouter.post('/users/login', login);

userRouter.post('/users/token', token);

userRouter.get('/users/profile', isAuthenticated, profile);

userRouter.post('/users/logout', isAuthenticated, logout);

// Export router
export default userRouter;