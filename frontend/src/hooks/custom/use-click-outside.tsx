import { useEffect, useRef } from 'react';

export const useClickOutside = <T extends HTMLElement = HTMLElement>(callback: () => void) => {
    const domNode = useRef<T>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (domNode.current && !domNode.current.contains(e.target as Node)) {
                callback();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [domNode, callback]);

    return domNode;
};
