export const calculateWorkDuration = (startDateStr: string, endDateStr?: string | null): string => {
    if (!startDateStr) return '';
    
    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : new Date();
    
    if (isNaN(start.getTime())) return '';

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }

    const yearPart = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
    const monthPart = months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';
    
    return [yearPart, monthPart].filter(Boolean).join(' ') || 'Just started';
};

export const formatDateLabel = (dateStr?: string | null): string => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Present';
    
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

/**
 * Sorts items by date in descending order (Newest first).
 * Prioritizes items with no end date (Present).
 */
export const sortRecentFirst = <T extends { startDate?: string; endDate?: string }>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
        // 1. Prioritize 'Present' (no endDate)
        if (!a.endDate && b.endDate) return -1;
        if (a.endDate && !b.endDate) return 1;
        
        // 2. If both are Present or both have end dates, sort by startDate
        const dateA = new Date(a.startDate || '');
        const dateB = new Date(b.startDate || '');
        return dateB.getTime() - dateA.getTime();
    });
};

/**
 * Extracts the end year from a range string (e.g., "2021 – 2026")
 */
export const extractEndYear = (rangeStr: string): number => {
    const years = rangeStr.match(/\d{4}/g);
    if (!years || years.length === 0) return 0;
    return Math.max(...years.map(Number));
};
