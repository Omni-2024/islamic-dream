"use client";
import {useRouter, useSearchParams} from 'next/navigation';
import DefultButton from '@/components/ui/buttons/DefaultButton';
import {useEffect} from "react";
import {updateAvailability, verifySession} from "@/lib/api";
import {sendMeetingEmail} from "@/lib/EmailService";

const CompletePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const verifySessionId = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) return;

      try {
        const response = await verifySession(sessionId);

        if (!response?.metadata) {
          console.error("Invalid response metadata:", response);
          return;
        }

        const { date, rakiEmail, userEmail, rakiName, userName, rakiId } = response.metadata;

        await updateAvailability(date, rakiId, false);

        console.log("Email testing",userEmail,rakiEmail,rakiName,userName,date)

        await sendMeetingEmail(
            userEmail,
            rakiEmail,
            userName,
            rakiName,
            date,
            `We look forward to your participation. If you have any questions or need to make changes, please let us know.`,
            "Your Meeting Has Been Scheduled Successfully"
        );
      } catch (error) {
        console.error("Error verifying session:", error);
      }
    };

    // Execute function and prevent race conditions
    verifySessionId();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4 py-8 bg-white rounded-2xl shadow-lg drop-shadow-md mx-4">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Booking Successful!</h2>
          <div className="mt-4 space-y-3">
            <p className="text-gray-700">Your Ruqyah session has been confirmed.</p>
            <p className="text-gray-700">You will receive a confirmation email with all the details shortly.</p>
            <div className="mt-6 p-4 bg-green-50 rounded-lg text-left">
              <h3 className="font-medium text-green-800">Important Notes:</h3>
              <ul className="mt-2 text-sm text-green-700 list-disc text-left list-inside">
                <li>Please arrive 5 minutes before your scheduled time</li>
                <li>Ensure you have a stable internet connection</li>
                <li>Have your questions ready if any</li>
              </ul>
            </div>
            <div className="flex items-center justify-center w-full">
              <DefultButton bg={true} className="rounded-lg" onClick={() => router.push("/")}>
                Go to Home
              </DefultButton>
            </div>
          </div>
        </div>
        <style jsx>{`
          .checkmark-circle {
            width: 120px;
            height: 120px;
            position: relative;
            margin: 0 auto;
            border-radius: 50%;
            border: 3px solid #4CAF50;
            animation: circle-fill 0.4s ease-in;
            background: #4CAF50;
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.2);
          }
          .checkmark {
            position: absolute;
            transform: rotate(45deg);
            left: 45px;
            top: 25px;
            height: 60px;
            width: 30px;
            border-bottom: 6px solid white;
            border-right: 6px solid white;
            animation: checkmark 0.4s ease-in-out 0.4s forwards;
            opacity: 0;
          }
          @keyframes circle-fill {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
          }
          @keyframes checkmark {
            0% { opacity: 0; transform: rotate(45deg) scale(0); }
            100% { opacity: 1; transform: rotate(45deg) scale(1); }
          }
        `}</style>
      </div>
  );
};

export default CompletePage;