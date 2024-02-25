const security = [
  {
    bearerAuth: [],
  },
];

const SignUp = {
  tags: ["User"],
  description: "Create new user account!",
  operationId: "Sign Up",
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            fullName: {
              type: "string",
              example: "Aayush Rathore",
            },

            username: {
              type: "string",
              example: "aayu.r",
            },

            email: {
              type: "string",
              example: "jamanoh745@gexige.com",
            },

            password: {
              type: "string",
              example: "Password@123",
            },

            avatar: {
              type: "file",
              example: "profile.png",
              required: false,
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    "200": {
      description: "one-time password (OTP) email sent successfully",
    },
    "400": {
      description: "Validation error",
    },
    "429": {
      description: "Please wait at least 1 minute before requesting a new OTP.",
    },
    "500": {
      description: "Internal server error",
    },
  },
};

const Login = {
  tags: ["User"],
  description: "Login user in the system",
  operationId: "login",
  requestBody: {
    content: {
      "application/x-www-form-urlencoded": {
        schema: {
          type: "object",
          properties: {
            username: {
              type: "string",
              example: "aayu.r",
              required: false,
            },
            email: {
              type: "string",
              example: "john@gmail.com",
              required: false,
            },
            password: {
              type: "string",
              example: "Password@123",
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    "201": {
      description: "User login successfully!",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              _id: {
                type: "string",
                example: "6374e19dac314421985f43f5",
              },
              username: {
                type: "string",
                example: "john",
              },
              email: {
                type: "string",
                example: "john@gmail.com",
              },
              token: {
                type: "string",
                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiQmh1dmEiLCJsYXN0X25hbWUiOiJCaGF2aW4iLCJmdWxsX25hbWUiOiJCaHV2YSBCaGF2aW4iLCJlbWFpbCI6ImJoYXZpbi5iMkBnbWFpbC5jb20iLCJyb2xlX25hbWUiOiJ1c2VyIiwiaWF0IjoxNjY1NzQxNjE5LCJleHAiOjE2NjU4MjgwMTl9.CCi2PeTODj4hEDavdwbpC5WHxbe9NLRE79n9aQrciKw",
              },
            },
          },
        },
      },
    },
    "400": {
      description: "Validation error",
    },
    "401": {
      description: "Invalid OTP or Email",
    },
    "404": {
      description: "User not exist.",
    },
    "410": {
      description: "OTP expired",
    },
    "429": {
      description:
        "Account Blocked: 5 wrong OTP attempts. Please try again after 1 hour.",
    },
    "500": {
      description: "Internal server error",
    },
  },
};

const VerifyEmail = {
  tags: ["User"],
  description: "Verify email with jwt token!",
  operationId: "Verify Email",
  parameters: [
    {
      in: "query",
      name: "token",
      required: true,
      schema: {
        type: "string",
        example:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDNhYmIwZjY2MGZkYzA4MDQ0YWMxZiIsImlhdCI6MTcwODM3MDg2NCwiZXhwIjoxNzA4NjMwMDY0fQ.MqWCzrIDGOdcOJ50VqbQVksEHkDW2Ic8Y_w0Cti9RdI",
      },
      description: "Email verification token",
    },
  ],
  responses: {
    "200": {
      description: "Return Users Details",
    },
    "404": {
      description: "User not found",
    },
    "500": {
      description: "Internal server error",
    },
  },
};

const ForgetPassword = {
  tags: ["User"],
  description: "Request for a email to reset passowrd through link!",
  operationId: "Forget Password",
  requestBody: {
    content: {
      "application/x-www-form-urlencoded": {
        schema: {
          type: "object",
          properties: {
            username: {
              type: "string",
              example: "aayu.r",
              required: false,
            },
            email: {
              type: "string",
              example: "jamanoh745@gexige.com",
              required: false,
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    "200": {
      description: "Return Users Details",
    },
    "404": {
      description: "User not found",
    },
    "500": {
      description: "Internal server error",
    },
  },
};

const ResetPassword = {
  tags: ["User"],
  description: "Reset password by using forget password link!",
  operationId: "Reset Password",
  requestBody: {
    content: {
      "application/x-www-form-urlencoded": {
        schema: {
          type: "object",
          properties: {
            password: {
              type: "string",
              example: "Password@123",
              required: true,
            },
          },
        },
      },
    },
    required: true,
  },
  parameters: [
    {
      in: "query",
      name: "token",
      required: true,
      schema: {
        type: "string",
        example:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDNhYmIwZjY2MGZkYzA4MDQ0YWMxZiIsImlhdCI6MTcwODM3MDg2NCwiZXhwIjoxNzA4NjMwMDY0fQ.MqWCzrIDGOdcOJ50VqbQVksEHkDW2Ic8Y_w0Cti9RdI",
      },
      description: "Url varification token",
    },
  ],
};

export { SignUp, Login, security, VerifyEmail, ForgetPassword, ResetPassword };
