'use client'

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useToast = () => {
    const [toasts, setToasts] = useState<Array<{
        id: string;
        message: string;
        type: 'success' | 'error' | 'info';
    }>>([]);

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = uuidv4();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return { toasts, addToast, removeToast };
};