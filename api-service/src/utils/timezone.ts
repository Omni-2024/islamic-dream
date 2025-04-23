import { format } from 'date-fns-tz';
import moment from "moment-timezone";

export const validateAndConvertTimezone = (timeZone: string): string => {
    const validTimezones = moment.tz.names();
    if (!validTimezones.includes(timeZone)) {
        throw new Error(`Invalid timezone: ${timeZone}`);
    }
    return timeZone;
};

