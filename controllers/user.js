import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserValidator, forgotPasswordValidator, loginValidator, registerValidator, resetPasswordValidator, updateUserValidator } from "../validators/user.js";
import { ResetTokenModel, UserModel } from "../models/user.js";
import { mailTransport } from "../config/mail.js";

export const register = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = registerValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Encrypt user password
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        // Create user
        await UserModel.create({
            ...value,
            password: hashedPassword
        });
        // Return response
        res.status(201).json('User Registered');
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = loginValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Find a user with their unique identifier
        const user = await UserModel.findOne({
            $or: [
                { username: value.username },
                { email: value.email },
            ]
        });
        if (!user) {
            return res.status(401).json('User Not Found');
        }
        // Verify their password
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            return res.status(401).json('Invalid Credentials');
        }
        // Create a session
        req.session.user = { id: user.id }
        // Return response
        res.status(200).json('User Logged In');
    } catch (error) {
        next(error);
    }
}

export const token = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = loginValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Find a user with their unique identifier
        const user = await UserModel.findOne({
            $or: [
                { username: value.username },
                { email: value.email },
            ]
        });
        if (!user) {
            return res.status(401).json('User Not Found');
        }
        // Verify their password
        const correctPassword = bcrypt.compareSync(value.password, user.password);
        if (!correctPassword) {
            return res.status(401).json('Invalid Credentials');
        }
        // Create a token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '72h' }
        );
        // Return response
        res.status(200).json({
            message: 'User Logged In',
            accessToken: token
        });
    } catch (error) {
        next(error);
    }
}

export const profile = async (req, res, next) => {
    try {
        // Get user id from session or request
        const id = req.session?.user?.id || req?.user?.id;
        // Find user by id
        const user = await UserModel.findById(id)
            .select({ password: false });
        // Return response
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        // Destroy user session
        await req.session.destroy();
        // Return response
        res.status(200).json('User Logged Out');
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = forgotPasswordValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Find a user with provided email
        const user = await UserModel.findOne({ email: value.email });
        if (!user) {
            return res.status(404).json('User Not Found');
        }
        // Generate reset token
        const resetToken = await ResetTokenModel.create({ userId: user.id });
        // Send reset email
        await mailTransport.sendMail({
            to: value.email,
            subject: 'Reset Your Password',
            html: `
            <h1>Hello ${user.name}</h1>
            <h1>Please follow the link below to reset your password.</h1>
            <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken.id}">Click Here</a>
            `
        });
        // Return response
        res.status(200).json('Password Reset Mail Sent!');
    } catch (error) {
        next(error);
    }
}

export const verifyResetToken = async (req, res, next) => {
    try {
        // Find Reset Token by id
        const resetToken = await ResetTokenModel.findById(req.params.id);
        if (!resetToken) {
            return res.status(404).json('Reset Token Not Found');
        }
        // Check if token is valid
        if (resetToken.expired || (Date.now() >= new Date(resetToken.expiresAt).valueOf())) {
            return res.status(409).json('Invalid Reset Token');
        }
        // Return response
        res.status(200).json('Reset Token is Valid!');
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = resetPasswordValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Find Reset Token by id
        const resetToken = await ResetTokenModel.findById(value.resetToken);
        if (!resetToken) {
            return res.status(404).json('Reset Token Not Found');
        }
        // Check if token is valid
        if (resetToken.expired || (Date.now() >= new Date(resetToken.expiresAt).valueOf())) {
            return res.status(409).json('Invalid Reset Token');
        }
        // Encrypt user password
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        // Update user password
        await UserModel.findByIdAndUpdate(resetToken.userId, { password: hashedPassword });
        // Expire reset token
        await ResetTokenModel.findByIdAndUpdate(value.resetToken, { expired: true });
        // Return response
        res.status(200).json('Password Reset Successful!');
    } catch (error) {
        next(error);
    }
}

export const getUsers = async (req, res, next) => {
    try {
        // Get all users
        const users = await UserModel
            .find()
            .select({ password: false });
        // Return response
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = createUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Encrypt user password
        const hashedPassword = bcrypt.hashSync(value.password, 10);
        // Create user
        await UserModel.create({
            ...value,
            password: hashedPassword
        });
        // Send email to user
        await mailTransport.sendMail({
            to: value.email,
            subject: "User Account Created!",
            text: `Dear user,\n\nA user account has been created for you with the following credentials.\n\nUsername: ${value.username}\nEmail: ${value.email}\nPassword: ${value.password}\nRole: ${value.role}\n\nThank you!`,
        });
        // Return response
        res.status(201).json('User Created');
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        // Validate request
        const { value, error } = updateUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        // Update user
        await UserModel.findByIdAndUpdate(
            req.params.id,
            value,
            { new: true }
        );
        // Return response
        res.status(200).json('User Updated');
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        // Get user id from session or request
        const id = req.session?.user?.id || req?.user?.id;
        // Ensure user is not deleting themselves
        if (id === req.params.id) {
            return res.status(409).json('Cannot Delete Self');
        }
        // Delete user
        await UserModel.findByIdAndDelete(req.params.id);
        // Return response
        res.status(200).json('User Deleted');
    } catch (error) {
        next(error);
    }
}