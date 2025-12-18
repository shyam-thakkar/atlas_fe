"use client";

import { useState, useEffect } from "react";

interface TypingAnimationProps {
    text: string;
    className?: string;
    speed?: number;
    delay?: number;
}

export function TypingAnimation({
    text,
    className = "",
    speed = 50,
    delay = 0
}: TypingAnimationProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;



        // Determine speed based on state
        // Typing speed: speed prop
        // Deleting speed: speed / 2 (faster)
        // Pause after delete: 3000ms (handled by timeout in effect cleanup or separate logic?)

        // Better approach with setTimeout for variable delays
        let timer: NodeJS.Timeout;

        if (isDeleting && displayedText === "") {
            // Just finished deleting, wait 3 seconds before typing again
            timer = setTimeout(() => {
                setIsDeleting(false);
            }, 3000);
        } else if (!isDeleting && displayedText === text) {
            // Just finished typing, wait 2 seconds before deleting
            timer = setTimeout(() => {
                setIsDeleting(true);
            }, 2000);
        } else {
            // Typing or deleting characters
            const currentSpeed = isDeleting ? speed / 2 : speed;
            timer = setTimeout(() => {
                if (isDeleting) {
                    setDisplayedText(text.substring(0, displayedText.length - 1));
                } else {
                    setDisplayedText(text.substring(0, displayedText.length + 1));
                }
            }, currentSpeed);
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, speed, text, started]);

    return (
        <span className={`font-heading ${className}`}>
            {displayedText}
            <span className="animate-pulse">|</span>
        </span>
    );
}
