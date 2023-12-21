import { NextFunction, Request, Response } from "express";
import { authTokenName, getSecretKey } from "../controllers/authController";
import jwt, { VerifyErrors } from 'jsonwebtoken';

interface userIdProp {
  userId: string,
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[authTokenName];
  const secretKey = getSecretKey();
  jwt.verify(token, secretKey, (err: VerifyErrors | null, decodedToken: any) => {
    console.log(decodedToken);
    if (err) {
      res.status(400).json({error: 'user is not authorized! Please login or signup!'});
    } else {
      // req.userId = decodedToken.user_id;
      next();
    }
  });
}