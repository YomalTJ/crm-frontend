'use client';

import { ToastContainer } from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const { toasts, removeToast } = useToast();

    return (
        <>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
};