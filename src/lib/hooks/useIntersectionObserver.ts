import { useEffect, useRef, useState } from 'react';

interface IntersectionObserverOptions {
	/** The percentage of element visibility needed to trigger the callback (0-1) */
	threshold?: number | number[];
	/** Margin around the root element, can have CSS margin-style values */
	rootMargin?: string;
	/** Whether to unobserve after the element has intersected once */
	triggerOnce?: boolean;
	/** Optional root element to use as viewport */
	root?: Element | null;
}

/**
 * Hook that observes when an element enters or exits the viewport
 * @param options Configuration options for the intersection observer
 * @returns [ref, isIntersecting] A ref to attach to the target element and a boolean indicating if it's visible
 */
function useIntersectionObserver<T extends Element>({
	threshold = 0.1,
	rootMargin = '0px',
	triggerOnce = true,
	root = null,
}: IntersectionObserverOptions = {}): [{ current: T | null }, boolean] {
	const elementRef = useRef<T | null>(null);
	const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

	// Store the observer instance in a ref to access it inside the callback
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const element = elementRef.current;
		// Early return if element is null
		if (!element) return;

		// Create the callback outside of the IntersectionObserver constructor
		const observerCallback: IntersectionObserverCallback = (entries) => {
			entries.forEach((entry) => {
				const isElementIntersecting = entry.isIntersecting;

				setIsIntersecting(isElementIntersecting);

				// If triggerOnce is true and element has intersected, unobserve it
				if (isElementIntersecting && triggerOnce && observerRef.current) {
					observerRef.current.unobserve(element);
				}
			});
		};

		// Create the observer and store it in the ref
		observerRef.current = new IntersectionObserver(observerCallback, {
			threshold,
			rootMargin,
			root,
		});

		// Start observing the element
		observerRef.current.observe(element);

		// Cleanup function
		return () => {
			if (observerRef.current) {
				observerRef.current.unobserve(element);
				observerRef.current.disconnect();
			}
		};
	}, [threshold, rootMargin, triggerOnce, root]);

	return [elementRef, isIntersecting];
}

export default useIntersectionObserver;
