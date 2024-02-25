import { Request, Response } from "express";
import ApiError from "../utils/apiError.utils";
import { User } from "../models/userSchema.models";
import ApiResponse from "../utils/apiResponse.utils";
import uploadFileToCloud from "../utils/cloudinary.utils";
import Validation from "../validations/user.validations";
import UserServices from "../services/user.services";

const validation = new Validation();
const userServices = new UserServices();

// SignUp Functionality completed
export const SignUp = async (req: Request, res: Response): Promise<void> => {
  await validation.SignUpValidation.validateAsync(req.body);

  if (req.file) {
    const avatar: string = req.file.path;
    req.body.profileUrl = await uploadFileToCloud(avatar);
  }
  await userServices.sinUpUser(req.body);
  new ApiResponse(
    201,
    "SUCCESS!",
    "Verify your email for Voice-Nest",
    {
      message:
        "Check your inbox and click the provided link to verify you email address!",
    },
    res
  );
};

// SignIn Functionality completed
export const SignIn = async (req: Request, res: Response): Promise<void> => {
  await validation.SignInValidation.validateAsync(req.body);

  const { user, accessToken, refreshToken } = await userServices.logInUser(
    req.body
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

  new ApiResponse(
    200,
    "SUCCESSFULLY_LOGED_IN!",
    `Welcome to Voice Nest ${user.fullName}`,
    { user, accessToken, refreshToken },
    res
  );
};

// Update Password Functionality completed
export const UpdatePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validation.UpdatePassword.validateAsync(req.body);

  const {
    oldPassword,
    newPassword,
  }: { oldPassword: string; newPassword: string; id: string } = req.body;

  if (oldPassword === newPassword)
    throw new ApiError(
      304,
      "NOT_MODIFIED",
      "Old and new password, both are same! Please try with different password!"
    );

  const isPasswordChanged: Boolean = await userServices.updatePassword(
    req.body
  );

  if (isPasswordChanged)
    new ApiResponse(
      200,
      "SUCCESS!",
      "Password changed successfully!",
      {
        message: "Your new password is updated successfully",
      },
      res
    );
};

// Forget Password Functionality completed
export const ForgetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validation.ForgetPasswordValidation.validateAsync(req.body);

  await userServices.forgetPassword(req.body);

  new ApiResponse(
    200,
    "SUCCESS!",
    "Check your email to reset password!",
    {
      message:
        "Check your inbox and click the provided link to change your password!",
    },
    res
  );
};

// Reset Password Functionality completed
export const ResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validation.UpdatePassword.validateAsync(req.body);

  const {
    newPassword,
    userId,
  }: { newPassword: string; userId: { id: string } } = req.body;

  const user = await User.findById(userId.id);
  if (!user)
    throw new ApiError(
      500,
      "User not found!",
      "Something went wrong while generating Access and Refresh token!"
    );

  const isPasswordNotModified: Boolean = await user.matchPassword(newPassword);
  if (isPasswordNotModified)
    throw new ApiError(
      304,
      "NOT_MODIFIED!",
      "Password is same as old one, Try with another password!"
    );

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  new ApiResponse(
    200,
    "SUCCESS!",
    "Password changed successfully!",
    {
      message: "Your new password is updated successfully",
    },
    res
  );
};

// LogOut Functionality completed
export const LogOut = async (req: Request, res: Response): Promise<void> => {
  const { user }: { user: { id: string } } = req.body;
  await User.findByIdAndUpdate(
    user.id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = { httpOnly: true, secure: true };

  res.clearCookie("accessToken", options).clearCookie("refreshToken", options);

  new ApiResponse(
    200,
    "USER_LOGED_OUT",
    "User loged out successfully!",
    {
      message: "Logout successfully!",
    },
    res
  );
};

export const VerifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.query.token as string;
  if (!token)
    throw new ApiError(
      401,
      "EMAIL_VERIFICATION_FAILED!",
      "Please request for the verification mail again!"
    );
  await userServices.verifyEmail(token);

  new ApiResponse(
    202,
    "EMAIL_VERIFIED!",
    "Enjoy exploring voice nest",
    [],
    res
  );
};
