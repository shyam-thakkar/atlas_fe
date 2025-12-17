import { useState, useEffect, useRef, useCallback } from 'react';
import { profile } from '@/lib/profile';
import { PipelineStatus, PipelineStatusEnum } from '@/types/portfolio';

export function useResumePolling() {
    const [state, setState] = useState<PipelineStatus>({
        status: 'idle', // Default initial (no resume)
        message: 'Initializing...',
        progress: 0,
        can_review: false,
        can_publish: false,
        missing_items: []
    });

    const [isFailed, setIsFailed] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    const poll = useCallback(async () => {
        if (!isMountedRef.current) return;

        try {
            const result = await profile.getStatus();

            if (!isMountedRef.current) return;

            setState(result);

            if (result.status === 'failed') {
                setIsFailed(true);
                return;
            }

            if (result.status === 'completed') {
                return;
            }

            // Schedule next poll
            schedulePoll();

        } catch (error: any) {
            console.error("Polling error:", error);

            if (isMountedRef.current) {
                // If 404, it means no resume exists -> IDLE state (allow upload)
                if (error.status === 404) {
                    setState({
                        status: 'idle',
                        message: 'Ready for upload',
                        progress: 0,
                        can_review: false,
                        can_publish: false,
                        missing_items: []
                    });
                } else {
                    schedulePoll();
                }
            }
        }
    }, []);

    const schedulePoll = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(poll, 1500);
    }, [poll]);

    const reset = useCallback((optimisticStatus?: PipelineStatusEnum) => {
        setIsFailed(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (optimisticStatus) {
            setState(prev => ({
                ...prev,
                status: optimisticStatus,
                message: 'Processing...',
                progress: 5
            }));
        }

        poll();
    }, [poll]);

    useEffect(() => {
        isMountedRef.current = true;
        poll();
        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [poll]);

    return {
        ...state,
        isFailed,
        retry: () => reset(), // Alias for backward compatibility / simple retry
        reset, // Expose reset for optimistic updates
        refresh: poll
    };
}
