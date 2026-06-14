import React from "react";
import type { Space } from "../domain/space/Space";
import type { User } from "../domain/user/User";

interface Props {
    spaces: Space[];
    users?: User[];
    currentUserId: string | null;
    currentUserDisplayName?: string;
    loading?: boolean;
    onEnterSpace: (spaceId: number) => void;
    onCreateSpace: (name: string) => Promise<void>;
}

function initialsFromName(name: string) {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0]?.slice(0, 1).toUpperCase() ?? "";
}

export default function SpaceLanding({
    spaces,
    users = [],
    currentUserId,
    currentUserDisplayName = "",
    loading,
    onEnterSpace,
    onCreateSpace,
}: Props) {
    const handleAddSpace = async () => {
        const name = window.prompt("Create a new space (e.g. Personal, Home, Travel)");
        if (!name) return;
        await onCreateSpace(name.trim());
    };

    return (
        <div className="fixed inset-0 bg-[#141414] flex flex-col items-center justify-center py-12 z-50">
            <h1 className="mb-10 text-5xl font-semibold text-white">Who's using this space?</h1>

            <div className="flex gap-8">
                {loading ? (
                    <p className="text-slate-300">Loading spaces...</p>
                ) : (
                    <>
                        {spaces.map((space, index) => {
                            const owner = users.find((u) => u.id === space.createdBy);
                            const initials = owner
                                ? initialsFromName(owner.displayName)
                                : initialsFromName(space.name);
                            const isFirstSpace = index === 0;
                            const displayLabel = isFirstSpace && currentUserDisplayName ? currentUserDisplayName : space.name;

                            return (
                                <button
                                    key={space.id}
                                    onClick={() => onEnterSpace(space.id)}
                                    className="flex w-40 cursor-pointer flex-col items-center gap-3 rounded-xl bg-white/5 px-6 py-6 text-center transition hover:bg-[#e5e5e5]"
                                >
                                    <div className="flex h-28 w-28 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-blue-700 text-2xl font-semibold text-white">
                                        {initials}
                                    </div>
                                    <span className="mt-2 text-slate-300 hover:text-slate-900 text-sm">{displayLabel}</span>
                                </button>
                            );
                        })}

                        <button
                            onClick={handleAddSpace}
                            className="flex w-40 flex-col items-center gap-3 rounded-xl border border-slate-600 bg-white/5 px-6 py-6 text-center text-slate-300 transition hover:bg-[#e5e5e5] hover:text-slate-900"
                        >
                            <div className="flex h-28 w-28 items-center justify-center rounded-md bg-slate-700 text-3xl">+</div>
                            <span className="mt-2 text-sm">Add Space</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
