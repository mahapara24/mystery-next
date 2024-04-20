import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendEmailVerification(
  email: string,
  username: string,
  VerifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "mahapara2424@gmail.com",
      subject: "Mystery message | Verification code",
      react: VerificationEmail({ username, otp: VerifyCode }),
    });
    return { success: true, message: "Successfully sended verification email" };
  } catch (emailError) {
    console.error("Error sending verifcation", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
