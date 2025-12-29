import { LoginUserDTO } from "../../models/auth/LoginUserDTO";
import { OtpResendDTO } from "../../models/auth/OtpResendDTO";
import { OTPVerificationDTO } from "../../models/auth/OtpVerificationDTO";
import { AuthJwtResponseType } from "../../types/auth/AuthJwtResponseType";
import { AuthResponseType } from "../../types/auth/AuthResponseType";

export interface IAuthAPI {
  login(data: LoginUserDTO): Promise<AuthResponseType>;
  verifyOtp(data: OTPVerificationDTO): Promise<AuthJwtResponseType>;
  resendOtp(data: OtpResendDTO): Promise<AuthResponseType>;
}