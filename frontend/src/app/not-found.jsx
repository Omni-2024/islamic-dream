'use client'

import { motion } from "framer-motion";
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 relative overflow-hidden"
            >
                {/* Abstract decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-RuqyaGreen/20 rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-RuqyaGreen/20  rounded-full -ml-16 -mb-16" />
                
                <div className="relative z-10">
                    <motion.div 
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-7xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-RuqyaGreen to-RuqyaDarkGreen">404</h1>
                    </motion.div>
                    
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-xl text-center mt-4 text-gray-700"
                    >
                        This page seems to be missing
                    </motion.p>
                    
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-8 mb-8"
                    >
                        <svg 
                            className="w-20 h-20 mx-auto text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M12 4a8 8 0 100 16 8 8 0 000-16z"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </svg>
                    </motion.div>
                    
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <Link href="/">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="block w-full py-3 px-6 text-center text-white bg-RuqyaGreen hover:RuqyaDarkGreen rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Return Home
                            </motion.a>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;