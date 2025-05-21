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
    <div className="min-h-screen  flex items-center justify-center p-10">
      <div className={`w-full max-w-xl transition-all duration-700 `}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with wave pattern */}
          <div className="relative bg-RuqyaGreen h-32 flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <svg viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,0 L0,0 Z" fill="white"></path>
              </svg>
            </div>
            <div className="z-10 bg-white rounded-full p-4 shadow-lg">
              <div className="w-16 h-16 rounded-full bg-RuqyaGreen flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-RuqyaGray text-center">Booking Confirmed!</h2>
            <p className="mt-2 text-center text-gray-600">Your Islamic Dreams session has been scheduled successfully</p>
            
            {/* Email notification */}
            <div className="mt-6 flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <p className="ml-3 text-sm text-blue-700 ">A confirmation email with all details has been sent to your inbox</p>
            </div>
            
            {/* Instructions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-medium text-RuqyaGray text-sm ">Preparation Instructions:</h3>
              <ul className="mt-2 space-y-2">
                {['Join 5 minutes early', 'Ensure stable internet connection', 'Prepare your questions', 'Find a quiet space'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-4 h-4 text-RuqyaGreen mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="ml-2 text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className= "justify-center mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-center">
              <button 
                onClick={() => router.push("/")}
                className="flex-1 py-3 px-4 max-w-fit bg-RuqyaGreen text-white font-medium rounded-lg shadow hover:bg-RuqyaDarkGreen transition duration-200 flex items-center justify-center"
              >
                Return to Home
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
             
            </div>
          </div>
        </div>
        
        {/* Footer note */}
        <div className="text-center mt-4 text-xs text-gray-500">
          Need help? Contact our support team at support@islamicdreams.com
        </div>
      </div>
    </div>
  );
};

export default CompletePage;