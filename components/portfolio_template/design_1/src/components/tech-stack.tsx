"use client";


import Image from "next/image";

export interface TechItem {
    name: string;
    logo: string;
    url: string;
    invertDark?: boolean;
}

interface TechStackProps {
    items: TechItem[];
    className?: string;
    maxCols?: number;
}

export function TechStack({ items, className = "", maxCols = 16 }: TechStackProps) {
    // Determine grid columns class based on maxCols
    const gridColsClass = maxCols === 8
        ? "grid-cols-4 xs:grid-cols-6 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
        : "grid-cols-6 xs:grid-cols-6 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-16";

    return (
        <div className={`w-full ${className}`}>
            <div className={`grid ${gridColsClass} gap-1`}>
                {items.map((item) => (
                    <a
                        key={item.name}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center justify-center p-0.5 rounded-lg transition-all duration-300 aspect-square isolate"
                        aria-label={item.name}
                    >
                        {/* Logo */}
                        <div className={`relative w-8 h-8 transition-all duration-300 hover:scale-110 rounded-md p-1 isolate ${item.invertDark ? 'dark:invert' : ''}`}>
                            <Image
                                src={item.logo}
                                alt={`${item.name} logo`}
                                fill
                                className="object-contain"
                                unoptimized
                                loading="lazy"
                            />
                        </div>

                        {/* Tooltip - shows above icon on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50 bg-zinc-700 text-white">
                            {item.name}
                            {/* Arrow pointing down */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-zinc-700"></div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
