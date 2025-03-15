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
	// Fix: Use React.useRef<T>(null) instead of useRef<T>(null)
	const elementRef = useRef<T>(null);
	const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

	useEffect(() => {
		const element = elementRef.current;
		// Early return if element is null
		if (!element) return;

		const observerCallback: IntersectionObserverCallback = (entries) => {
			entries.forEach((entry) => {
				const isElementIntersecting = entry.isIntersecting;

				setIsIntersecting(isElementIntersecting);

				// If triggerOnce is true and element has intersected, unobserve it
				if (isElementIntersecting && triggerOnce) {
					observer.unobserve(element);
				}
			});
		};

		const observer = new IntersectionObserver(observerCallback, {
			threshold,
			rootMargin,
			root,
		});

		observer.observe(element);

		// Cleanup function
		return () => {
			observer.unobserve(element);
			observer.disconnect();
		};
	}, [threshold, rootMargin, triggerOnce, root]);

	return [elementRef, isIntersecting];
}

export default useIntersectionObserver;
