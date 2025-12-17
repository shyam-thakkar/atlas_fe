import React, { useState } from 'react';

interface EditableSectionProps<T> {
    title: string;
    description?: string;
    data: T;
    onSave: (data: T) => Promise<void>;
    renderView: (data: T) => React.ReactNode;
    renderEdit: (data: T, onChange: (newData: T) => void) => React.ReactNode;
}

export function EditableSection<T>({
    title,
    description,
    data,
    onSave,
    renderView,
    renderEdit
}: EditableSectionProps<T>) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<T>(data);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEdit = () => {
        setEditData(JSON.parse(JSON.stringify(data))); // Deep copy
        setIsEditing(true);
        setError(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(data); // Revert
        setError(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            await onSave(editData);
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    const hasChanges = JSON.stringify(data) !== JSON.stringify(editData);

    return (
        <section className={`bg-white rounded-xl border transition-all duration-200 ${isEditing ? 'border-indigo-200 ring-4 ring-indigo-50/50 shadow-md' : 'border-gray-200 shadow-sm'}`}>
            {/* Hedaer */}
            <div className={`px-6 py-4 flex items-center justify-between border-b ${isEditing ? 'bg-indigo-50/30 border-indigo-100' : 'bg-transparent border-gray-100'}`}>
                <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isEditing ? 'text-indigo-600' : 'text-gray-400'}`}>
                        {title}
                    </h3>
                    {description && isEditing && (
                        <p className="text-xs text-indigo-400 mt-1">{description}</p>
                    )}
                </div>
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors"
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {isEditing ? (
                    <div className="animate-in fade-in duration-200">
                        {renderEdit(editData, setEditData)}

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {error}
                            </div>
                        )}

                        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !hasChanges}
                                className={`
                                    px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-all flex items-center gap-2
                                    ${isSaving || !hasChanges
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.98]'
                                    }
                                `}
                            >
                                {isSaving && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-200">
                        {renderView(data)}
                    </div>
                )}
            </div>
        </section>
    );
}
