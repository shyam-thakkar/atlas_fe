import { useState, useEffect, useRef, useCallback } from 'react';
import { apiGetWithETag } from '@/lib/api';

type ResumeStatus = 'uploaded' | 'extracting' | 'extracted' | 'analyzing' | 'generated' | 'failed';

interface PollingState {
    status: ResumeStatus | null;
    message: string;
    isComplete: boolean;
    isFailed: boolean;
    error: string | null;
}

const STATUS_MESSAGES: Record<string, string> = {
    uploaded: 'Resume uploaded',
    extracting: 'Extracting text from resume…',
    extracted: 'Text extracted',
    analyzing: 'Analyzing resume data…',
    generated: 'Ready to continue',
    failed: 'Processing failed',
};

export function useResumePolling() {
    const [state, setState] = useState<PollingState>({
        status: null,
        message: 'Initializing...',
        isComplete: false,
        isFailed: false,
        error: null,
    });

    // Store ETag in ref to persist across renders without triggering effects
    const etagRef = useRef<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    // Helper to update state safely
    const updateState = (newStatus: ResumeStatus) => {
        const isComplete = newStatus === 'generated';
        const isFailed = newStatus === 'failed';

        setState({
            status: newStatus,
            message: STATUS_MESSAGES[newStatus] || 'Processing...',
            isComplete,
            isFailed,
            error: isFailed ? 'Processing failed' : null,
        });

        return { isComplete, isFailed };
    };

    const poll = useCallback(async () => {
        if (!isMountedRef.current) return;

        try {
            const result = await apiGetWithETag<{ status: ResumeStatus }>('/api/profile/resume/status/', etagRef.current);

            if (!isMountedRef.current) return;

            if (result.status === 304) {
                // No change, just schedule next poll
                schedulePoll();
                return;
            }

            if (result.status === 200 && result.data) {
                const newStatus = result.data.status;

                // Update ETag
                if (result.etag) {
                    etagRef.current = result.etag;
                }

                // Update UI State
                const { isComplete, isFailed } = updateState(newStatus);

                // Stop polling if complete or failed
                if (isComplete || isFailed) {
                    return;
                }
            } else {
                // Unexpected status code? Just retry.
            }

            schedulePoll();

        } catch (error) {
            console.error("Polling error:", error);
            // Don't stop polling on transient network errors immediately, 
            // but maybe we should if 404/500 persists. 
            // For now, retry safely.
            if (isMountedRef.current) {
                schedulePoll();
            }
        }
    }, []);

    const schedulePoll = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(poll, 1500);
    }, [poll]);

    useEffect(() => {
        isMountedRef.current = true;

        // Start polling immediately
        poll();

        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [poll]);

    return {
        ...state,
        retry: () => {
            // Reset state and restart polling
            setState(prev => ({ ...prev, isFailed: false, error: null, message: 'Retrying...' }));
            etagRef.current = null; // Clear ETag to force fresh fetch
            poll();
        }
    };
}
