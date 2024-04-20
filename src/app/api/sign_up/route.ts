import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendEmailVerification } from "@/helpers/sendEmailVerificaton";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "USername is already taken",
        },
        { status: 400 }
      );
    }
    const existingByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingByEmail) {
      if (existingByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User Already Exists with this Email" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingByEmail.password = hashedPassword;
        existingByEmail.verifyCode = verifyCode;
        existingByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    //send Verification email
    const emailResponse = await sendEmailVerification(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "User registered successfully.Please verify your email",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Registering user Error");
    return Response.json(
      {
        success: false,
        message: "Error Registering user",
      },
      { status: 500 }
    );
  }
}
