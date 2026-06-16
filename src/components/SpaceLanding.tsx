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
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[#141414]">
            <div className="flex min-h-full min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-6 text-center sm:px-6 sm:py-10">
                <h1 className="mb-6 max-w-2xl text-2xl font-semibold text-white sm:mb-8 sm:text-3xl md:text-5xl">
                    Who's using this space?
                </h1>

                <div className="grid w-full max-w-5xl grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 md:gap-8">
                    {loading ? (
                        <p className="col-span-2 text-slate-300 sm:col-span-full">Loading spaces...</p>
                    ) : (
                        <>
                            {spaces.map((space, index) => {
                                const owner = users.find((u) => u.id === space.createdBy);
                                const initials = owner
                                    ? initialsFromName(owner.displayName)
                                    : initialsFromName(space.name);
                                const isFirstSpace = index === 0;
                                const displayLabel =
                                    isFirstSpace && currentUserDisplayName ? currentUserDisplayName : space.name;

                                return (
                                    <button
                                        key={space.id}
                                        onClick={() => onEnterSpace(space.id)}
                                        className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl bg-white/5 px-3 py-4 text-center transition hover:bg-[#e5e5e5] sm:min-w-[200px] sm:max-w-[200px] sm:gap-3 sm:px-6 sm:py-6"
                                    >
                                        <div className="flex h-20 w-20 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-blue-700 text-xl font-semibold text-white sm:h-28 sm:w-28 sm:text-2xl">
                                            {initials}
                                        </div>
                                        <span className="mt-1 line-clamp-2 text-xs text-slate-300 hover:text-slate-900 sm:mt-2 sm:text-sm">
                                            {displayLabel}
                                        </span>
                                    </button>
                                );
                            })}

                            <button
                                onClick={handleAddSpace}
                                className="flex w-full flex-col items-center gap-2 rounded-xl border border-slate-600 bg-white/5 px-3 py-4 text-center text-slate-300 transition hover:bg-[#e5e5e5] hover:text-slate-900 sm:min-w-[200px] sm:max-w-[200px] sm:gap-3 sm:px-6 sm:py-6"
                            >
                                <div className="flex h-20 w-20 items-center justify-center rounded-md bg-slate-700 text-2xl sm:h-28 sm:w-28 sm:text-3xl">
                                    +
                                </div>
                                <span className="mt-1 text-xs sm:mt-2 sm:text-sm">Add Space</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
