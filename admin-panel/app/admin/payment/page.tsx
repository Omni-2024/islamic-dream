"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, Calendar, Clock, Filter, X } from "lucide-react";
import {useAuth, UserDto} from "@/contexts/AuthContexts";
import {getMeetings, getMeetingsByRakiId, getRakis, MeetingStatus, requestPayment, updatePayment} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import withAuth from "@/hoc/withAuth";
import {IMeeting} from "@/components/SessionList";
import {motion} from "framer-motion";

interface Meeting {
  _id: string;
  meetingId: string;
  topic: string;
  date: string;
  rakiId: string;
  userId: string;
  notificationSend: boolean;
  isPaid: boolean;
  requestedAt: string | null;
  rakiName?:string
}

interface PaymentManagementPageProps {
  isAdmin?: boolean;
  currentUserId?: string;
}

const PaymentManagementPage: React.FC<PaymentManagementPageProps> = () => {
  const { user: currentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [meetings, setMeeting] = useState<Meeting[]>();
  const [loading, setLoading] = useState(true);


  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const meetingData =
            currentUser?.role === "super-admin"
                ? await getMeetings()
                : await getMeetingsByRakiId();

        const rakiData = await getRakis();

        // Map Raki names to meetings
        const mergedMeetings = meetingData.map((meeting:Meeting) => {
          const raki = rakiData.find((r:UserDto) => r._id === meeting.rakiId);
          return {
            ...meeting,
            rakiName: raki ? raki.name : "Unknown Raki",
          };
        });

        setMeeting(mergedMeetings.filter((meeting:IMeeting) => meeting.status !== MeetingStatus.CANCELLED));

      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch meeting or rakis data. Please try again.",
          variant: "destructive",
        });
      }
      finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMeeting();
    }
  }, [currentUser]);


  const handlePaymentRequest = async (meetingId: string) => {
    try {
      await requestPayment(meetingId);

      setMeeting((prevMeetings) =>
          prevMeetings?.map((meeting) =>
              meeting._id === meetingId ? { ...meeting, requestedAt: new Date().toISOString() } : meeting
          )
      );

      toast({ title: "Success", description: "Payment request sent successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to request payment.", variant: "destructive" });
    }
  };

  const handleMarkAsPaid = async (meetingId: string,isPaid:boolean) => {
    try {
      await updatePayment(meetingId,isPaid);

      setMeeting((prevMeetings) =>
          prevMeetings?.map((meeting) =>
              meeting._id === meetingId ? { ...meeting, isPaid } : meeting
          )
      );

      toast({ title: "Success", description: "Marked as paid successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to mark as paid.", variant: "destructive" });
    }
  };



  const filteredMeetings = useMemo(() => {
    if (!meetings) return [];
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      const monthMatch =
        !selectedMonth ||
        meetingDate
          .toLocaleString("default", { month: "long" })
          .toLowerCase() === selectedMonth.toLowerCase();
      const yearMatch =
        !selectedYear || meetingDate.getFullYear().toString() === selectedYear;
      const statusMatch =
        !paymentStatus ||
        (paymentStatus === "paid" && meeting.isPaid) ||
        (paymentStatus === "unpaid" && !meeting.isPaid) ||
        (paymentStatus === "requested" &&
          meeting.requestedAt &&
          !meeting.isPaid);
      const searchMatch =
        !searchTerm ||
        meeting.rakiName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.topic.toLowerCase().includes(searchTerm.toLowerCase());

      const userMatch = isAdmin ? meeting.rakiId === currentUser?._id : true;

      return monthMatch && yearMatch && statusMatch && searchMatch && userMatch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  }, [
    meetings,
    selectedMonth,
    selectedYear,
    paymentStatus,
    searchTerm,
    isAdmin,
    currentUser?._id,
  ]);

  const canRequestPayment = (meeting: Meeting): boolean => {
    if (!meeting.requestedAt) return true;
    const requestDate = new Date(meeting.requestedAt);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - requestDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 2;
  };

  const stats = useMemo(() => {
    const total = filteredMeetings.length;
    const paid = filteredMeetings.filter((m) => m.isPaid).length;
    const pending = filteredMeetings.filter((m) => !m.isPaid).length;
    const requested = filteredMeetings.filter(
      (m) => m.requestedAt && !m.isPaid
    ).length;
    return { total, paid, pending, requested };
  }, [filteredMeetings]);


  if (loading) return  (
      <div className="w-full h-full  flex flex-col items-center justify-center">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0C8281]"
        />
      </div>
  );



  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-primary-500 text-primary-700 hover:bg-[rgba(0,128,128,0.1)] rounded-lg p-4 transition duration-300">
            <p className="text-sm opacity-80">Total Meetings</p>
            <h3 className="text-2xl font-bold">{stats.total}</h3>
          </div>
          <div className="border border-primary-400 text-primary-700 hover:bg-[rgba(0,128,128,0.1)] rounded-lg p-4 transition duration-300">
            <p className="text-sm opacity-80">Paid</p>
            <h3 className="text-2xl font-bold">{stats.paid}</h3>
          </div>
          <div className="border border-primary-300 text-primary-700 hover:bg-[rgba(0,128,128,0.1)] rounded-lg p-4 transition duration-300">
            <p className="text-sm opacity-80">Pending</p>
            <h3 className="text-2xl font-bold">{stats.pending}</h3>
          </div>
          <div className="border border-primary-200 text-primary-700 hover:bg-[rgba(0,128,128,0.1)] rounded-lg p-4 transition duration-300">
            <p className="text-sm opacity-80">Requested</p>
            <h3 className="text-2xl font-bold">{stats.requested}</h3>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-lg mb-6">
          <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-500" />
              <input
                type="text"
                placeholder="Search by name or topic..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-500 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="p-4 border-t border-border bg-primary-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="h-10 rounded-lg border border-input bg-background px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Months</option>
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month) => (
                    <option key={month} value={month.toLowerCase()}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="h-10 rounded-lg border border-input bg-background px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Years</option>
                  {["2024", "2025"].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="h-10 rounded-lg border border-input bg-background px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  {isAdmin && <option value="requested">Requested</option>}
                </select>
              </div>

              {(selectedMonth || selectedYear || paymentStatus) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedMonth && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {selectedMonth}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedMonth("")}
                      />
                    </span>
                  )}
                  {selectedYear && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {selectedYear}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedYear("")}
                      />
                    </span>
                  )}
                  {paymentStatus && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {paymentStatus}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setPaymentStatus("")}
                      />
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting._id}
              className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border overflow-hidden"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-lg text-foreground">
                    {meeting.topic}
                  </h3>
                  {meeting.isPaid ? (
                    <span className="px-2 py-1 bg-[#80EF80] text-black rounded-md text-sm">
                      Paid
                    </span>
                  ) : meeting.requestedAt ? (
                    <span className="px-2 py-1 bg-[#FFC067] text-black rounded-md text-sm">
                      Requested
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-[#FFEE8C] text-black rounded-md text-sm">
                      Pending
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  </div>
                  {!isAdmin && (
                    <div className="text-sm font-bold text-muted-foreground">
                      {meeting.rakiName}
                    </div>
                  )}
                </div>

                {isAdmin && !meeting.isPaid ? (
                    canRequestPayment(meeting) ? (
                        <button
                            className="w-full px-4 py-2 mt-3 bg-primary-500 text-primary-25 rounded-md hover:bg-primary-300 transition"
                            onClick={() => handlePaymentRequest(meeting._id)}
                        >
                          Request Payment
                        </button>
                    ) : (
                        <div className="text-sm text-muted-foreground mt-2 flex items-center justify-start gap-2">
                          <Clock className="h-4 w-4" />
                          <p className="mt-1"> Wait 2 days before requesting again</p>
                        </div>
                    )
                ) : null}



                {!isAdmin && (
                  <div className="mt-4">
                    {meeting.isPaid ? (
                      <button
                        className="w-full px-4 py-2  border border-primary-500 bg-primary-600   rounded-md hover:bg-300 hover:text-white text-white transition"
                        onClick={() => handleMarkAsPaid(meeting._id,false)}
                      >
                        Mark as unpaid
                      </button>
                    ) : (
                            <button
                                className="w-full px-4 py-2  border border-primary-500 bg-[rgba(0,128,128,0.1)] text-primary-700 rounded-md hover:bg-primary-300 hover:text-white transition"
                                onClick={() => handleMarkAsPaid(meeting._id,true)}
                            >
                              Mark as paid
                            </button>
                        )
                    }
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMeetings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No meetings found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(PaymentManagementPage, ["admin","super-admin"]);
