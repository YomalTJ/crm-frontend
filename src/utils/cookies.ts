export const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null;

    // Handle cases where cookie might be encoded
    const cookieString = decodeURIComponent(document.cookie);
    const cookies = cookieString.split('; ');

    for (const cookie of cookies) {
        const [cookieName, ...cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue.join('=');
        }
    }

    return null;
};