'use client';

import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmModal({ isOpen, onConfirm, onCancel }: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[151] w-full max-w-md p-6">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-2xl p-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-center mb-2 text-gray-900 dark:text-white">
                        Delete Chat Session?
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                        This will permanently delete all messages in this conversation. This action cannot be undone.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
