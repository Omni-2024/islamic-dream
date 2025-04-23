export const  getStreamAdminRole = (user: { role: string }) => {
    if (user.role === "admin") {
        return "raki";
    } else if (user.role === "super-admin") {
        return "admin";
    } else {
        return "user";
    }
};
