import { Request, Response } from "express";
import db from "../../db";
import * as schema from "../../db/schema";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import sgMail from "@sendgrid/mail";
import { mailMsg } from "../utils/sendgrid";

export const authTokenName = "user-token";
const JWT_MAX_AGE = 60 * 60 * 24 * 30;
// const JWT_MAX_AGE = 5;

export interface JWTPayload {
  user_id: string;
  iat: number;
  exp: number;
}

// utils
const emailIsValid = (email: string) => {
  return true;
};

const passwordIsValid = (password: string) => {
  return true;
};

export const getSecretKey = () => {
  return process.env.SECRET_KEY ?? "";
};

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const generateJWT = (
  userId: string | Record<string, any>,
  expiresIn?: number
) => {
  const secretKey = getSecretKey();
  const jwtToken = jwt.sign(
    typeof userId === "string" ? { userId } : userId,
    secretKey,
    {
      algorithm: "HS256",
      expiresIn: expiresIn ?? JWT_MAX_AGE,
    }
  );
  console.log(jwtToken);

  return jwtToken;
};

// Controllers
export const signup_post = async (req: Request, res: Response) => {
  console.log(1);
  const { email, password } = req.body;
  
  try {
    if (emailIsValid(email) && passwordIsValid(password)) {
      console.log(2);
      const hashedPassword = await hashPassword(password);
      console.log(3);
      const newUser = await db
      .insert(schema.users)
      .values({ email, password: hashedPassword })
      .returning();
      
      console.log(4);
      console.log(newUser);
      // generate jwt token and add that to cookie on response
      const jwtToken = generateJWT(newUser[0].id);
      console.log(5);
      res.cookie(authTokenName, jwtToken, {
        httpOnly: true,
        maxAge: JWT_MAX_AGE * 1000,
        secure: process.env.NODE_ENV === "production",
      });
      console.log(6);

      res.status(400).json({ user: newUser });
    }
  } catch (error: any) {
    res.status(201).json({ error: error.message });
  }
};

export const login_post = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (emailIsValid(email) && password) {
      const user = await db.query.users.findFirst({
        where: (table, { eq }) => eq(email, table.email),
      });
      if (!user) throw new Error("User with email not found");

      const passwordMatches = await bcrypt.compare(password, user.password!);
      if (!passwordMatches) throw new Error("Password is incorrect");

      const jwtToken = generateJWT(user.id);
      res.cookie(authTokenName, jwtToken, {
        httpOnly: true,
        maxAge: JWT_MAX_AGE * 1000,
        secure: process.env.NODE_ENV === "production",
      });

      res.status(400).json({ token: jwtToken });
    }
  } catch (error: any) {
    res.status(201).json({ error: error.message });
  }
};

export const forgot_password_post = async (req: Request, res: Response) => {
  try {
    const {email} = req.body;
    const user = await db.query.users.findFirst({where: (table, {eq}) => eq(table.email, email)});
    if (!user) throw new Error('Email does not exist');
    
    const token = generateJWT(user.id, 60*60);
    res.status(200).json({ reset_password_token: token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// interface resetPasswordTokenPayloadProps { email: string }
export const reset_password_post = async (req: Request, res: Response) => {
  try {
    console.log(1);
    const token = req.query.token as string;
    const { password } = req.body;
    
    console.log(2);
    console.log('token', token);
    console.log('new password', password);

    jwt.verify(
      token,
      getSecretKey(),
      async (errors, payload: any & { email: string }) => {
        if (errors)
        return res.status(400).json({ errors: "Token is not valid" });
      
        console.log(3);
        const { userId } = payload!;
        const hashedPassword = await hashPassword(password);

        const updatedUser = await db
          .update(schema.users)
          .set({ password: hashedPassword })
          .where(eq(schema.users.id, userId))
          .returning();
        console.log('Updated User: ', updatedUser);
        
        res.status(200).json({ response: "Password has been updated!" });
      }
    );
  } catch (err: any) {
    res.status(400).json({ errors: err.message });
  }
};
