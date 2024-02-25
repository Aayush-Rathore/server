import IUser from "../interface/user.interface";
import { User } from "../models/userSchema.models";
import ApiError from "../utils/apiError.utils";
import {
  CreateUserInterface,
  LogInUserInterface,
  UpdatePasswordInterface,
} from "../interface/services.interface";
import sendMail from "../utils/sendMail.utils";
import { JwtPayload } from "jsonwebtoken";
import { verifyRefreshToken } from "../utils/verifyTokens.utils";
import DB_Functions from "../database/db.functions";

class UserServices {
  private DbFunctions = new DB_Functions();

  private generateAccessAndRefreshToken = async (
    user: IUser
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error: any) {
      throw new ApiError(
        500,
        error.message,
        "Something went wrong while generating Access and Refresh token!"
      );
    }
  };

  public sinUpUser = async (
    userCredentials: CreateUserInterface
  ): Promise<void> => {
    try {
      const { registeredUser, token } =
        await this.DbFunctions.createUser(userCredentials);

      sendMail(
        registeredUser.fullName,
        registeredUser.email,
        "Verify Your Email Address for Voice Nest",
        token
      );
    } catch (error: any) {
      throw new ApiError(
        error.statusCode,
        error.message,
        "Something went wrong while creating a user!",
        error
      );
    }
  };

  public logInUser = async (
    login: LogInUserInterface
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> => {
    const user = await this.DbFunctions.logInUser(login);

    const checkPass = await user.matchPassword(login.password);

    if (!checkPass)
      throw new ApiError(
        401,
        "WRONG_CREDENTIALS!",
        "Check your password and try again!"
      );

    const { accessToken, refreshToken } =
      await this.generateAccessAndRefreshToken(user);

    return { user, accessToken, refreshToken };
  };

  public verifyEmail = async (token: string): Promise<void> => {
    const verifyUser: JwtPayload | string = await verifyRefreshToken(
      token
    ).catch((error: any) => {
      throw new ApiError(401, error.message, "Invalid verification url!");
    });

    if (typeof verifyUser === "object" && verifyUser !== null) {
      await this.DbFunctions.verifyUser(verifyUser.id);
    }
  };

  public forgetPassword = async ({
    email,
    username,
  }: {
    email?: string;
    username?: string;
  }): Promise<void> => {
    const user = await this.DbFunctions.findUser({ email, username });

    const token: string = await user.tempToken();
    sendMail(user.fullName, user.email, "Change your password!", token);
  };

  public updatePassword = async (
    updatePassword: UpdatePasswordInterface
  ): Promise<Boolean> => {
    const user = await this.DbFunctions.findUser({ id: updatePassword.id });
    const checkPass = await this.DbFunctions.matchPassword(
      user,
      updatePassword.oldPassword
    );

    if (checkPass) {
      user.password = updatePassword.newPassword;
      await user.save({ validateBeforeSave: false });
      return true;
    } else {
      return false;
    }
  };
}

export default UserServices;
