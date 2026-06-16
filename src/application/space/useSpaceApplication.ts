import { useCallback, useEffect, useMemo, useState } from "react";
import { Space } from "../../domain/space/Space";
import { SpaceMember } from "../../domain/space_member/SpaceMember";
import { SpaceFirestoreRepository } from "../../infrastructure/space/SpaceFirestoreRepository";
import { SpaceMemberFirestoreRepository } from "../../infrastructure/space_member/SpaceMemberFirestoreRepository";
import { addSpaceUseCase } from "../../usecases/space/addSpaceUseCase";
import { fetchSpacesForUserUseCase } from "../../usecases/space/fetchSpacesForUserUseCase";
import { addSpaceMemberUseCase } from "../../usecases/space_member/addSpaceMemberUseCase";
import { fetchSpaceMembersByUserUseCase } from "../../usecases/space_member/fetchSpaceMembersByUserUseCase";
import { queryCache, generateCacheKey } from "../../utils/queryCache";

const spaceRepository = new SpaceFirestoreRepository();
const spaceMemberRepository = new SpaceMemberFirestoreRepository();

const DEFAULT_SPACE_NAME = "Personal";

export const useSpaceApplication = (authUserId: string | null) => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
    const [loadingSpaces, setLoadingSpaces] = useState(false);
    const [spaceError, setSpaceError] = useState("");

    const loadSpaces = useCallback(async () => {
        if (!authUserId) {
            setSpaces([]);
            return;
        }

        const cacheKey = generateCacheKey("spaces", authUserId);

        // Check cache first
        const cachedSpaces = queryCache.get<Space[]>(cacheKey);
        if (cachedSpaces) {
            setSpaces(cachedSpaces);
            if (!selectedSpaceId && cachedSpaces.length > 0) {
                setSelectedSpaceId(cachedSpaces[0].id);
            }
            return;
        }

        setSpaceError("");
        setLoadingSpaces(true);

        try {
            const docs = await fetchSpacesForUserUseCase(spaceRepository, spaceMemberRepository, authUserId);
            setSpaces(docs);
            // Cache for 10 minutes
            queryCache.set(cacheKey, docs, 10 * 60 * 1000);
            if (!selectedSpaceId && docs.length > 0) {
                setSelectedSpaceId(docs[0].id);
            }
        } catch (err) {
            console.error("Error loading spaces:", err);
            setSpaceError("Unable to load spaces.");
        } finally {
            setLoadingSpaces(false);
        }
    }, [authUserId, selectedSpaceId]);

    const createDefaultSpace = useCallback(async () => {
        if (!authUserId) {
            return;
        }

        try {
            const existingMembers = await fetchSpaceMembersByUserUseCase(spaceMemberRepository, authUserId);
            if (existingMembers.length > 0) {
                return;
            }

            const defaultSpace = Space.createNew({
                name: DEFAULT_SPACE_NAME,
                createdBy: authUserId,
            });

            await addSpaceUseCase(spaceRepository, defaultSpace);
            await addSpaceMemberUseCase(
                spaceMemberRepository,
                SpaceMember.createNew({ userId: authUserId, spaceId: defaultSpace.id })
            );

            setSpaces([defaultSpace]);
            setSelectedSpaceId(defaultSpace.id);
            // Invalidate cache after creating space
            queryCache.invalidate(generateCacheKey("spaces", authUserId));
        } catch (err) {
            console.error("Error creating default space:", err);
            setSpaceError("Unable to create default space.");
        }
    }, [authUserId]);

    const createSpace = useCallback(
        async (name: string) => {
            if (!authUserId) {
                setSpaceError("You must be signed in to create a space.");
                return;
            }

            if (!name.trim()) {
                setSpaceError("Space name is required.");
                return;
            }

            try {
                setSpaceError("");
                const newSpace = Space.createNew({ name, createdBy: authUserId });
                await addSpaceUseCase(spaceRepository, newSpace);
                await addSpaceMemberUseCase(
                    spaceMemberRepository,
                    SpaceMember.createNew({ userId: authUserId, spaceId: newSpace.id })
                );
                setSpaces((current) => [...current, newSpace]);
                setSelectedSpaceId(newSpace.id);
                // Invalidate cache after creating space
                queryCache.invalidate(generateCacheKey("spaces", authUserId));
            } catch (err) {
                console.error("Error creating space:", err);
                setSpaceError("Unable to create space.");
            }
        },
        [authUserId]
    );

    const inviteMember = useCallback(
        async (spaceId: number, userId: string) => {
            if (!authUserId) {
                setSpaceError("You must be signed in to invite members.");
                return;
            }

            try {
                setSpaceError("");
                await addSpaceMemberUseCase(
                    spaceMemberRepository,
                    SpaceMember.createNew({ userId, spaceId })
                );
            } catch (err) {
                console.error("Error inviting member:", err);
                setSpaceError("Unable to invite member.");
            }
        },
        [authUserId]
    );

    const selectedSpace = useMemo(
        () => spaces.find((space) => space.id === selectedSpaceId) ?? null,
        [spaces, selectedSpaceId]
    );

    useEffect(() => {
        if (!authUserId) {
            setSpaces([]);
            setSelectedSpaceId(null);
            return;
        }

        void createDefaultSpace();
    }, [authUserId, createDefaultSpace]);

    useEffect(() => {
        void loadSpaces();
    }, [loadSpaces]);

    return {
        spaces,
        selectedSpace,
        selectedSpaceId,
        loadingSpaces,
        spaceError,
        setSelectedSpaceId,
        createSpace,
        inviteMember,
        loadSpaces,
    };
};
