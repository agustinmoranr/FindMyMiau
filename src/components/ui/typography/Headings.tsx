import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {}

export function H1({ className, children, ...props }: Props) {
	return (
		<h1
			className={cn(
				'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-baloo',
				className,
			)}
			{...props}>
			{children}
		</h1>
	);
}
