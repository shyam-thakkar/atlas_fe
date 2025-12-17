import React from 'react';
import { PortfolioManager } from './portfolio/PortfolioManager';

interface PortfolioReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFinish?: () => void;
}

export function PortfolioReviewModal({ isOpen, onClose, onFinish }: PortfolioReviewModalProps) {
    if (!isOpen) return null;

    const handleFinish = () => {
        onFinish?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="relative w-full max-w-[90vw]">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors flex items-center gap-2"
                >
                    <span className="text-sm font-medium">Cancel Analysis</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <PortfolioManager onFinish={handleFinish} isModal={true} />
            </div>
        </div>
    );
}
