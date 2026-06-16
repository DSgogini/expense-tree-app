import SpaceLanding from "../components/SpaceLanding";
import type { Space } from "../domain/space/Space";

interface Props {
    spaces: Space[];
    loading?: boolean;
    error?: string;
    userDisplayName?: string;
    onEnterSpace: (spaceId: number) => void;
    onCreateSpace: (name: string) => Promise<void>;
    onSignOut: () => void;
}

export default function SpaceLandingPage({
    spaces,
    loading,
    error,
    userDisplayName,
    onEnterSpace,
    onCreateSpace,
    onSignOut,
}: Props) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[#141414]">
            <header className="flex items-center justify-between px-6 py-5 sm:px-10">
                <p className="text-xl font-bold tracking-tight text-[#e50914] sm:text-2xl">Expense Tree</p>
                <div className="flex items-center gap-4">
                    {userDisplayName ? (
                        <span className="hidden text-sm text-[#808080] sm:inline">{userDisplayName}</span>
                    ) : null}
                    <button
                        type="button"
                        onClick={onSignOut}
                        className="rounded border border-[#808080] px-4 py-1.5 text-sm font-medium text-[#808080] transition hover:border-white hover:text-white"
                    >
                        Sign out
                    </button>
                </div>
            </header>

            {error ? (
                <p className="px-6 text-center text-sm text-red-400 sm:px-10">{error}</p>
            ) : null}

            <SpaceLanding
                spaces={spaces}
                loading={loading}
                onEnterSpace={onEnterSpace}
                onCreateSpace={onCreateSpace}
            />
        </div>
    );
}
