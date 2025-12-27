import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return '';
    return format(new Date(date), formatStr);
};

export const formatDateTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatTimeAgo = (date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isOverdue = (date) => {
    if (!date) return false;
    return isPast(new Date(date));
};

export const parseDate = (dateString) => {
    if (!dateString) return null;
    return parseISO(dateString);
};
