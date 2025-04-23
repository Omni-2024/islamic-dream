'use client'

import { motion } from "framer-motion";
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <h1 className="text-8xl font-bold text-[#0C8281]">404</h1>
                <p className="text-2xl mt-4">Oops! Page not found.</p>
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ yoyo: Infinity, duration: 1 }}
                    className="mt-6"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#0C8281"
                        className="w-16 h-16 mx-auto"
                    >
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z" />
                    </svg>
                </motion.div>
                <Link href="/">
                    <motion.a
                        whileHover={{ scale: 1.1 }}
                        className="mt-6 inline-block px-6 py-3 text-white bg-[#0C8281] rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        Go Home
                    </motion.a>
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;

