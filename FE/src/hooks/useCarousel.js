import { useRef, useState, useEffect, useCallback } from 'react';

export const useCarousel = (items, itemWidth, cloneCount = 2) => {
    const scrollContainerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const baseIndex = cloneCount;
    const [isTransitioning, setIsTransitioning] = useState(false);

    const extendedItems = [
        ...items.slice(-cloneCount),
        ...items,
        ...items.slice(0, cloneCount)
    ];

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = baseIndex * itemWidth;
        }
    }, [baseIndex, itemWidth]);

    const scrollLeft = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        
        let newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        scrollContainerRef.current?.scrollBy({ left: -itemWidth, behavior: 'smooth' });

        setTimeout(() => {
            const maxIndex = items.length - 1;
            if (newIndex < 0) {
                scrollContainerRef.current.style.scrollBehavior = 'auto';
                scrollContainerRef.current.scrollLeft = (baseIndex + maxIndex) * itemWidth;
                scrollContainerRef.current.style.scrollBehavior = 'smooth';
                setCurrentIndex(maxIndex);
            }
            setIsTransitioning(false);
        }, 350);
    };

    const scrollRight = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        
        let newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        scrollContainerRef.current?.scrollBy({ left: itemWidth, behavior: 'smooth' });

        setTimeout(() => {
            if (newIndex >= items.length) {
                scrollContainerRef.current.style.scrollBehavior = 'auto';
                scrollContainerRef.current.scrollLeft = baseIndex * itemWidth;
                scrollContainerRef.current.style.scrollBehavior = 'smooth';
                setCurrentIndex(0);
            }
            setIsTransitioning(false);
        }, 350);
    };

    const jumpToIndex = (index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        
        const currentPos = scrollContainerRef.current.scrollLeft;
        const targetPos = (baseIndex + index) * itemWidth;
        const scrollDistance = targetPos - currentPos;

        setCurrentIndex(index);
        scrollContainerRef.current.scrollBy({
            left: scrollDistance,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 350);
    };

    const handleScroll = useCallback(() => {
        if (isTransitioning) return;
        
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const index = Math.round(scrollLeft / itemWidth) - baseIndex;
        const normalized = ((index % items.length) + items.length) % items.length;
        
        if (normalized !== currentIndex) {
            setCurrentIndex(normalized);
        }
    }, [isTransitioning, itemWidth, baseIndex, items.length, currentIndex]);

    useEffect(() => {
        const el = scrollContainerRef.current;
        let timeout;
        const debounce = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleScroll, 50);
        };
        el?.addEventListener('scroll', debounce);
        return () => {
            clearTimeout(timeout);
            el?.removeEventListener('scroll', debounce);
        };
    }, [currentIndex, handleScroll]);

    return {
        scrollContainerRef,
        currentIndex,
        extendedItems,
        scrollLeft,
        scrollRight,
        jumpToIndex
    };
};