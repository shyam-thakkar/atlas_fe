import React, { useEffect, useRef, TextareaHTMLAttributes } from 'react';

// Extend standard Textarea props
interface AutoResizeTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
}

export function AutoResizeTextarea({ value, className, ...props }: AutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Reset height to auto to sort-of "shrink" if content is deleted
        textarea.style.height = 'auto';
        // Set new height based on scrollHeight
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    // Adjust height on value change
    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            {...props}
            ref={textareaRef}
            value={value}
            className={`resize-none overflow-hidden ${className}`}
            onChange={(e) => {
                adjustHeight();
                if (props.onChange) props.onChange(e);
            }}
        />
    );
}
