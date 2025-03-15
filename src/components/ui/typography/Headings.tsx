import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {}

export function H1({ className, children, ...props }: Props) {
	return (
		<h1
			className={cn(
				'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl/18 balooFont',
				className,
			)}
			{...props}>
			{children}
		</h1>
	);
}

export function H2({ className, children, ...props }: Props) {
	return (
		<h2
			className={cn(
				'scroll-m-20 pb-2 text-6xl sm:text-5xl font-bold tracking-tighter first:mt-0 balooFont',
				className,
			)}
			{...props}>
			{children}
		</h2>
	);
}

export function H3({ className, children, ...props }: Props) {
	return (
		<h3
			className={cn(
				'scroll-m-20 text-2xl font-semibold tracking-tight balooFont',
				className,
			)}
			{...props}>
			{children}
		</h3>
	);
}
export function H4({ className, children, ...props }: Props) {
	return (
		<h4
			className={cn(
				'scroll-m-20 text-xl font-semibold tracking-tight balooFont',
				className,
			)}
			{...props}>
			{children}
		</h4>
	);
}
