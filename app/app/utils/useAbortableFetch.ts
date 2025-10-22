import { useEffect, useRef } from "react";

/**
 * useAbortableFetch
 * @param fetcher - a function that takes an AbortSignal and returns a Promise
 * @param deps - dependency array for useEffect
 * @param onResult - callback for successful fetch
 * @param onError - callback for errors (optional)
 */
export function useAbortableFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
  onResult: (data: T) => void,
  onError?: (err: unknown) => void
) {
    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        controllerRef.current?.abort(); // abort previous request
        const controller = new AbortController();
        controllerRef.current = controller;
        let mounted = true;

        fetcher(controller.signal)
            .then((data) => {
                if (mounted) onResult(data);
            })
            .catch((err: unknown) => {
                const maybe = err as { name?: string };
                if (maybe.name === "AbortError") return;
                if (mounted && onError) onError(err);
            });

        return () => {
            mounted = false;
            controller.abort();
            controllerRef.current = null;
        };
    }, [fetcher, onError, onResult, deps]);
}