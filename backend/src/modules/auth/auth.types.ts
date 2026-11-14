export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface OtpRecord {
  otpHash: string;
  expiresAt: number;
  attempts: number;
}

export interface AuthUserPayload {
  phone: string;
  role: "customer" | "worker" | "cooperative";
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUserPayload;
}
