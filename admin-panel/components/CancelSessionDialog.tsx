import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface CancelSessionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export function CancelSessionDialog({ isOpen, onClose, onConfirm }: CancelSessionDialogProps) {
    const [reason, setReason] = useState('')

    const handleConfirm = () => {
        onConfirm(reason)
        setReason('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Session</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel this session? Please provide a reason.
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for cancellation"
                    className="mt-4"
                />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={!reason.trim()}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

