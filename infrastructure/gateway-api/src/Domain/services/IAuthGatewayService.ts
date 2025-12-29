import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { OTPResendDTO } from "../DTOs/OTPResendDTO";
import { OTPVerificationDTO } from "../DTOs/OtpVerificationDTO";
import { AuthJwtResponse } from "../types/AuthJwtResponse";
import { AuthResponseType } from "../types/AuthResponse";

export interface IAuthGatewayService {
  login(data: LoginUserDTO): Promise<AuthResponseType>;
  verifyOtp(data: OTPVerificationDTO): Promise<AuthJwtResponse>;
  resendOtp(data: OTPResendDTO): Promise<AuthResponseType>;
  validateToken(token: string): Promise<{
    valid: boolean;
    payload?: any;
    isSysAdmin?: boolean;
    error?: string;
  }>;
}