/**
 * services/utils.ts
 * Utilitaires partagés entre tous les services Minsii.
 * ARCH #1 — DRY: withTimeout() était dupliqué dans teacherService et messageService.
 */

/** Durée de timeout par défaut pour les appels Supabase (10 secondes) */
export const SUPABASE_TIMEOUT = 10_000;

/**
 * Encapsule une promesse Supabase avec un timeout pour éviter les hangs infinis.
 * @param thenable - La promesse à encapsuler
 * @param timeoutMs - Durée du timeout en ms (défaut: 10 000ms)
 */
export async function withTimeout<T>(
    thenable: PromiseLike<T>,
    timeoutMs: number = SUPABASE_TIMEOUT
): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
            () => reject(new Error(`Le serveur Minsii ne répond pas (Timeout ${timeoutMs}ms)`)),
            timeoutMs
        );
    });
    return Promise.race([Promise.resolve(thenable), timeoutPromise]);
}
