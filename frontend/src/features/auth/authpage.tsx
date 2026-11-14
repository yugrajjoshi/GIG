import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.svg";

export default function AuthPage() {
  const navigate = useNavigate();

  // Step state: 'phone' for number entry, 'otp' for OTP verification
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(30);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const fullPhone = `${countryCode}${phoneNumber.trim()}`;

  // Handle Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    if (phoneNumber.trim().length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        phone: fullPhone,
      });
      setStep("otp");
      setTimer(30);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Failed to send OTP. Make sure the backend server is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (otp.trim().length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        phone: fullPhone,
        otp: otp.trim(),
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/customerhome");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Verification failed. Please check the OTP and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex w-full h-screen bg-gray-100">
      <div className="flex bg-white justify-center items-center w-[90%] max-w-xl m-auto rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col justify-between items-center w-full">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} className="w-28 h-28 mb-3" alt="logo" />
            <h1 className="text-2xl font-bold text-gray-800">
              {step === "phone" ? "Sign In / Register" : "Enter Verification Code"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              {step === "phone"
                ? "Enter your mobile number to get an OTP"
                : `We sent a 6-digit code to ${fullPhone}`}
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm mb-4 text-center">
              {errorMessage}
            </div>
          )}

          {/* Step 1: Phone input */}
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-16 border border-gray-300 rounded-lg p-3 text-center font-medium focus:ring-2 focus:ring-orange-400 outline-none"
                  aria-label="Country Code"
                />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            /* Step 2: OTP input */
            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-widest text-3xl font-mono font-bold border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-400 outline-none"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>

              <div className="flex justify-between items-center text-sm mt-2 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setErrorMessage("");
                  }}
                  className="text-gray-500 hover:text-gray-800 underline cursor-pointer"
                >
                  Change number
                </button>
                {timer > 0 ? (
                  <span className="text-gray-400">Resend in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-orange-500 font-medium hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-xs text-gray-400">
            By signing in, you agree to our Terms & Privacy Policy
          </div>
        </div>
      </div>
    </main>
  );
}
