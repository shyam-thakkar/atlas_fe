import React from 'react';
import { StringArrayInput } from '@/components/ui/StringArrayInput';

interface TechStackEditorProps {
    data: string[] | null;
    onChange: (data: string[]) => void;
}

export function TechStackEditor({ data, onChange }: TechStackEditorProps) {
    const stack = data || [];

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Technologies</label>
                <StringArrayInput
                    value={stack}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                    placeholder="React, Node.js, Python, TypeScript..."
                />
                <p className="text-sm text-gray-500 mt-2">Separate multiple technologies with commas.</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
                {stack.map(s => s.trim()).filter(Boolean).map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100">
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    );
}
