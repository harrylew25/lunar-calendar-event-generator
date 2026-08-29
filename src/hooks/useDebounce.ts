import { useEffect, useState } from 'react';

const DEFAULT_DELAY_IN_MS = 300;

const useDebounce = <T>(
    value: T,
    delayInMs: number = DEFAULT_DELAY_IN_MS,
): T => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delayInMs);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delayInMs]);

    return debouncedValue;
};

export { useDebounce };
