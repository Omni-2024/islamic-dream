import axios from "axios";
import { getUserTimeZone } from "@/lib/utils";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const apiSignup = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Attach token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fe-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const userTimeZone = getUserTimeZone();

// Authentication
export const login = async (email, password) => {
  const response = await api.post("ruqya-api/auth/login", { email, password });
  if (response.data.isEmailVerified){
      localStorage.setItem("fe-token", response.data.token);
  }
  else {
      sessionStorage.setItem("fe-token", response.data.token);

  }
  return response.data;
};

export const signup = async (email, name, password) => {
  const response = await apiSignup.post("ruqya-api/auth/register", { email, name, password });
  sessionStorage.setItem("fe-token", response.data.token);
  return response.data;
};

export const googleSignup = async (tokenId) => {
  try {
    const response = await apiSignup.post("ruqya-api/auth/social", { tokenId });
    if (response.data && response.data.token) {
      localStorage.setItem("fe-token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const checkoutSession = async (topic,date,rakiId,rakiEmail,rakiName,userEmail,userName) => {
    try {
        const response = await api.post("ruqya-api/stripe/create-checkout-session", { topic,date,rakiId,timeZone:userTimeZone,rakiEmail,rakiName,userEmail,userName });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifySession = async (sessionId) => {
    try {
        const response = await api.post(`ruqya-api/stripe/verify-session?session_id=${sessionId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const handleApiError = (error) => {
  const token = localStorage.getItem("token");
  if (error.response && error.response.status === 401 && token) {
    localStorage.removeItem("token");
    const pathname = window.location.pathname;
    if (pathname !== "/" && pathname !== "/BookRaqis" && pathname !== "/SelfRuqyah" && pathname !== "/signup" && pathname !== "/login" && !raqiRegex.test(pathname)) {
      router.push("/login");
    }
    return Promise.reject(error);
  }
  return Promise.reject(error);
};

api.interceptors.response.use(
  (response) => response,
  handleApiError
);

// User Profile
export const getUserProfile = async (id) => (await api.get(`ruqya-api/user/${id}`)).data;

export const getUserProfileWithEmail = async (email) => (await api.get(`ruqya-api/user/email/${email}`));

export const getOwnProfile = async () => (await api.get("ruqya-api/user/user-profile")).data;

export const getMyBookings = async () => (await api.get(`ruqya-api/meeting/get-meetings/user/?timeZone=${userTimeZone}`)).data;

export const updateUserProfile = async (profileData) => (await api.post("ruqya-api/user/update", profileData)).data;

export const updateUserEmailVerification = async (email,isEmailVerified) => (await api.post("ruqya-api/user/update-emailVerification", {email,isEmailVerified})).data;

export const changePassword = async (currentPassword, newPassword) =>
  (
    await api.post("ruqya-api/user/change-password", {
      currentPassword,
      newPassword,
    })
  ).data;

export const resetPassword = async (
    email,
    newPassword
) =>
    (
        await api.post("ruqya-api/user/reset-password", {
            email,
            newPassword,
        })
    ).data;

export const getUsers = async () => (await api.get("ruqya-api/user/users")).data;

// User Role & Status Management
export const updateUserRole = async (userId, newRole) => (await api.post("ruqya-api/user/update-role", { userId, role: newRole })).data;

export const updateUserStatus = async (userId, status) => (await api.post("ruqya-api/user/update-status", { userId, status })).data;

// Raki Management
export const getRakis = async () => (await api.get("ruqya-api/raki/rakis")).data;

export const getRakisIdByDate = async (date) =>
  (
    await api.get("ruqya-api/raki/get-rakis-date", {
      params: { date, timeZone: userTimeZone },
    })
  ).data;

// Sessions & Meetings
export const getTodaySessions = async () => (await api.get(`ruqya-api/meeting/get-today-meetings/?timeZone=${userTimeZone}`)).data;

export const cancelSession = async (meetingId, note) => (await api.post("ruqya-api/meeting/cancel", { meetingId, note })).data;

export const deleteSession = async (rakiId, date) => (await api.post("ruqya-api/meeting/delete", { rakiId, date,timeZone:userTimeZone })).data;

export const rescheduleSession = async (meetingId, newDate) => (await api.post("ruqya-api/meeting/reschedule", { meetingId, newDate })).data;

export const addSession = async (topic,date,rakiId) => (await api.post("ruqya-api/meeting/add-meetings", {topic,date,rakiId,timeZone:userTimeZone })).data;

// Reviews
export const getReviews = async (rakiId) => (await api.get(`ruqya-api/review/get-review/${rakiId}`)).data;

export const addReviews = async (rakiId, meetingId, points, comment) => (await api.post(`ruqya-api/review/add-review`, { rakiId, meetingId, points, comment })).data;

// Revenue & Statistics
export const getRevenueData = async (filter) =>
  (
    await api.get("ruqya-api/meeting/get-meeting-statistics", {
      params: { ...filter, timeZone: userTimeZone },
    })
  ).data;

// Availability Management
export const getRakiAvailability = async (rakiId, date) =>
  (
    await api.get("ruqya-api/raki/get-availability", {
      params: { rakiId, date, timeZone: userTimeZone },
    })
  ).data.timeSlots;

export const setRakiAvailability = async (date, timeSlots) =>
  (
    await api.post("ruqya-api/raki/set-availability", {
      date,
      timeSlots,
      timeZone: userTimeZone,
    })
  ).data;

export const removeRakiAvailability = async (date, startTime) =>
  (
    await api.post("ruqya-api/raki/remove-availability", {
      date,
      startTime,
      timeZone: userTimeZone,
    })
  ).data;

export const updateAvailability = async (date,rakiId,isAvailable) =>
    (
        await api.post("ruqya-api/raki/update-availability", {
            date,
            timeZone: userTimeZone,
            rakiId,
            isAvailable
        })
    ).data;

// Meeting Verification & Streaming
export const verifyMeetingAccess = async (callId, userId) => {
  try {
    const response = await api.get(`ruqya-api/get-stream/getCallDetails/${callId}`);
    const members = response.data.callDetails?.members ?? [];
    const user = members.find((member) => member.user_id === userId);

    if (!user) throw new Error("Unauthorized");

    return { role: user.role || "member", authorized: true, name: user.name };
  } catch (error) {
    throw new Error("Meeting verification failed");
  }
};

export const getStreamToken = async (userId, role) => (await api.post("ruqya-api/get-stream/getCallToken", { userId, role })).data.token;

export const getStreamChatToken = async (userId) => (await api.post("ruqya-api/get-stream/getuserToken", { userId })).data.token;

export default api;
