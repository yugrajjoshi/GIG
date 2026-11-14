import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  SendOtpRequest,
  VerifyOtpRequest,
  OtpRecord,
  AuthUserPayload,
  AuthResponse,
} from "./auth.types.js";

// In-memory OTP storage (Map: phone -> OtpRecord)
const otpStore = new Map<string, OtpRecord>();

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key";

/**
 * Generates and sends a 6-digit OTP
 */
export const sendOtp = async (
  req: Request<{}, {}, SendOtpRequest>,
  res: Response<AuthResponse | { error: string }>
): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!phone || phone.trim().length < 10) {
      res.status(400).json({ error: "A valid phone number is required." });
      return;
    }

    // 1. Generate 6-digit random OTP & hash it for security
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    // 2. Save in store
    otpStore.set(phone, { otpHash, expiresAt, attempts: 0 });

    // 3. Dispatch SMS or print to terminal in dev mode
    if (process.env.NODE_ENV === "production") {
      // Connect real SMS provider (Twilio / Fast2SMS / MSG91) here
    } else {
      console.log(`\n========================================`);
      console.log(`[DEV OTP] Phone: ${phone} | OTP: ${otp}`);
      console.log(`========================================\n`);
    }

    res.status(200).json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("sendOtp error:", error);
    res.status(500).json({ error: "Internal server error while sending OTP." });
  }
};

/**
 * Validates the OTP and returns a JWT
 */
export const verifyOtp = async (
  req: Request<{}, {}, VerifyOtpRequest>,
  res: Response<AuthResponse | { error: string }>
): Promise<void> => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      res.status(400).json({ error: "Phone number and OTP are required." });
      return;
    }

    const record = otpStore.get(phone);

    if (!record) {
      res.status(400).json({ error: "OTP expired or was never requested for this number." });
      return;
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      res.status(400).json({ error: "OTP has expired. Please request a new one." });
      return;
    }

    if (record.attempts >= 3) {
      otpStore.delete(phone);
      res.status(429).json({ error: "Too many failed attempts. Please request a new OTP." });
      return;
    }

    // Validate OTP hash
    const inputHash = crypto.createHash("sha256").update(otp.trim()).digest("hex");
    if (inputHash !== record.otpHash) {
      record.attempts += 1;
      res.status(400).json({ error: "Incorrect OTP. Please try again." });
      return;
    }

    // Invalidate OTP immediately after successful use
    otpStore.delete(phone);

    // Create session payload and JWT
    const payload: AuthUserPayload = { phone, role: "customer" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      token,
      user: payload,
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ error: "Internal server error while verifying OTP." });
  }
};
