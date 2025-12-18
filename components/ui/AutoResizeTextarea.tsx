import React, { useEffect, useRef, TextareaHTMLAttributes } from 'react';

// Extend standard Textarea props
interface AutoResizeTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
}

export const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
    ({ value, className, ...props }, ref) => {
        const internalRef = useRef<HTMLTextAreaElement>(null);

        const adjustHeight = () => {
            const textarea = (ref as React.MutableRefObject<HTMLTextAreaElement>)?.current || internalRef.current;
            if (!textarea) return;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        };

        useEffect(() => {
            adjustHeight();
        }, [value]);

        return (
            <textarea
                {...props}
                ref={(node) => {
                    // Maintain both refs
                    internalRef.current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
                }}
                value={value}
                className={`resize-none overflow-hidden ${className}`}
                onChange={(e) => {
                    adjustHeight();
                    if (props.onChange) props.onChange(e);
                }}
            />
        );
    }
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";
