import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "25kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "15kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

// import routes

import userRouter from "./routes/user.routes";
import router from "./routes/swagger.routes";

// using users routes {SignIn, SignUp}

app.use("/api/v1/users", userRouter);
app.use("/api/v1/docs", router);

export default app;
