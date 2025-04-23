'use client'

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {UserTag} from "iconsax-react";
import {useAuth} from "@/contexts/AuthContexts";

export interface IMeeting {
  id: string;
  meetingId: string;
  topic: string;
  date: Date;
  rakiId: string;
  userId: string;
  notificationSend: boolean;
  status: MeetingStatus;
  rakiName:string;
  userName:string;
  note: string;
}

export enum MeetingStatus {
  SCHEDULED = 'scheduled',
  RESCHEDULED = 'rescheduled',
  CANCELLED = 'cancelled',
  PENDING='pending'
}

export const SessionList = ({ sessions }: { sessions: IMeeting[] }) => {
  const { user: currentUser } = useAuth();


  const formatSessionDate = (dateString: Date) => {
    const date = new Date(dateString);


    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const time = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const formattedTime = time.replace(":", ".").replace(" ", "");

    return `${year} | ${month} ${day} | ${formattedTime}`;
  };

  const goToMeeting = (meetingId: string) => {
    console.log("this",meetingId)
    if (!meetingId || !currentUser?._id  ) return;
    const url = `/admin/meeting/${meetingId}/${currentUser?._id}`;
    window.open(url, "_blank");
  };



  return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">

        {sessions.map((session) => (
            <Card
                key={session.id}
                onClick={() => goToMeeting(session.meetingId)}
                className={cn(
                    "flex m-3 flex-col h-full w-full min-w-[18rem] max-w-[22rem] cursor-pointer select-none space-y-2 overflow-hidden rounded-3xl p-4 transition-colors duration-300 ease-in-out hover:border-primary-200 hover:bg-primary-50/60 active:border-primary-300 "
                )}
            >
              <img
                  alt="cover"
                  src={"/images/makka.png"}
                  className={cn("h-44 w-full rounded-2xl object-cover")}
              />

              <div
                  className={cn("flex items-center gap-2.5 text-sm font-semibold")}
              >
            <span className={cn("flex items-center gap-2")}>
              <UserTag size="32" color="#0C8281" variant="Bold"/>
              {session?.rakiName}
            </span>
              </div>

              <div className={cn("space-y-1")}>
                <CardTitle
                    className={cn("line-clamp-2 text-base leading-tight lg:text-lg")}
                >
                  {session
                      ? session?.topic
                      : "Vivamus ex augue tempus id diam at, dictum cursus metus"}
                </CardTitle>
              </div>

              <CardDescription className={cn("line-clamp-3")}>
                {session
                    ? session?.userName
                    : "Praesent non orci eu augue egestas lobortis. Fusce dapibus, urna non dignissim ultrices, libero dolor porta tellus, eget tincidunt mi."}
              </CardDescription>

              <CardDescription
                  className={cn("!mt-auto flex items-center gap-2 ")}
              >
                {/*<Calendar size="25" color="#0C8281" variant="Bold"/>*/}
                {session ? formatSessionDate(session?.date) : ""}

                {/*<StudentCountLabel count={Number(course?.enrollmentCount)} />*/}
              </CardDescription>
            </Card>
        ))}
      </div>
  );
};
