"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BorderInput } from "@/components/ui/input/input";
import Button from "@/components/ui/buttons/DefaultButton";
import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import { sendOtpEmail } from "@/lib/EmailService";
import { googleSignup, signup, updateUserEmailVerification } from "@/lib/api";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const otpRefs = useRef([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);

    try {
      await signup(formData.email, formData.name, formData.password);
      await sendOtpEmail(formData.email, newOtp, undefined, formData.name);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Enter all 6 digits of the OTP");
      return;
    }

    if (enteredOtp === generatedOtp) {
      const response = await updateUserEmailVerification(formData.email, true);
      if (response.success) {
        const token = sessionStorage.getItem("fe-token");
        localStorage.setItem("fe-token", token);
        router.push("/");
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await signInWithPopup(auth, googleProvider);

      if (!result?.user?.email) {
        setError("Failed to sign up with Google");
        return;
      }

      const userData = {
        tokenId: result._tokenResponse.idToken,
        email: result.user.email,
        name: result.user.displayName || "",
        photoURL: result.user.photoURL || "",
        uid: result.user.uid,
        idToken: result._tokenResponse.idToken,
      };

      const response = await googleSignup(userData.idToken);

      if (response && response.token) {
        localStorage.setItem("fe-token", response.token);
        setError({ message: "Registration successful!", type: "success" });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Firebase Error:", error);
      setError("Failed to sign up with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative">
      <Image
        src={"/svg/auth-bg.svg"}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 z-0 w-full h-full bg-gradient-to-t from-white via-transparent"></div>
      <div className="w-full  flex items-center justify-center relative z-10">
        <div
          className="w-fit p-5   mx-auto md:mt-10 animate-fade-in"
          style={{ animationDelay: `500ms` }}
        >
          <div className="w-fit bg-white rounded-3xl p-8 shadow-xl m-5 ">
            <div className="flex justify-center mb-6 ">
              <Link href="/">
                <Image
                  src={"/images/logo.png"}
                  alt="Logo"
                  width={200}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            <h1 className="text-2xl text-gray-700 text-center mb-8 font-bold pb-3 border-b-2">
              {otpSent ? "Verify Your Email" : "Registration"}
            </h1>

            {error && <ErrorMessage message={error} type="error" />}

            {!otpSent ? (
              <form onSubmit={handleSubmit} className="space-y-8  w-[250px] md:w-[350px] lg:w-[400px] ">
                <BorderInput
                  type="text"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="text-sm  "
                />
                <BorderInput
                  type="email"
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  className="text-sm"
                />
                <BorderInput
                  type="password"
                  name="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a Password"
                  className="text-sm"
                />
                <BorderInput
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="text-sm"
                />

                <Button
                  type="submit"
                  bg={true}
                  text={loading ? "Signing up..." : "Sign Up"}
                  color={"RuqyaGreen"}
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-3 mt-5"
                />
              </form>
            ) : (
              <form onSubmit={handleOtpVerify} className="space-y-8  w-[250px] md:w-[350px] lg:w-[400px]">
                <p className="text-sm text-[#474747] text-center mt-2 mb-7 font-bold">
                  Enter the OTP sent to your email to verify your identity.
                </p>
                <div className="flex justify-center gap-3 ">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      maxLength={1}
                      style={{ border: "1px solid #474747" }}
                      className="w-8 h-8 md:w-11 md:h-11 md:mx-2 mx-1 !border !border-gray-300 text-center text-lg font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      ref={(el) => (otpRefs.current[index] = el)}
                    />
                  ))}
                </div>
                <Button
                  type="submit"
                  bg={true}
                  text={loading ? "Verifying..." : "Verify"}
                  color={"RuqyaGreen"}
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-3 mt-5"
                />
              </form>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            <div className="mt-5">
              <button
                type="button"
                className="login-with-google-btn w-full rounded-lg"
                onClick={handleGoogleSignUp}
              >
                Sign Up with Google
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SignUp;
