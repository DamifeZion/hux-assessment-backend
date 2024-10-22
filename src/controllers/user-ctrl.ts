import { Request, Response } from "express";
import validator from "validator";

/** Local Modules */
import { responseHandler } from "../utils/responseHandler";
import { errorThrow } from "../utils/error-throw";
import { userModel } from "../models/user-model";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateSixDigitCode } from "../utils/crypto";
import { tokenModel } from "../models/token-model";
import { sendTextEmail, TMailOption } from "../utils/mailing";
import { CONFIG } from "../config";
import { createJwtToken, verifyJwtToken } from "../utils/jwt";
import mongoose from "mongoose";
import { convertTimeShorthand } from "../utils/convert-time-shorthand";

export const register = async (req: Request, res: Response) => {
   try {
      const { email, password, confirmPassword } = req.body;

      // Ensure all fields are field
      if (!email) {
         return responseHandler(res, 404, "Please enter your email address");
      }

      if (!password) {
         return responseHandler(res, 404, "Please enter your password");
      }

      if (confirmPassword !== password) {
         return responseHandler(
            res,
            404,
            "Please ensure passwords are matching"
         );
      }

      // Validate the credentials
      if (!validator.isEmail(email)) {
         return responseHandler(res, 404, "Please enter a valid email");
      }

      if (!validator.isStrongPassword(password)) {
         return responseHandler(
            res,
            404,
            "Password must be at least 8 characters and contain at least one uppercase, lowercase, special character and number"
         );
      }

      // Check if the email is unique
      const existingEmail = await userModel.findOne({ email });

      if (existingEmail) {
         return responseHandler(res, 409, "Email is already in use");
      }

      // Hash Password
      const hashedPassword = await hashPassword(password);

      // Store new user in DB
      const newUser = await userModel.create({
         email,
         password: hashedPassword,
      });

      // Generate 6 digit  code
      const verificationCode = await generateSixDigitCode();

      // Store the token in DB
      await tokenModel.create({
         token: verificationCode,
         email: newUser.email,
      });

      // Send email with 6 digit code  for verification
      const mailOption: TMailOption = {
         receiver: newUser.email,
         subject: `[${CONFIG.COMPANY_NAME}] - Activate your account`,
         text: `
            <p>
               Hi ${newUser.email}, you are receiving this email because ${
                  newUser.email
               } is requesting to use ${newUser.email} as an email on their <b>${
                  CONFIG.COMPANY_NAME
               }</b> account.
            </p>

            <p>
               To allow this sender to be used on your account ${newUser.email}, you'll have to verify their email account using the following one time verification code:
					</p>
            </p>

            <b style="font-size: 20px;">
						${verificationCode}
				</b>

            <p>
				   <b>Note:</b> This verification code is valid for only ${convertTimeShorthand(
                  CONFIG.TOKEN_MODEL_EXPIRATION
               )}. Please do not share this email with anyone to ensure the security of your account.
				</p>
         `,
      };

      await sendTextEmail(mailOption);

      return responseHandler(
         res,
         201,
         "An email verification code has been sent to your mail."
      );
   } catch (err) {
      return errorThrow(err, res);
   }
};

export const login = async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body;

      if (!email) {
         return responseHandler(res, 404, "Invalid login credentials");
      }

      if (!password) {
         return responseHandler(res, 404, "Invalid login credentials");
      }

      // Check if there is email exists
      const existingUser = await userModel.findOne({ email });

      if (!existingUser) {
         return responseHandler(
            res,
            404,
            "Sorry we could'nt find a user with that username/email address"
         );
      }

      const matchPassword = await comparePassword(
         password,
         existingUser.password
      );

      if (!matchPassword) {
         return responseHandler(res, 404, "Invalid login credentials");
      }

      // If the user is not validated send them a mail to validate;
      if (!existingUser.emailActive) {
         // Generate 6 digit code
         const verificationCode = await generateSixDigitCode();

         // store the token in DB
         await tokenModel.create({
            token: verificationCode,
            email: existingUser.email,
         });

         // Send email with code for verification
         const mailOption: TMailOption = {
            receiver: existingUser.email,
            subject: `[${CONFIG.COMPANY_NAME}] - Activate your account`,
            text: `
                     <p>
								Hi <b>${existingUser.email}</b>, you are receiving this email because ${existingUser.email} is requesting to use ${existingUser.email} as an email on their <b>${CONFIG.COMPANY_NAME}</b> account.
							</p>

							<p>
								To allow this sender to be used on your account ${existingUser.email}, you'll have to verify their email account using the following one time verification code:
							</p>

							<b style="font-size: 20px;">
								${verificationCode}
							</b>

							<p>
								<b>Note:</b> This verification code is valid for only ${convertTimeShorthand(CONFIG.TOKEN_MODEL_EXPIRATION)}. Please do not share this email with anyone to ensure the security of your account.
							</p>
            `,
         };

         await sendTextEmail(mailOption);

         return responseHandler(
            res,
            404,
            "Your account is not activated. An email verification code has been sent your mail.",
            {
               verifyEmail: true,
            }
         );
      }

      // User expiration time = 7 days
      const sessionToken = createJwtToken(
         existingUser._id,
         CONFIG.USER_SESSION_EXPIRATION
      );

      responseHandler(res, 200, "Welcome back!", {
         token: sessionToken,
         email: existingUser.email,
      });
   } catch (err) {
      return errorThrow(err, res);
   }
};

