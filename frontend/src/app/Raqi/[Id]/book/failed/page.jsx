"use client";
import {useRouter, useSearchParams} from "next/navigation";
import DefultButton from "@/components/ui/buttons/DefaultButton";
import {useEffect} from "react";
import {deleteSession, updateAvailability, verifySession} from "@/lib/api";
import {sendMeetingEmail} from "@/lib/EmailService";

const FailedPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const  deletingSession = async () => {
      const rakiId = searchParams.get('rakiId');
      const date = searchParams.get('date');
      if (rakiId && date) {
        try {
          await deleteSession(rakiId,date)
        } catch (error) {
          console.error('Error deleting session:', error);
        }
      }
    };

    deletingSession();
  }, [searchParams]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.1),0_-4px_6px_-2px_rgba(0,0,0,0.05)] p-6 md:p-8 lg:p-10 transform transition-all duration-300 hover:shadow-2xl">
        <div className="x-circle">
          <div className="x-mark"></div>
        </div>

        <h2 className="mt-8 text-3xl md:text-4xl font-bold text-gray-900 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600">
          Booking Failed
        </h2>

        <p className="mt-4 text-lg text-gray-600 text-center max-w-md mx-auto">
          We couldn't process your booking at this time. Please try again.
        </p>

        <div className="mt-8 grid gap-6">
          <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
            <h3 className="font-semibold text-red-800 text-lg mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              Possible Reasons
            </h3>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                Selected time slot might no longer be available
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                Network connection issues
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                Server temporarily unavailable
              </li>
            </ul>
          </div>

          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-gray-800 text-lg mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              What You Can Do
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                Try booking again in a few minutes
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                Select a different time slot
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                Check your internet connection
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* <DefultButton
            bg={true}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-lg"
            onClick={() => router.back()}
          >
            Try Again
          </DefultButton> */}
          <DefultButton
            bg={true}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-lg"
            onClick={() => router.push("/")}
          >
            Return to Home
          </DefultButton>
        </div>
      </div>
      <style jsx>{`
        .x-circle {
          width: 120px;
          height: 120px;
          position: relative;
          margin: 0 auto;
          border-radius: 50%;
          border: 3px solid #EF4444;
          animation: circle-fill 0.4s ease-in;
          background: #EF4444;
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);
        }
        
        .x-mark {
          position: absolute;
          left: 51%;  /* Adjusted from 50% */
          top: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
        }

        .x-mark:before,
        .x-mark:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 60px;
          background: white;
          border-radius: 4px;
        }

        .x-mark:before {
          transform: translate(-50%, -50%) rotate(45deg);
          animation: draw-x-1 0.3s ease-in-out 0.4s forwards;
        }

        .x-mark:after {
          transform: translate(-50%, -50%) rotate(-45deg);
          animation: draw-x-2 0.3s ease-in-out 0.4s forwards;
        }

        @keyframes circle-fill {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }

        @keyframes draw-x-1 {
          0% { transform: translate(-50%, -50%) rotate(45deg) scale(0); }
          100% { transform: translate(-50%, -50%) rotate(45deg) scale(1); }
        }

        @keyframes draw-x-2 {
          0% { transform: translate(-50%, -50%) rotate(-45deg) scale(0); }
          100% { transform: translate(-50%, -50%) rotate(-45deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default FailedPage;
