import emailjs from "@emailjs/browser";
import { toast } from "@/components/ui/toast";

interface EmailParams {
    name: string;
    user_email: string;
    raki_email?:string;
    raki_name?:string;
    otp?: string;
    message?: string;
    date?: string;
    reason?: string;
    heading:string;
}

const resetHeading="We received a request to reset the password for your Ruqya website. To proceed with resetting your password, please use the following 6-digit verification code:"

export const sendEmail = async (
    templateID: string,
    params: EmailParams
): Promise<boolean> => {
    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    try {
        // Convert EmailParams to Record<string, string>
        const formattedParams: Record<string, string> = Object.fromEntries(
            Object.entries(params)
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)])
        );

        const res = await emailjs.send(serviceID, templateID, formattedParams, userID);

        if (res.status === 200) {
            return true;
        }
    } catch (error) {
        toast({
            title: "Email failed",
            description: "Failed to send message. Please try again later.",
        });
        console.error("EmailJS Error:", error);
    }
    return false;
};



// Send OTP Email
export const sendOtpEmail = async (user_email: string, otp: string,heading:string=resetHeading,name:string) => {
    return sendEmail(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_OTP!, {user_email, name, otp,heading });
};

// Send Verification Email
// export const sendVerificationEmail = async (email: string, name: string,heading:string) => {
//     return sendEmail(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VERIFICATION!, {
//         email,
//         name,
//         message: `Dear ${name}, please verify your email to activate your account.`,
//         heading
//     });
// };

export const sendMeetingEmail = async (
    user_email: string,
    raki_email: string,
    name:string,
    raki_name:string,
    date: string,
    message: string,
    heading:string,
) => {
    return sendEmail(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_MEETING!, {
        user_email,
        raki_email,
        name,
        raki_name,
        date,
        message,
        heading
    });
};

// Send Class Cancellation Email
// export const sendClassCancellationEmail = async (email: string, reason: string,heading:string) => {
//     return sendEmail(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CANCEL!, {
//         email,
//         reason,
//         message: `Your class has been canceled due to ${reason}.`,
//         heading
//     });
// };
