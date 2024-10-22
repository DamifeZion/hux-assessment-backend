import express from "express";

/** Local Modules */
import {
   forgotPassword,
   getUserDetails,
   login,
   register,
   resetPassword,
   validateEmail,
} from "../controllers/user-ctrl";

const userRoute = express.Router();

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get User Details
 *     description: Retrieve the details of a user by their unique user ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique user ID.
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "614d1f77e6138d06f0c4f785"
 *                   description: The unique ID of the user.
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                   description: The email address of the user.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
userRoute.get("/:id", getUserDetails);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user using their email and password, returning a token upon successful authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: The user's registered email address.
 *               password:
 *                 type: string
 *                 example: "yourpassword"
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User authenticated successfully. Token is provided in the response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   description: JWT token for the authenticated session.
 *                 message:
 *                   type: string
 *                   example: "Login successful."
 *       404:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid login credentials."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
userRoute.post("/login", login);

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a New User
 *     description: Create a new user account by providing an email, password, and confirmation password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *                 description: The user's desired email address.
 *               password:
 *                 type: string
 *                 example: "yourpassword"
 *                 description: The user's desired password.
 *               confirmPassword:
 *                 type: string
 *                 example: "yourpassword"
 *                 description: The confirmation of the user's desired password.
 *     responses:
 *       201:
 *         description: User account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully."
 *       409:
 *         description: Email already in use.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is already in use."
 *       404:
 *         description: Request failed due to missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please ensure all fields are filled and valid."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */
userRoute.post("/register", register);

/**
 * @swagger
 * /api/v1/user/activate-account:
 *   post:
 *     summary: Activate User Account
 *     description: Validates the user's email using a verification code sent to their email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 example: "123456"
 *                 description: The 6-digit verification code sent to the user's email.
 *     responses:
 *       200:
 *         description: Email successfully validated and account activated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your account has been activated successfully. Welcome aboard!"
 *       404:
 *         description: Invalid or missing verification code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid token. Please request a new token."
 */
userRoute.post("/activate-account", validateEmail);

/**
 * @swagger
 * /api/v1/user/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset email to the user's registered email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's registered email address.
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An email has been sent to reset your password. Please check your inbox."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sorry we couldn't find a user with that username/email."
 */
userRoute.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/v1/user/reset_password/{resetToken}:
 *   put:
 *     summary: Reset user password
 *     description: Allows the user to reset their password using a reset token sent via email.
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset token sent to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password.
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the new password.
 *     responses:
 *       200:
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully."
 *       401:
 *         description: Unauthorized or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized request."
 *       404:
 *         description: User not found or passwords do not match.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please ensure passwords are matching."
 */
userRoute.put("/reset_password/:resetToken", resetPassword);

export default userRoute;
