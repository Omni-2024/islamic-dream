import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { getNameById } from '@/lib/utils';
import {Card,CardContent, CardTitle,CardHeader} from "@/components/ui/card";
import {UserDto} from "@/contexts/AuthContexts";

interface Session {
    meetingId: string;
    topic: string;
    date: Date;
    rakiId: string;
    userId: string;
    notificationSend: boolean;
    status:MeetingStatus
}

export enum MeetingStatus {
    SCHEDULED = 'scheduled',
    RESCHEDULED = 'rescheduled',
    CANCELLED = 'cancelled',
    PENDING='pending'
}

interface SessionTableProps {
    sessions: Session[];
    userData: UserDto[];
    rakiData: UserDto[];
    setCancelSessionId: (id: string | null) => void;
    setRescheduleSessionId: (id: string | null) => void;
    setSessionRakiId: (id: string | null) => void;
    isSuperAdmin:boolean
}

const SessionTable = ({ sessions, userData, rakiData, setCancelSessionId, setRescheduleSessionId,setSessionRakiId,isSuperAdmin }: SessionTableProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sessions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[25%]">Topic</TableHead>
                                <TableHead className="w-[20%]">Raki ID</TableHead>
                                <TableHead className="w-[20%]">User ID</TableHead>
                                <TableHead className="w-[15%]">Time</TableHead>
                                <TableHead className="w-[20%]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session) => (
                                <TableRow key={session.meetingId}>
                                    <TableCell className="font-medium">{session.topic}</TableCell>
                                    <TableCell>{getNameById(session.rakiId, rakiData, '_id', 'name')}</TableCell>
                                    <TableCell>{getNameById(session.userId, userData, '_id', 'name')}</TableCell>
                                    <TableCell>{format(new Date(session.date), 'hh:mm a')}</TableCell>
                                    <TableCell>
                                        {session.status !== MeetingStatus.CANCELLED ? (
                                            <>
                                                {isSuperAdmin && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="mr-2"
                                                        onClick={() => setCancelSessionId(session.meetingId)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setRescheduleSessionId(session.meetingId)
                                                        setSessionRakiId(session.rakiId)
                                                    }
                                                }
                                                >
                                                    Reschedule
                                                </Button>
                                            </>
                                        ) : (
                                            <p>This Meeting is cancelled</p>
                                        )}

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default SessionTable;
