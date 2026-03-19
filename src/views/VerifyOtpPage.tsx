import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Route } from "@/routes/auth/verify";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

// Schema: Expects exactly 6 digits
const otpSchema = z
  .string()
  .length(8, "OTP must be exactly 8 digits")
  .regex(/^\d+$/, "Only numbers allowed");

const timer = 60;

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState<string[]>(new Array(8).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(timer);
  const [canResend, setCanResend] = useState(false);

  const { signInWithOtp, verifyOtp } = useAuth();

  const { email } = Route.useRouteContext();

  const navigate = useNavigate({ from: "/auth/verify" });

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    const result = otpSchema.safeParse(otpString);

    if (!result.success) {
      toast.error("The code you entered is incorrect or has expired.");
      return;
    }

    // Logic for API call here
    const { error } = await verifyOtp(email, otpString);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Code verified successfully!");
      // navigate to /dashboard
      navigate({ to: "/dashboard" });
    }
  };

  const handleResendOtp = async () => {
    setSeconds(timer);
    setCanResend(false);
    const { error } = await signInWithOtp(email);

    if (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Verify your email
      </h2>
      <p className="text-center text-gray-500 mt-2 mb-8">
        Enter the 8-digit code sent to your inbox.
      </p>

      <div className="flex justify-between gap-2 mb-6">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-14 border-2 rounded-lg text-center text-xl font-semibold focus:border-blue-500 focus:outline-none transition-colors"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Verify Account
      </button>

      <p className="text-center text-sm text-gray-500 mt-6">
        {canResend ? (
          <>
            Didn't receive a code?{" "}
            <button
              className="text-blue-600 hover:underline font-semibold"
              onClick={handleResendOtp}
            >
              Resend
            </button>
          </>
        ) : (
          <p className="text-gray-500 text-sm">
            Resend code in{" "}
            <span className="font-mono">{formatTime(seconds)}</span>
          </p>
        )}
      </p>
    </>
  );
}
