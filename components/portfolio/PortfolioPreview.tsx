import React from 'react';
import { StructuredPortfolio } from '@/types/portfolio';
import { PortfolioDesign1 } from '@/components/portfolio_template/design_1';

interface PortfolioPreviewProps {
    data: StructuredPortfolio | null;
}

export function PortfolioPreview({ data }: PortfolioPreviewProps) {
    return <PortfolioDesign1 data={data} />;
}
