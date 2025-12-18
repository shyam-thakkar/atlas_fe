"use client";

import { useState, useEffect, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
    isDark?: boolean;
    onToggle?: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
    // If props are provided, use them (Isolated Mode). Otherwise use global hook (Global Mode).
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Determine effective state
    const isControlled = isDark !== undefined && onToggle !== undefined;
    const currentTheme = isControlled ? (isDark ? 'dark' : 'light') : theme;

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleToggle = useCallback(() => {
        if (isControlled && onToggle) {
            onToggle();
        } else if (!isControlled) {
            setTheme(theme === "dark" ? "light" : "dark");
        }
    }, [isControlled, onToggle, theme, setTheme]);

    if (!mounted) {
        return (
            <button
                className="p-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 transition-all duration-300"
                aria-label="Toggle theme"
                disabled
            >
                <Sun className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            className="p-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-300 shadow-lg hover:shadow-inner"
            aria-label={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
        >
            {currentTheme === "dark" ? (
                <Sun className="h-5 w-5 text-zinc-100 transition-transform duration-300 rotate-0 hover:rotate-90" aria-hidden="true" />
            ) : (
                <Moon className="h-5 w-5 text-zinc-900 transition-transform duration-300 rotate-0 hover:-rotate-12" aria-hidden="true" />
            )}
        </button>
    );
}

