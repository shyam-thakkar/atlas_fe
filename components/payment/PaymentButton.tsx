'use client';

import React from 'react';
import { PaymentStatusModal } from './PaymentStatusModal';
import { useRazorpay } from '@/hooks/useRazorpay';
import { Loader2, Zap } from 'lucide-react';

interface PaymentButtonProps {
    planType: string;
    className?: string;
    children?: React.ReactNode;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({ planType, className, children }) => {
    const { initiatePayment, isLoading, paymentStatus, paymentMessage, resetStatus } = useRazorpay();

    const handleClick = () => {
        initiatePayment(planType);
    };

    return (
        <>
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Zap className="w-4 h-4" />
                )}
                {children || 'Upgrade Plan'}
            </button>

            <PaymentStatusModal
                isOpen={paymentStatus !== 'idle'}
                status={paymentStatus}
                message={paymentMessage}
                onClose={resetStatus}
            />
        </>
    );
};
