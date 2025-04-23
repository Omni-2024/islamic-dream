import { motion } from "framer-motion";

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-full m-10">
      <div className="flex items-center justify-center">
        <div className="spinner rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281]" />
      </div>
      <div className="pl-3 text-center">
        <h3 className="text-xl text-primary-200 font-semibold mt-4">
          Loading
          <span className="loading-dot inline-block mx-1">.</span>
          <span className="loading-dot inline-block mx-1">.</span>
          <span className="loading-dot inline-block mx-1">.</span>
        </h3>
      </div>
    </div>
  );
}

export default LoadingSpinner;
