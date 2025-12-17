import { useState, useEffect, useRef, useCallback } from 'react';
import { profile } from '@/lib/profile';
import { PipelineStatus } from '@/types/portfolio';

export function useResumePolling() {
    const [state, setState] = useState<PipelineStatus>({
        status: 'uploaded', // Default initial
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

            // Determine if we should stop polling
            // We stop if it's 'completed' (fully done) or 'failed'.
            // However, user said "Poll every 1.5s during processing". 
            // 'review_required' is a "halt" state waiting for user action, but maybe we still poll? 
            // Usually if action is required, status won't change until action is taken.
            // But let's keep polling lightly or stop. 
            // The prompt says "Poll every ~1.5s during processing."
            // 'uploaded', 'extracting', 'analyzing' are definitely processing.
            // 'review_required' implies processing paused.
            // 'completed' implies done.
            // 'failed' implies stop.

            if (result.status === 'failed') {
                setIsFailed(true);
                return;
            }

            if (result.status === 'completed') {
                // Done.
                return;
            }

            // Schedule next poll
            schedulePoll();

        } catch (error) {
            console.error("Polling error:", error);
            // On error, maybe retry a bit?
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
        poll();
        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [poll]);

    return {
        ...state,
        isFailed,
        retry: () => {
            setIsFailed(false);
            poll();
        },
        refresh: poll // Allow manual refresh
    };
}
