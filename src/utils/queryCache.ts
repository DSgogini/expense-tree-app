/**
 * Simple query cache with TTL (Time To Live)
 * Prevents duplicate requests for the same data within a time window
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // in milliseconds
}

class QueryCache {
    private cache = new Map<string, CacheEntry<unknown>>();

    /**
     * Get cached data if available and not expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key) as CacheEntry<T> | undefined;

        if (!entry) {
            return null;
        }

        const now = Date.now();
        const isExpired = now - entry.timestamp > entry.ttl;

        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Set data in cache with TTL
     */
    set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMs,
        });
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Clear cache for a specific key
     */
    invalidate(key: string): void {
        this.cache.delete(key);
    }
}

export const queryCache = new QueryCache();

/**
 * Helper to generate cache keys
 */
export const generateCacheKey = (...parts: (string | number)[]): string => {
    return parts.map(p => String(p)).join(":");
};
