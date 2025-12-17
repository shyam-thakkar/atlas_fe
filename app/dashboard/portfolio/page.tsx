'use client';

import React from 'react';
import { PortfolioManager } from '@/components/portfolio/PortfolioManager';

export default function PortfolioPage() {
    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex-1 min-h-0">
                <PortfolioManager />
            </div>
        </div>
    );
}
