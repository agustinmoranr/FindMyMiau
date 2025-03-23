import { useCallback, useRef } from 'react';

/**
 * A generic hook for implementing event subscriptions in React components.
 *
 * @template T - The type of event map where keys are event names and values are arrays of callbacks
 * @template K - The type of event names (keys of T)
 * @template V - The type of event payload
 *
 * @param {T} initialEventMap - The initial map of event names to arrays of callback functions
 * @returns {object} An object containing subscription methods and state update utilities
 */
export function useEventSubscription<
	T extends Record<K, Array<(payload: V) => void>>,
	K extends string = string,
	V = any,
>(initialEventMap: T) {
	// Store event callbacks in a ref to maintain them across renders
	const eventsRef = useRef<T>(initialEventMap);

	/**
	 * Notifies all subscribers of a specific event with the given payload
	 */
	const notifyEvent = useCallback(<E extends K>(eventName: E, payload: V) => {
		// Ensure the event exists in our map
		if (!eventsRef.current[eventName]) {
			console.warn(`Event "${eventName}" does not exist in the event map`);
			return;
		}

		// Notify all subscribers with a slight delay to avoid React batching issues
		setTimeout(() => {
			eventsRef.current[eventName].forEach((callback) => callback(payload));
		}, 0);
	}, []);

	/**
	 * Creates a state setter function that also notifies subscribers
	 */
	const createSetterWithNotification = useCallback(
		<S>(
			setter: (value: React.SetStateAction<S>) => void,
			eventName: K,
			transformPayload: (newState: S) => V = (newState) =>
				newState as unknown as V,
		) => {
			return (valueOrUpdater: React.SetStateAction<S>) => {
				setter((prevState) => {
					const newState =
						typeof valueOrUpdater === 'function'
							? (valueOrUpdater as (prev: S) => S)(prevState)
							: valueOrUpdater;

					// Only notify if state actually changed
					if (newState !== prevState) {
						const payload = transformPayload(newState);
						notifyEvent(eventName, payload);
					}

					return newState;
				});
			};
		},
		[notifyEvent],
	);

	/**
	 * Subscribes a callback to a specific event
	 * Returns an unsubscribe function
	 */
	const on = useCallback(
		<E extends K>(eventName: E, callback: (payload: V) => void) => {
			// Ensure the event exists
			if (!eventsRef.current[eventName]) {
				console.warn(`Event "${eventName}" does not exist in the event map`);
				return () => {};
			}

			// Add the callback to subscribers
			eventsRef.current[eventName].push(callback);

			// Return unsubscribe function
			return () => off(eventName, callback);
		},
		[],
	);

	/**
	 * Removes a subscription for a specific event
	 */
	const off = useCallback(
		<E extends K>(eventName: E, callback: (payload: V) => void) => {
			// Ensure the event exists
			if (!eventsRef.current[eventName]) {
				console.warn(`Event "${eventName}" does not exist in the event map`);
				return;
			}

			// Remove the callback from subscribers
			eventsRef.current[eventName] = eventsRef.current[eventName].filter(
				(cb) => cb !== callback,
			) as T[E];
		},
		[],
	);

	return {
		notifyEvent,
		createSetterWithNotification,
		on,
		off,
		// Expose events ref for advanced use cases
		eventsRef,
	};
}
