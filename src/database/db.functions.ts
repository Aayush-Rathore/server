import {
  CreateUserInterface,
  LogInUserInterface,
} from "../interface/services.interface";
import IUser from "../interface/user.interface";
import { User } from "../models/userSchema.models";
import ApiError from "../utils/apiError.utils";

class DB_Functions {
  public findUser = async ({
    username,
    email,
    id,
  }: {
    username?: string;
    email?: string;
    id?: string;
  }): Promise<IUser> => {
    const user = await User.findOne({
      $or: [{ username }, { email }, { _id: id }],
    });

    if (!user)
      throw new ApiError(
        404,
        "USER_NOT_FOUND",
        `User not found with this ${(email && `Email: ${email}`) || (username && `Username: ${username}`) || (id && `id: ${id}`)}`
      );

    if (!user?.isVerified)
      throw new ApiError(
        402,
        "VALIDATION_ERROR!",
        "Email is not verified!\n Verify your email before resetting your password!"
      );

    return user;
  };

  public createUser = async (
    createUserCredentials: CreateUserInterface
  ): Promise<{ registeredUser: IUser; token: string }> => {
    const registeredUser: IUser = await User.create(createUserCredentials);
    const token: string = await registeredUser.generateRefreshToken();
    return { registeredUser, token };
  };

  public logInUser = async (
    loginUserCredentials: LogInUserInterface
  ): Promise<IUser> => {
    const { username, email } = loginUserCredentials;
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user)
      throw new ApiError(
        402,
        "WRONG_CREDENTIALS!",
        `User not found with this ${(email && `Email: ${email}`) || (username && `Username: ${username}`)}`
      );

    if (!user?.isVerified)
      throw new ApiError(
        402,
        "WRONG_CREDENTIALS!",
        "Email is not verified!\nVerify your email before login!"
      );

    return user;
  };

  public verifyUser = async (id: string): Promise<void> => {
    await User.findByIdAndUpdate(
      { _id: id },
      {
        isVerified: true,
      }
    );
  };

  public matchPassword = async (
    user: IUser,
    oldPassword: string
  ): Promise<Boolean> => {
    const checkPass = await user.matchPassword(oldPassword);
    if (!checkPass)
      throw new ApiError(
        401,
        "WRONG_PASSWORD",
        "Wrong password, Please check password and try again!"
      );
    return true;
  };
}

export default DB_Functions;
