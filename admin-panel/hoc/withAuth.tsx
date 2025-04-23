"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContexts"
import { motion } from "framer-motion"

const withAuth = (WrappedComponent: React.FC, allowedRoles: string[]) => {
    return (props: any) => {
        const { user, isLoading } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!isLoading) {
                const token = localStorage.getItem("token")

                if (!token || !user) {
                    router.push("/")
                    return
                }

                if (!allowedRoles.includes(user.role)) {
                    router.push("/unauthorized")
                }
            }
        }, [user, isLoading, router])

        if (isLoading) {
            return (
                <div className="w-full h-full  flex flex-col items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281]"
                    />
                </div>
            )
        }

        if (!user || !allowedRoles.includes(user.role)) {
            return null
        }

        return <WrappedComponent {...props} />
    }
}

export default withAuth