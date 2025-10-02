type ButtonProps = {
	label: string;
	onClick?: () => void;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
};
export const Button = ({
	label,
	onClick,
	className,
	type = 'button',
	disabled,
}: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			type={type}
			disabled={disabled}
			className={`rounded-lg border border-transparent text-base font-medium font-inherit cursor-pointer transition-colors duration-250 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
			{label}
		</button>
	);
};