export const validateEmail = async (req: Request, res: Response) => {
   try {
      const { verificationCode } = req.body;

      if (!verificationCode) {
         return responseHandler(res, 404, "Please enter the 6 digit code");
      }

      // Check the DB to check if the token is present.
      const token = await tokenModel.findOneAndDelete({
         token: verificationCode,
      });

      if (!token) {
         return responseHandler(
            res,
            404,
            "Invalid token. Please request a new token"
         );
      }

      // Update the user document using the email in the token
      const existingUser = await userModel.findOne({ email: token.email });

      if (!existingUser) {
         return responseHandler(
            res,
            404,
            "Sorry we couldn't find a user for that account"
         );
      }

      existingUser.emailActive = true;
      await existingUser.save();

      responseHandler(
         res,
         200,
         "Your account has been activated successfully. Welcome aboard!"
      );
   } catch (err) {
      return errorThrow(err, res);
   }
};

export const forgotPassword = async (req: Request, res: Response) => {
   try {
      const { email } = req.body;

      if (!email) {
         return responseHandler(
            res,
            404,
            "Please enter account username/email address"
         );
      }

      const existingUser = await userModel.findOne({ email });

      //if there is no existing user or the existing user provider is present, we show this message as we want users signed in via email only to access this route
      if (!existingUser) {
         return responseHandler(
            res,
            404,
            "Sorry we could'nt find a user with that username/email"
         );
      }

      // Create token
      const resetToken = createJwtToken(
         existingUser.email,
         CONFIG.TOKEN_MODEL_EXPIRATION
      );

      // Here we send them a email with token which they can click on the link to change their account password within 3hrs
      await tokenModel.create({
         token: resetToken,
         email: existingUser.email,
      });

      // Send email with for password reset
      const mailOption = {
         receiver: existingUser.email,

         subject: `[${CONFIG.COMPANY_NAME}] - Password Reset`,

         text: `
						<p>
							You are receiving this email because a request to reset your password for your <b>${CONFIG.COMPANY_NAME}</b> account has been received.
						</p>

						<p>
							To reset your password ${existingUser.email}, click on the button below:
						</p>

						<button style="
						background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block;
						font-size: 20px; margin: 4px 2px;	cursor: pointer; border-radius: 12px;">
							<a href="${CONFIG.CLIENT_BASE_URL}/${CONFIG.CLIENT_RESET_PASSWORD}/${resetToken}" style=" color: white; text-decoration: none;">
									Reset Password
							</a>
						</button>

						<p>
							<b>Note:</b> This verification code is valid for only ${convertTimeShorthand(CONFIG.TOKEN_MODEL_EXPIRATION)}. Please do not share this email with anyone to ensure the security of your account.
						</p>
					`,
      };

      await sendTextEmail(mailOption);

      responseHandler(
         res,
         200,
         "An email has been sent to reset your password. Please check your inbox."
      );
   } catch (error) {
      return errorThrow(error, res);
   }
};

export const resetPassword = async (req: Request, res: Response) => {
   try {
      const { resetToken } = req.params;
      const { password, confirmPassword } = req.body;

      // First check if the reset token is valid and if there is a bound user. The property payload holds value email.
      const tokenPayload = verifyJwtToken(resetToken) as { payload: string };

      if (!tokenPayload) {
         return responseHandler(res, 401, "Unauthorised request.");
      }

      const { payload } = tokenPayload;

      // Delete the reset token from DB
      const tokenDoc = await tokenModel.findOneAndDelete({ email: payload });

      // Break if there is no reset token or if there is no user
      const existingUser = await userModel.findOne({ email: payload });

      if (!existingUser || !tokenDoc) {
         return responseHandler(res, 401, "Unauthorised request.");
      }

      // validate fields
      if (!password) {
         return responseHandler(res, 404, "Please enter new password");
      }

      if (confirmPassword !== password) {
         return responseHandler(
            res,
            404,
            "Please ensure passwords are matching"
         );
      }

      if (!validator.isStrongPassword(password)) {
         return responseHandler(
            res,
            404,
            "Password must be at least 8 characters and contain at least one uppercase, lowercase, special character and number"
         );
      }

      const hashedPassword = await hashPassword(password);

      // Update password in DB
      existingUser.password = hashedPassword;
      await existingUser.save();

      responseHandler(res, 200, "Password updated successfully");
   } catch (err) {
      return errorThrow(err, res);
   }
};

export const getUserDetails = async (req: Request, res: Response) => {
   try {
      const { id } = req.params;

      // Break, if the user 'id' is wrong
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return responseHandler(res, 404, "Invalid user id");
      }

      // We want everythin but the password
      const user = await userModel.findOne({ _id: id }).select("_id email");

      if (!user) {
         return responseHandler(res, 401, "Unautorized request");
      }

      responseHandler(res, 200, "", user);
   } catch (err) {
      return errorThrow(err, res);
   }
};
