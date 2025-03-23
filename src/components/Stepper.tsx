import {
	Children,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type MouseEventHandler,
	type PropsWithChildren,
	type SetStateAction,
} from 'react';
import { Button, type ButtonProps } from './ui/button';
import { useEventSubscription } from '@/lib/hooks/useEventSubscription';

type StepperEventMap = {
	stepChange: ((step: number) => void)[];
};

export type StepperContextType = {
	totalSteps: number;
	currentStep: number;
	getCurrentStep: () => number;
	getTotalSteps: () => number;
	goNextStep: () => void;
	goPreviousStep: () => void;
	goToStep: (step: number) => void;
	on: (
		event: keyof StepperEventMap,
		callback: (step: number) => void,
	) => () => void;
	off: (event: keyof StepperEventMap, callback: (step: number) => void) => void;
};

const StepperContext = createContext<StepperContextType | null>(null);

export function useStepper() {
	const context = useContext(StepperContext);

	if (!context) {
		throw new Error('useStepper must be used within a Stepper component');
	}

	return context;
}

export type SetStepperApiType = Dispatch<
	SetStateAction<StepperContextType | null>
>;

export type StepperProps = {
	initialStep?: number;
	setStepperApi?: SetStepperApiType | null;
} & PropsWithChildren;

export function Stepper({
	children,
	initialStep = 0,
	setStepperApi,
}: StepperProps) {
	if (!children) {
		return null;
	}

	const totalStepsRef = useRef(Children.toArray(children).length);
	const [currentStep, setCurrentStep] = useState(initialStep);

	const { notifyEvent, createSetterWithNotification, on, off } =
		useEventSubscription<StepperEventMap>({
			stepChange: [],
		});

	// Create a setter that notifies subscribers
	const setStepWithNotification = useCallback(
		createSetterWithNotification(setCurrentStep, 'stepChange'),
		[createSetterWithNotification],
	);

	// Core stepper methods
	const getCurrentStep = useCallback(() => currentStep, [currentStep]);
	const getTotalSteps = useCallback(() => totalStepsRef.current, []);

	const goNextStep = useCallback(() => {
		setStepWithNotification((step) => {
			const nextStep = step + 1;
			if (nextStep > totalStepsRef.current - 1) return step;
			return nextStep;
		});
	}, [setStepWithNotification, totalStepsRef]);

	const goPreviousStep = useCallback(
		() =>
			setStepWithNotification((step) => {
				const previousStep = step - 1;
				if (previousStep < 0) return step;
				return previousStep;
			}),
		[setStepWithNotification],
	);

	const goToStep = useCallback(
		(step: number) => setStepWithNotification(step),
		[setStepWithNotification],
	);

	const stableApiRef = useRef<StepperContextType | null>(null);

	if (!stableApiRef.current) {
		stableApiRef.current = {
			currentStep,
			totalSteps: totalStepsRef.current,
			getCurrentStep,
			getTotalSteps,
			goNextStep,
			goPreviousStep,
			goToStep,
			on,
			off,
		};
	} else {
		// Update methods that depend on current state
		stableApiRef.current.currentStep = currentStep;
		stableApiRef.current.getCurrentStep = getCurrentStep;
	}

	useEffect(() => {
		if (typeof setStepperApi === 'function') {
			setStepperApi(stableApiRef.current);
		}

		// Initial notification of current step
		notifyEvent('stepChange', currentStep);
	}, [setStepperApi]);

	return (
		<StepperContext.Provider value={stableApiRef.current}>
			{Children.toArray(children)[currentStep]}
			{/* {children} */}
		</StepperContext.Provider>
	);
}

export function Step({ children }: PropsWithChildren) {
	return children;
}

// export function NextStepButton({ onClick, ...props }: ButtonProps) {
// 	const { goNextStep } = useStepper();

// 	const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
// 		goNextStep();
// 		if (typeof onClick === 'function') {
// 			onClick(e);
// 		}
// 	};

// 	return <Button onClick={handleClick} {...props} />;
// }

// export function GoPreviousStepButton({ onClick, ...props }: ButtonProps) {
// 	const { goPreviousStep } = useStepper();

// 	const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
// 		console.log('me ejecuto');
// 		goPreviousStep();
// 		if (typeof onClick === 'function') {
// 			onClick(e);
// 		}
// 	};

// 	return <Button type='button' onClick={handleClick} {...props} />;
// }

export default Stepper;
