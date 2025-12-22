// Type definition for tech badge data used in editors
export interface TechBadgeData {
    name: string;
    code_name?: string;
    href?: string;
    imageSrc?: string;
    variant?: 'colored' | 'black' | 'white';
}

// Legacy export for compatibility (not used in main portfolio)
export const DESCRIPTION_TECH_BADGES: TechBadgeData[] = [];
