import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if a verified user already has this username
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        { status: 400 }
      );
    }

    // Check if user exists by email
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      // If user exists but not verified → update OTP and resend email
      if (!existingUserByEmail.isVerified) {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        await existingUserByEmail.save();

        await sendVerificationEmail(email, username, verifyCode);

        return Response.json(
          {
            success: true,
            message: "A new verification code has been sent to your email.",
          },
          { status: 200 }
        );
      }

      // If the email already belongs to a verified account
      return Response.json(
        {
          success: false,
          message: "Email is already registered.",
        },
        { status: 400 }
      );
    }

    // Create new user (never registered before)
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

    // Send verification email
    await sendVerificationEmail(email, username, verifyCode);

    return Response.json(
      {
        success: true,
        message: "Account created successfully. Verification email sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while registering the user.",
      },
      { status: 500 }
    );
  }
}
