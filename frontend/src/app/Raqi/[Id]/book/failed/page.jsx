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
  <div className="min-h-screen flex items-center justify-center p-10">
    <div className={`w-full max-w-xl transition-all duration-700`}>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with wave pattern */}
        <div className="relative bg-red-500 h-32 flex items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <svg viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,0 L0,0 Z" fill="white"></path>
            </svg>
          </div>
          <div className="z-10 bg-white rounded-full p-4 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="px-6 py-8">
          <h2 className="text-2xl font-fullsansbold text-gray-800 text-center">Booking Failed!</h2>
          <p className="mt-2 text-center text-gray-600">We couldn't process your Ruqyah session booking</p>
          
          {/* Error notification */}
          <div className="mt-6 flex items-center p-4 bg-red-50 rounded-lg">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="ml-3 text-sm text-red-700">There was a problem processing your booking request</p>
          </div>
          
          {/* Possible causes */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium text-gray-800 text-sm font-fullsans">Possible Reasons:</h3>
            <ul className="mt-2 space-y-2">
              {[
                'Selected time slot might no longer be available',
                'Network connection issues',
                'Server temporarily unavailable',
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-4 h-4 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What to do */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium text-gray-800 text-sm font-fullsans">What You Can Do:</h3>
            <ul className="mt-2 space-y-2">
              {[
                'Try booking again in a few minutes',
                'Select a different time slot',
                'Check your internet connection',
                'Contact our support team'
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
                className="flex-1 py-3 px-4 max-w-fit bg-RuqyaGreen text-white font-medium rounded-lg shadow hover:bg-RuqyaLightGreen transition duration-200 flex items-center justify-center"
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
        Need help? Contact our support team at support@ruqyah.com
      </div>
    </div>
  </div>
);
};

export default FailedPage;
