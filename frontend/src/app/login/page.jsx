"use client";
import Image from "next/image";
import Link from "next/link";
import { BorderInput } from "@/components/ui/input/input";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { login, googleSignup, updateUserEmailVerification } from "@/lib/api";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

import { ErrorMessage } from "@/components/shared/common/ErrorMessage";
import Button from "@/components/ui/buttons/DefaultButton";
import { sendOtpEmail } from "@/lib/EmailService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState({ message: "", type: "" });
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const otpRefs = useRef([]);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
      setError({ message: "Enter all 6 digits of the OTP", type: "success" });
      return;
    }

    if (enteredOtp === generatedOtp) {
      const response = await updateUserEmailVerification(email, true);
      if (response.success) {
        const token = sessionStorage.getItem("fe-token");
        localStorage.setItem("fe-token", token);
        const redirectPath = localStorage.getItem("redirectPath") || "/";
        router.push(redirectPath);
      }
    } else {
      setError({ message: "Invalid OTP. Please try again", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ message: "", type: "" });

    try {
      const response = await login(email, password);

      if (response && response.role === "user") {
        if (!response.isEmailVerified) {
          const newOtp = generateOtp();
          setGeneratedOtp(newOtp);
          await sendOtpEmail(response.email, newOtp, undefined, response.name);
          setOtpSent(true);
        } else {
          localStorage.setItem("fe-token", response.token);
          setLoading(false);
          setError({ message: "Login Successful", type: "success" });
          const redirectPath = localStorage.getItem("redirectPath") || "/";
          localStorage.removeItem("redirectPath");
          router.push(redirectPath);
        }
      } else {
        setLoading(false);
        setError({
          message: response.message || "Invalid login credentials",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      if (err.response && err.response.status === 404) {
        setError({ message: "Invalid login credentials", type: "error" });
      } else {
        setError({
          message: err.response?.message || "Invalid login credentials",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError({ message: "", type: "" });

      const result = await signInWithPopup(auth, googleProvider);

      if (!result?.user?.email) {
        setError({ message: "Failed to sign in with Google", type: "error" });
      }

      // Extract required user data
      const userData = {
        tokenId: result._tokenResponse.idToken,
        email: result.user.email,
        name: result.user.displayName || "",
        photoURL: result.user.photoURL || "",
        uid: result.user.uid,
        idToken: result._tokenResponse.idToken,
      };

      // Send to backend
      const response = await googleSignup(userData.idToken);

      if (response && response.token) {
        localStorage.setItem("fe-token", response.token);
        setError({ message: "Login Successful", type: "success" });
        setTimeout(
          () => setError({ message: "Login Successful", type: "success" }),
          3000
        );
        const redirectPath = localStorage.getItem("redirectPath") || "/";
        localStorage.removeItem("redirectPath");
        router.push(redirectPath);
      } else {
        throw new Error(response.message || "Invalid response from server");
      }
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      setError({
        message: "Failed to sign in with Google",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative text-sm md:text-lg">
      <Image
        src={"/svg/auth-bg.svg"}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 z-0 w-full h-full bg-gradient-to-t from-white via-transparent"></div>
      <div className="w-full flex items-center justify-center relative z-10">
        <div className="hidden lg:block"></div>
        {error.message && (
          <ErrorMessage message={error.message} type={error.type} />
        )}
        {/* Center side - Form */}
        <div
          className="w-fit  mx-auto  md:mt-10 animate-fade-in "
          style={{ animationDelay: `500ms` }}
        >
          <div className="bg-white rounded-3xl p-8 shadow-xl m-5">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Link href="/">
                <Image
                  src={"/images/logo.png"}
                  alt="Prophetic Ruqyah"
                  width={200}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            <h1 className="text-2xl text-gray-700 text-center mb-8 pb-3 w-full border-b-2">
              Login
            </h1>

            {!otpSent ? (
              <form onSubmit={handleSubmit} className="space-y-8  w-[250px] md:w-[350px] lg:w-[400px]">
                <BorderInput
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Enter your Email Address here"
                  className="text-sm !sm:w-[400px] md:w-[350px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <BorderInput
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <p
                  style={{ margin: "15px 0 0 0" }}
                  className="m-0 text-sm cursor-pointer text-[#474747]"
                  onClick={() => router.push("/ForgotPassword")}
                >
                  Forgot Password?
                </p>

                <div className="">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-3"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>
                </div>
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>
                <div className=" rounded-3xl">
                  <button
                    type="button"
                    className="login-with-google-btn w-full rounded-lg"
                    onClick={handleGoogleSignIn}
                  >
                    Sign in with Google
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-8">
                  Don't have an Account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
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
                  text={isLoading ? "Verifying..." : "Verify"}
                  color={"RuqyaGreen"}
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full py-3 mt-5"
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
