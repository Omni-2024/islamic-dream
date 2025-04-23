"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getUserProfileWithEmail, resetPassword } from "@/lib/api";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import { Loader2 } from "lucide-react";
import { Eye, EyeSlash } from "iconsax-react";
import { sendOtpEmail } from "@/lib/EmailService";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const router = useRouter();
  const [error, setError] = useState({ message: "", type: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle OTP Input
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Handle API Calls
  const handleNext = async () => {
    setLoading(true);
    try {
      if (step === 1) {
        if (!email) {
          setError({ message: "Email is required", type: "error" });
          return;
        }
        if (!validateEmail(email)) {
          setError({ message: "Please enter a valid email address", type: "error" });
          return;
        }

        const userProfile = await getUserProfileWithEmail(email);
        // console.log("Test", userProfile);
        if (userProfile.data.status) {
          const { name, email } = userProfile.data.user;
          const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedOtp(newOtp);
          await sendOtpEmail(email, newOtp, undefined, name);

          setError({ message: `OTP Sent to ${email}`, type: "success" });
          setStep(2);
        } else {
          setError({ message: `User not found with ${email}.`, type: "error" });
        }
        // await sendOtp(email); // Mock API Call
      } else if (step === 2) {
        const enteredOtp = otp.join("");
        if (enteredOtp !== generatedOtp) {
          setError({ message: "Invalid OTP, please try again.", type: "error" });
        } else {
          setStep(3);
        }
      } else if (step === 3) {
        if (password !== confirmPassword) {
          setError({ message: "Passwords do not match", type: "error" });
          return;
        }
        await resetPassword(email, password);
        setError({ message: "Password Reset Successful", type: "success" });
        router.push("/login");
      }
    } catch (error) {
      setError({ message: error.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error.message && <ErrorMessage message={error.message} type={error.type} />}
      <div
        className="min-h-screen flex items-center justify-center bg-gray-100"
        style={{
          backgroundImage: 'url("/svg/auth-bg.svg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="flex flex-col justify-center items-center bg-opacity-30 shadow-xl backdrop-blur-lg max-w-full sm:max-w-3xl w-full bg-white sm:shadow-box sm:rounded-3xl py-10 sm:py-16 sm:mx-5 sm:my-auto px-4 sm:px-0">
          <Link href="/">
            <Image src={"/images/logo.png"} alt="Prophetic Ruqyah" width={100} height={100} className="h-20 w-auto" />
          </Link>
          <h1 className="text-2xl font-extrabold mt-6 text-center text-secondary-50">Forgot Password</h1>

          {/* Steps */}
          <div className="w-fit">
            {/* Step 1: Enter Email */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}>
                <p className="text-sm text-[#474747] text-center mt-2 mb-7 font-bold">Enter your email address, and we'll send you a otp to reset your password.</p>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full h-12 px-3 border border-gray-300 rounded-xl focus:outline-none" />
              </motion.div>
            )}

            {/* Step 2: OTP Input */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}>
                <p className="text-sm text-[#474747] text-center mt-2 mb-7 font-bold">Enter the OTP sent to your email to verify your identity.</p>

                <div className="flex justify-center gap-2 mt-4">
                  {otp.map((digit, index) => (
                    <input key={index} id={`otp-${index}`} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} className="w-11 h-11 mx-2 border text-center text-lg font-bold border-gray-300 rounded-xl focus:outline-none" />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Enter New Password */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}>
                <p className="text-sm text-[#474747] text-center mt-2 mb-7 font-bold">Set a new password for your account. Make sure it is strong and secure.</p>

                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 block w-full h-12 px-3 border border-gray-300 rounded-xl focus:outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-4 text-gray-500">
                    {showPassword ? <EyeSlash size={15} color="#474747" /> : <Eye size={15} color="#474747" />}
                  </button>
                </div>
                <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-2 block w-full h-12 px-3 border border-gray-300 rounded-xl focus:outline-none" />
              </motion.div>
            )}

            {/* Next Button */}
            <button disabled={loading} onClick={handleNext} className="w-full flex justify-center mt-6 py-2 px-6 h-10 border rounded-2xl shadow-sm text-m font-bold text-white bg-RuqyaGreen hover:bg-primary-800">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Next"}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
