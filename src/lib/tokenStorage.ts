// lib/tokenStorage.ts
/**
 * Universal token storage utility
 * Saves to all storage methods and retrieves from first available
 * Priority: Cookies -> SessionStorage -> LocalStorage
 */

const TOKEN_KEY = 'wbbAuthToken'

export const tokenStorage = {
    /**
     * Save token to all available storage methods
     */
    setToken: (token: string): void => {
        try {
            // Save to localStorage
            if (typeof window !== 'undefined' && window.localStorage) {
                try {
                    localStorage.setItem(TOKEN_KEY, token)
                } catch (error) {
                    console.warn('Failed to save token to localStorage:', error)
                }
            }

            // Save to sessionStorage
            if (typeof window !== 'undefined' && window.sessionStorage) {
                try {
                    sessionStorage.setItem(TOKEN_KEY, token)
                } catch (error) {
                    console.warn('Failed to save token to sessionStorage:', error)
                }
            }

            // Save to cookies
            if (typeof document !== 'undefined') {
                try {
                    const oneDay = 24 * 60 * 60 * 1000
                    const expiryDate = new Date(Date.now() + oneDay).toUTCString()
                    document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; expires=${expiryDate}; path=/; SameSite=Lax`
                } catch (error) {
                    console.warn('Failed to save token to cookies:', error)
                }
            }
        } catch (error) {
            console.error('Error saving token:', error)
        }
    },

    /**
     * Retrieve token from any available storage
     * Priority: Cookies -> SessionStorage -> LocalStorage
     */
    getToken: (): string | null => {
        try {
            // Check cookies first
            if (typeof document !== 'undefined') {
                const cookieValue = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith(`${TOKEN_KEY}=`))
                    ?.split('=')[1]

                if (cookieValue) {
                    const decodedToken = decodeURIComponent(cookieValue)
                    console.log('Token retrieved from cookies')
                    return decodedToken
                }
            }

            // Check sessionStorage second
            if (typeof window !== 'undefined' && window.sessionStorage) {
                const sessionToken = sessionStorage.getItem(TOKEN_KEY)
                if (sessionToken) {
                    console.log('Token retrieved from sessionStorage')
                    return sessionToken
                }
            }

            // Check localStorage last
            if (typeof window !== 'undefined' && window.localStorage) {
                const localToken = localStorage.getItem(TOKEN_KEY)
                if (localToken) {
                    console.log('Token retrieved from localStorage')
                    return localToken
                }
            }

            return null
        } catch (error) {
            console.error('Error retrieving token:', error)
            return null
        }
    },

    /**
     * Delete token from all storage methods
     */
    deleteToken: (): void => {
        try {
            // Delete from localStorage
            if (typeof window !== 'undefined' && window.localStorage) {
                try {
                    localStorage.removeItem(TOKEN_KEY)
                } catch (error) {
                    console.warn('Failed to delete token from localStorage:', error)
                }
            }

            // Delete from sessionStorage
            if (typeof window !== 'undefined' && window.sessionStorage) {
                try {
                    sessionStorage.removeItem(TOKEN_KEY)
                } catch (error) {
                    console.warn('Failed to delete token from sessionStorage:', error)
                }
            }

            // Delete from cookies
            if (typeof document !== 'undefined') {
                try {
                    document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
                } catch (error) {
                    console.warn('Failed to delete token from cookies:', error)
                }
            }
        } catch (error) {
            console.error('Error deleting token:', error)
        }
    },

    /**
     * Check if token exists in any storage
     */
    hasToken: (): boolean => {
        return tokenStorage.getToken() !== null
    },

    /**
     * Get token and save to all storage methods (ensures sync)
     */
    syncToken: (token: string | null): void => {
        if (token) {
            tokenStorage.setToken(token)
        } else {
            tokenStorage.deleteToken()
        }
    }
}