'use client';

import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

export type PaymentStatus = 'idle' | 'success' | 'error' | 'cancelled';

interface PaymentStatusModalProps {
    isOpen: boolean;
    status: PaymentStatus;
    message?: string;
    onClose: () => void;
}

export function PaymentStatusModal({ isOpen, status, message, onClose }: PaymentStatusModalProps) {
    if (!isOpen || status === 'idle') return null;

    let icon;
    let title;
    let defaultMessage;
    let iconBgColor;
    let iconColor;

    switch (status) {
        case 'success':
            icon = <Check className="w-6 h-6" />;
            title = 'Payment Successful';
            defaultMessage = 'Your payment has been processed successfully. Your plan has been upgraded.';
            iconBgColor = 'bg-green-500/10';
            iconColor = 'text-green-500';
            break;
        case 'error':
            icon = <AlertTriangle className="w-6 h-6" />;
            title = 'Payment Failed';
            defaultMessage = 'There was an issue processing your payment. Please try again.';
            iconBgColor = 'bg-red-500/10';
            iconColor = 'text-red-500';
            break;
        case 'cancelled':
            icon = <X className="w-6 h-6" />;
            title = 'Payment Cancelled';
            defaultMessage = 'You cancelled the payment process.';
            iconBgColor = 'bg-yellow-500/10';
            iconColor = 'text-yellow-500';
            break;
        default:
            return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[151] w-full max-w-sm p-4">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center ${iconColor}`}>
                            {icon}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {message || defaultMessage}
                    </p>

                    {/* Button */}
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
