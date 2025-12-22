import React from 'react';
import { StructuredPortfolio } from '@/types/portfolio';
import { PortfolioDesign1 } from '@/components/portfolio_template/design_1';

interface PortfolioPreviewProps {
    data: StructuredPortfolio | null;
    fullWidth?: boolean;
}

export function PortfolioPreview({ data, fullWidth = false }: PortfolioPreviewProps) {
    return <PortfolioDesign1 data={data} fullWidth={fullWidth} />;
}
