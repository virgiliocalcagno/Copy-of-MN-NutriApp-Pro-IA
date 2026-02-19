import { useCallback, useRef } from 'react';

export const useLongPress = (
    onLongPress: () => void,
    { delay = 500 } = {}
) => {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>();

    const start = useCallback(() => {
        timeoutRef.current = setTimeout(onLongPress, delay);
    }, [onLongPress, delay]);

    const stop = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return {
        onMouseDown: start,
        onMouseUp: stop,
        onMouseLeave: stop,
        onTouchStart: start,
        onTouchEnd: stop,
    };
};
