/**
 * Filters out null and undefined values from an array in a type safe manner
 * @param ts
 */
export const filterNullOrUndef = <T, >(
    ts?: (T | undefined | null)[] | null
): T[] =>
    ts?.filter(
        (t: T | undefined | null): t is T => t !== undefined && t !== null
    ) || []
