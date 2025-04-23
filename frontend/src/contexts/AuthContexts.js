'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {getOwnProfile} from "@/lib/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()
    const raqiRegex = /^\/Raqi\/[a-f0-9]{24}$/;
    
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const userData = await getOwnProfile()
                if (userData) {
                    setUser(userData)
                } else {
                    // Clear any potential data in localStorage when no user data
                    localStorage.clear()
                    if (pathname !== "/" && pathname !== "/BookRaqis" && pathname !== "/SelfRuqyah" && pathname !== "/signup" && pathname !== "/AboutUs" && pathname !== "/login" && !raqiRegex.test(pathname)) {
                        router.push("/login");
                      }
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error)
                // Clear localStorage on error too
                localStorage.clear()
                if (pathname !== "/" && pathname !== "/BookRaqis" && pathname !== "/SelfRuqyah" && pathname !== "/signup" && pathname !== "/AboutUs" && pathname !== "/login" && !raqiRegex.test(pathname)) {
                    router.push("/login");
                  }
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const login = async (token) => {
        try {
            const userData = await getOwnProfile()
            if (userData) {
                setUser(userData)
                router.push('/admin')
            } else {
                localStorage.clear()
                throw new Error('No user data returned after login')
            }
        } catch (error) {
            console.error('Login failed:', error)
            localStorage.clear()
            throw error
        }
    }

    const logout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            setUser(null)
            router.push('/')
        } catch (error) {
            console.error('Logout failed:', error)
            throw error
        }
    }
    

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
