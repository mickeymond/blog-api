import { Router } from "express";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";
import { createUser, deleteUser, forgotPassword, getUsers, login, logout, profile, register, resetPassword, token, updateUser, verifyResetToken } from "../controllers/user.js";

// Create router
const userRouter = Router();

// Define routes
userRouter.post('/users/register', register);

userRouter.post('/users/login', login);

userRouter.post('/users/token', token);

userRouter.get('/users/profile', isAuthenticated, profile);

userRouter.post('/users/logout', isAuthenticated, logout);

userRouter.post('/users/forgot-password', forgotPassword);

userRouter.get('/users/reset-token/:id', verifyResetToken);

userRouter.post('/users/reset-password', resetPassword);

userRouter.get('/users', isAuthenticated, hasPermission('read_users'), getUsers);

userRouter.post('/users', isAuthenticated, hasPermission('create_user'), createUser);

userRouter.patch('/users/:id', isAuthenticated, hasPermission('update_user'), updateUser);

userRouter.delete('/users/:id', isAuthenticated, hasPermission('delete_user'), deleteUser);

// Export router
export default userRouter;