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
  try {
    const { full_name, gender, email, password, phone_number, date_of_birth } =
      req.body;
    if (!["male", "female"].includes((gender as string).toLowerCase()))
      throw new Error("Gender should either be male or female");

    if (password.length < 6)
      throw new Error("Password must be at least 6 characters long");

    if (emailIsValid(email) && passwordIsValid(password)) {
      const hashedPassword = await hashPassword(password);
      const genderData = await db.query.gender.findFirst({
        where: () => eq(schema.gender, gender),
      });
      // create user
      const newUser = await db
        .insert(schema.users)
        .values({
          full_name,
          gender_id: genderData!.id,
          email,
          password: hashedPassword,
          phone_number,
          date_of_birth,
        })
        .returning();

      // send welcome mail to user
      const msg = mailMsg({
        to: email,
        templateId: process.env.SG_WELCOME_TEMPLATE_ID!,
      });
      await sgMail.send(msg);

      console.log(newUser);
      // generate jwt token and add that to cookie on response
      const jwtToken = generateJWT(newUser[0].id);
      res.cookie(authTokenName, jwtToken, {
        httpOnly: true,
        maxAge: JWT_MAX_AGE * 1000,
        secure: process.env.NODE_ENV === "production",
      });
      console.log(6);

      res.status(400).json({ user: newUser[0] });
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



export const change_password_post = async (req: Request, res: Response) => {
  const authToken = req.cookies[authTokenName];
  jwt.verify(authToken, getSecretKey(), async (errors: any, payload: any) => {
    try {
      if (errors) throw new Error("JWT token is invalid");

      const userId = payload!.userId;
      const { current_password, new_password } = req.body;

      const user = await db.query.users.findFirst({
        where: () => eq(schema.users.id, userId),
      });
      if (!user) throw new Error("User with current id doesn't exist");

      const passwordMatches = await bcrypt.compare(
        current_password,
        user.password
      );
      if (!passwordMatches)
        throw new Error("password does not match your current password");

      const hashedPassword = await hashPassword(new_password);
      await db
        .update(schema.users)
        .set({ password: hashedPassword })
        .where(eq(schema.users.id, userId))
        .returning();

      res.status(200).json({ msg: "password has been successfully updated!" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
};

// Sends Reset Password Url To Users Email
// generates jwt token, sends the jwt token to users email address to
// allow them send the reset password token to the /reset_password
// endpoint to update their password
export const forgot_password_post = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, email),
    });
    if (!user) throw new Error("Email does not exist");

    // TODO: send link that allows the user update reset their password

    const token = generateJWT({ email }, 60 * 60);
    res.status(200).json({ reset_password_token: token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Verifies that the password reset token is valid and then if it is
// it allows users update there password
export const reset_password_post = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    const { password } = req.body;

    console.log(2);
    console.log("token", token);
    console.log("new password", password);

    jwt.verify(
      token,
      getSecretKey(),
      async (errors, payload: any & { email: string }) => {
        if (errors)
          return res.status(400).json({ errors: "Token is not valid" });

        console.log(3);
        const { email } = payload!;
        const user = await db.query.users.findFirst({
          where: () => eq(schema.users.email, email),
        });
        if (!user) throw new Error("User with email does not exist");
        const hashedPassword = await hashPassword(password);

        const updatedUser = await db
          .update(schema.users)
          .set({ password: hashedPassword })
          .where(eq(schema.users.id, user.id))
          .returning();
        console.log("Updated User: ", updatedUser);

        res.status(200).json({ response: "Password has been updated!" });
      }
    );
  } catch (err: any) {
    res.status(400).json({ errors: err.message });
  }
};
