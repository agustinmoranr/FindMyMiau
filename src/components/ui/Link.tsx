import { cn } from '@/lib/utils';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

// const { class: classProps, ...props } = Astro.props;

export default function Link({ children, className, ...props }: Props) {
	return (
		<a
			className={cn(
				'font-medium hover:opacity-90 transition-opacity ease-[ease]',
				className,
			)}
			{...props}>
			{children}
		</a>
	);
}
