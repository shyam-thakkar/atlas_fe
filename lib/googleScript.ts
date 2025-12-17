'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface GoogleScriptProps {
    onLoad: () => void;
}

declare global {
    interface Window {
        google: any;
    }
}

export function GoogleScript({ onLoad }: GoogleScriptProps) {
    useEffect(() => {
        if (typeof window !== 'undefined' && window.google?.accounts) {
            onLoad();
        }
    }, [onLoad]);

    return React.createElement(Script, {
        src: "https://accounts.google.com/gsi/client",
        strategy: "afterInteractive",
        onLoad: onLoad
    });
}

/**
 * Initializes Google One Tap.
 * Returns true if initialization started successfully, false if Client ID is missing.
 */
export function initializeGoogleOneTap(callback: (response: any) => void): boolean {
    if (!GOOGLE_CLIENT_ID) {
        console.error("Atlas Error: NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing in environment variables.");
        return false;
    }

    if (typeof window !== 'undefined' && window.google) {
        try {
            window.google.accounts.id.cancel();
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: callback,
                auto_select: false,
                cancel_on_tap_outside: true
            });
            return true;
        } catch (e) {
            console.error("Google initialize error:", e);
            return false;
        }
    }
    return false;
}

export function renderGoogleButton(elementId: string) {
    if (typeof window !== 'undefined' && window.google) {
        const element = document.getElementById(elementId);
        if (element) {
            const width = element.offsetWidth || element.clientWidth;
            try {
                window.google.accounts.id.renderButton(element, {
                    type: 'standard',
                    shape: 'rectangular',
                    theme: 'outline',
                    text: 'continue_with',
                    size: 'large',
                    logo_alignment: 'left',
                    width: width ? width + '' : undefined
                });
            } catch (e) {
                console.error("Google renderButton error:", e);
            }
        } else {
            setTimeout(() => renderGoogleButton(elementId), 500);
        }
    }
}
