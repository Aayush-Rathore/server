import Joi from "joi";
import { User } from "../models/userSchema.models";

class Validation {
  private IdSchema = Joi.string();

  private passwordSchema = Joi.string()
    .min(5)
    .max(16)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])[A-Za-z\d!@#$%^&*()\-_=+{};:,<.>]{5,16}$/
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 5 and 16 characters long.",
    });

  private emailSchema = Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address.",
  });

  private usernameSchema = Joi.string()
    .lowercase()
    .regex(/^[a-z0-9_.-]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.pattern.base":
        "Username must be in lowercase and may contain only underscores, dots, or hyphens.",
      "string.min": "Username must be at least {#limit} characters long.",
      "string.max": "Username cannot exceed {#limit} characters.",
    });

  private fullNameSchema = Joi.string().min(3).max(50).required().messages({
    "string.min": "Full name must be at least {#limit} characters long.",
    "string.max": "Full name cannot exceed {#limit} characters.",
  });

  // private checkUsername

  public SignInValidation = Joi.object({
    password: this.passwordSchema,
    email: this.emailSchema.optional(),
    username: this.usernameSchema.optional(),
  })
    .xor("email", "username")
    .messages({
      "object.missing": "Please provide either email or username for login.",
    });

  public SignUpValidation = Joi.object({
    fullName: this.fullNameSchema,
    password: this.passwordSchema,
    email: this.emailSchema.external(async (email) => {
      try {
        const user = await User.findOne({ email });
        if (user) {
          throw new Error(`Email already in use! ${email}`);
        }
      } catch (error: any) {
        throw new Error(error);
      }
    }),
    username: this.usernameSchema.external(async (username) => {
      try {
        const user = await User.findOne({ username });
        if (user) {
          throw new Error(`Username already in use ${username}`);
        }
      } catch (error: any) {
        throw new Error(error);
      }
    }),
  });

  public ForgetPasswordValidation = Joi.object({
    email: this.emailSchema.optional(),
    username: this.usernameSchema.optional(),
  })
    .xor("email", "username")
    .messages({
      "object.missing": "Please provide either email or username for login.",
    });

  public UpdatePassword = Joi.object({
    id: this.IdSchema,
    oldPassword: this.passwordSchema,
    newPassword: this.passwordSchema,
  });
}

export default Validation;
