import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, "./public");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    const uniqueName: string = String(
      Date.now() + Math.round(Math.random() * 10)
    );
    cb(null, uniqueName + "*" + file.originalname);
  },
});

export const fileUpload = multer({ storage });
