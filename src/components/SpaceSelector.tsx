import { useMemo, useState } from "react";
import type { Space } from "../domain/space/Space";
import type { User } from "../domain/user/User";

interface SpaceSelectorProps {
    spaces: Space[];
    selectedSpaceId: number | null;
    selectedSpace: Space | null;
    loadingSpaces: boolean;
    users: User[];
    currentUserId: string | null;
    setSelectedSpaceId: (spaceId: number) => void;
    createSpace: (name: string) => Promise<void>;
    inviteMember: (spaceId: number, userId: string) => Promise<void>;
}

export default function SpaceSelector({
    spaces,
    selectedSpaceId,
    selectedSpace,
    loadingSpaces,
    users,
    currentUserId,
    setSelectedSpaceId,
    createSpace,
    inviteMember,
}: SpaceSelectorProps) {
    const [newSpaceName, setNewSpaceName] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteError, setInviteError] = useState("");
    const [inviteSuccess, setInviteSuccess] = useState("");

    const handleCreateSpace = async () => {
        const name = newSpaceName.trim();
        if (!name) {
            return;
        }

        await createSpace(name);
        setNewSpaceName("");
    };

    const handleInvite = async () => {
        setInviteError("");
        setInviteSuccess("");

        if (!selectedSpaceId) {
            setInviteError("Select a space before inviting a member.");
            return;
        }

        const email = inviteEmail.trim().toLowerCase();
        if (!email) {
            setInviteError("Enter an email to invite.");
            return;
        }

        const invitedUser = users.find(
            (currentUser) => currentUser.email.toLowerCase() === email
        );

        if (!invitedUser) {
            setInviteError("No user found with that email.");
            return;
        }

        await inviteMember(selectedSpaceId, invitedUser.id);
        setInviteEmail("");
        setInviteSuccess(`Invitation sent to ${invitedUser.email}`);
    };

    const sharedLabel = useMemo(
        () => (currentUserId ? "Private" : "Shared"),
        [currentUserId]
    );

    return (
        <section className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Choose a space</h2>
                    <p className="mt-1 text-sm text-slate-500">Select a space to view and add expenses.</p>
                </div>
                <div className="flex items-center gap-2">
                    {loadingSpaces ? (
                        <p className="text-sm text-slate-600">Loading spaces...</p>
                    ) : null}
                </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
                {spaces.map((space) => (
                    <button
                        key={space.id}
                        type="button"
                        onClick={() => setSelectedSpaceId(space.id)}
                        className={`rounded-3xl border px-4 py-4 text-left transition ${selectedSpaceId === space.id
                                ? "border-blue-600 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            }`}
                    >
                        <p className="text-sm font-semibold text-slate-900">{space.name}</p>
                        <p className="mt-2 text-xs text-slate-500">
                            {space.createdBy === currentUserId ? "Private" : "Shared"}
                        </p>
                    </button>
                ))}

                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <label className="block text-sm font-medium text-slate-700">Add space</label>
                    <div className="mt-2 flex gap-2">
                        <input
                            value={newSpaceName}
                            onChange={(e) => setNewSpaceName(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="Home, Travel, Personal"
                        />
                        <button
                            type="button"
                            onClick={handleCreateSpace}
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Add
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Create a new private space and switch instantly.</p>
                </div>
            </div>

            {selectedSpace && (
                <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">Invites for {selectedSpace.name}</p>
                            <p className="text-sm text-slate-500">Invite an existing user by email to this space.</p>
                        </div>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                        <input
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="someone@example.com"
                        />
                        <button
                            type="button"
                            onClick={handleInvite}
                            className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Invite
                        </button>
                    </div>
                    {inviteError ? <p className="mt-2 text-sm text-red-600">{inviteError}</p> : null}
                    {inviteSuccess ? <p className="mt-2 text-sm text-emerald-600">{inviteSuccess}</p> : null}
                </div>
            )}
        </section>
    );
}
