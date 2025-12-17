import React, { useState, useEffect, useRef } from 'react';
import { AutoResizeTextarea } from './AutoResizeTextarea';

interface StringArrayInputProps {
    value: string[] | undefined | null;
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function StringArrayInput({ value, onChange, placeholder, className }: StringArrayInputProps) {
    // Helper to safely parse
    const parse = (str: string) => str.split(',').map(s => s.trim()).filter(Boolean); // Clean parse for comparison
    const simpleParse = (str: string) => str.split(','); // Raw parse for state updates

    // Initial state
    const [text, setText] = useState(() => (value || []).join(', '));
    const isInternalChange = useRef(false);

    // Sync from parent ONLY if it's an external change
    useEffect(() => {
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }

        const currentParsed = parse(text);
        const incoming = value || [];

        // Compare efficiently
        const isDifferent = 
            currentParsed.length !== incoming.length || 
            currentParsed.some((val, i) => val !== incoming[i]);

        if (isDifferent) {
            setText(incoming.join(', '));
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setText(val);
        isInternalChange.current = true;
        
        // Pass "raw-ish" array to parent? 
        // If we strictly trim/filter here, we might lose empty strings that represent "typing a comma".
        // But the parent is using this for Data.
        // Let's pass the raw split so the parent has exactly what we have, 
        // BUT we need to be careful about what the parent DOES with it.
        // If the parent filters it, and passes it back, and we see it's different...
        
        // BETTER STRATEGY: 
        // Parent expects string[].
        // If I type "A, ", splits to ["A", " "].
        // onChange(["A", " "])
        
        // Let's just use the simple split for the parent update. 
        // The parent logic (or consumers of the data) should handle trimming if needed for display, 
        // but for editing, we want to preserve whitespace if possible?
        // Actually, previous editors did trim().
        
        // Let's stick to the previous simple split logic for consistency with what I just did,
        // BUT the key is the local state `text` protecting the UI from the loop.
        onChange(val.split(','));
    };

    return (
        <AutoResizeTextarea
            value={text}
            onChange={handleChange}
            className={className}
            placeholder={placeholder}
            rows={1}
        />
    );
}
