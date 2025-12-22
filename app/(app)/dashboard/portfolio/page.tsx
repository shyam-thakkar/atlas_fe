'use client';

import React from 'react';
import { PortfolioManager } from '@/components/portfolio/PortfolioManager';

export default function PortfolioPage() {
    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-zinc-950">
            <div className="flex-1 min-h-0 overflow-hidden">
                <PortfolioManager />
            </div>
        </div>
    );
}

