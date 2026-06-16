import { useState } from "react";
import type { Space } from "../domain/space/Space";

interface Props {
    spaces: Space[];
    loading?: boolean;
    onEnterSpace: (spaceId: number) => void;
    onCreateSpace: (name: string) => Promise<void>;
}

const AVATAR_GRADIENTS = [
    "from-[#e50914] to-[#831010]",
    "from-[#0080ff] to-[#004999]",
    "from-[#46d369] to-[#1a7a35]",
    "from-[#e87c03] to-[#9a4f00]",
    "from-[#00d4aa] to-[#007a62]",
    "from-[#b046ff] to-[#5c1f99]",
    "from-[#ff6b6b] to-[#ff4f4f]",
    "from-[#485461] to-[#28313b]",
    "from-[#9c27b0] to-[#6a1b9a]",
    "from-[#ffc107] to-[#ffa000]",
    "from-[#4caf50] to-[#2e7d32]",
    "from-[#ff9800] to-[#e65100]",
    "from-[#607d8b] to-[#455a64]",
    "from-[#e91e63] to-[#ad1457]",
    "from-[#00bcd4] to-[#00838f]",
    "from-[#ffeb3b] to-[#ffc107]",
    "from-[#9e9e9e] to-[#616161]",
    "from-[#f44336] to-[#e53935]",
    "from-[#009688] to-[#00796b]",
    "from-[#ff5722] to-[#e64a19]",
    "from-[#673ab7] to-[#3f51b5]",
];

function spaceInitial(name: string) {
    return name.trim().charAt(0).toUpperCase() || "?";
}

// This function generates a gradient for a space based on the space name
function gradientForSpace(space: Space) {
    // 
    const index = Math.floor(Math.random() * AVATAR_GRADIENTS.length * space.id.toString().length); // index is a random number between 0 and the length of the AVATAR_GRADIENTS array
    return AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
}

function ProfileSkeleton() {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="h-[84px] w-[84px] animate-pulse rounded bg-white/10 sm:h-[132px] sm:w-[132px]" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/10 sm:h-4 sm:w-24" />
        </div>
    );
}

export default function SpaceLanding({ spaces, loading, onEnterSpace, onCreateSpace }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSpaceName, setNewSpaceName] = useState("");
    const [creating, setCreating] = useState(false);

    const handleCreateSpace = async () => {
        const name = newSpaceName.trim();
        if (!name) return;

        setCreating(true);
        try {
            await onCreateSpace(name);
            setNewSpaceName("");
            setShowCreateModal(false);
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <div className="flex min-h-full min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-10 sm:px-8">
                <h1 className="mb-8 text-center text-3xl font-normal tracking-wide text-white sm:mb-12 sm:text-4xl md:text-5xl">
                    Who&apos;s using Expense Tree?
                </h1>

                <div className="flex w-full max-w-4xl flex-wrap items-start justify-center gap-4 sm:gap-6 md:gap-8">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => <ProfileSkeleton key={index} />)
                    ) : (
                        <>
                            {spaces.map((space) => (
                                <button
                                    key={space.id}
                                    type="button"
                                    onClick={() => onEnterSpace(space.id)}
                                    className="group flex w-[84px] flex-col items-center gap-2 sm:w-[132px] sm:gap-3"
                                >
                                    <div
                                        className={`flex h-[84px] w-[84px] items-center justify-center rounded bg-gradient-to-br text-3xl font-medium text-white ring-2 ring-transparent transition duration-200 group-hover:scale-110 group-hover:ring-white sm:h-[132px] sm:w-[132px] sm:text-5xl ${gradientForSpace(space)}`}
                                    >
                                        {spaceInitial(space.name)}
                                    </div>
                                    <span className="max-w-full truncate text-sm text-[#808080] transition group-hover:text-white sm:text-base">
                                        {space.name}
                                    </span>
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => setShowCreateModal(true)}
                                className="group flex w-[84px] flex-col items-center gap-2 sm:w-[132px] sm:gap-3"
                            >
                                <div className="flex h-[84px] w-[84px] items-center justify-center rounded bg-[#2f2f2f] text-4xl text-[#808080] ring-2 ring-transparent transition duration-200 group-hover:scale-110 group-hover:text-white group-hover:ring-white sm:h-[132px] sm:w-[132px] sm:text-5xl">
                                    +
                                </div>
                                <span className="text-sm text-[#808080] transition group-hover:text-white sm:text-base">
                                    Add Space
                                </span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showCreateModal ? (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4"
                    onClick={() => !creating && setShowCreateModal(false)}
                >
                    <div
                        className="w-full max-w-md rounded bg-[#181818] p-6 shadow-2xl ring-1 ring-white/10"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 className="text-xl font-medium text-white">Add a space</h2>
                        <p className="mt-2 text-sm text-[#808080]">
                            Create a space for Personal, Home, Travel, or anything you track together.
                        </p>
                        <input
                            autoFocus
                            value={newSpaceName}
                            onChange={(event) => setNewSpaceName(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    void handleCreateSpace();
                                }
                            }}
                            placeholder="Space name"
                            className="mt-4 w-full rounded border border-[#333] bg-[#333] px-4 py-3 text-white outline-none transition focus:border-white"
                        />
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={creating}
                                onClick={() => setShowCreateModal(false)}
                                className="rounded border border-[#808080] px-4 py-2 text-sm font-medium text-[#808080] transition hover:border-white hover:text-white disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={creating || !newSpaceName.trim()}
                                onClick={() => void handleCreateSpace()}
                                className="rounded bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e5e5e5] disabled:opacity-50"
                            >
                                {creating ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
