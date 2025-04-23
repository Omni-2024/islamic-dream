'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LogoutConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
}

export function LogoutConfirmDialog({ isOpen, onClose }: LogoutConfirmDialogProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        localStorage.removeItem("token")
        setIsLoggingOut(true)
        setIsLoggingOut(false)
        onClose()
        router.push('/')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to log out?</DialogTitle>
                    <DialogDescription>
                        You will be redirected to the sign-in page.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleLogout} disabled={isLoggingOut}>
                        {isLoggingOut ? "Logging out..." : "Log out"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

