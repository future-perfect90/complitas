import clsx from 'clsx';
type ButtonProps = {
	label: string;
	onClick?: () => void;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	style?: 'primary' | 'secondary' | 'tertiary';
};
export const Button = ({
	label,
	onClick,
	className,
	type = 'button',
	disabled,
	style,
}: ButtonProps) => {
	const baseClasses =
		'rounded-lg font-medium font-inherit text-[#F8F9FA] cursor-pointer transition-colors duration-250 disabled:opacity-50 disabled:cursor-not-allowed text-sm';

	let styleClasses;
	switch (style) {
		case 'primary':
			styleClasses =
				'bg-[#4D83AF] dark:bg-[#4D83AF] hover:bg-[#4D83AF]/70 hover:dark:bg-[#4D83AF]/70';
			break;
		case 'secondary':
			styleClasses =
				'bg-[#F29F05] dark:bg-[#F2B705] hover:bg-[#F29F05]/70 hover:dark:bg-[#F2B705]/70';
			break;
		case 'tertiary':
			styleClasses =
				'bg-[#22A699] dark:bg-[#38B2A5] hover:bg-[#22A699]/70 hover:dark:bg-[#38B2A5]/70';
			break;
		default:
			styleClasses =
				'bg-[#4D83AF] dark:bg-[#4D83AF] hover:bg-[#4D83AF]/70 hover:dark:bg-[#4D83AF]/70';
			break;
	}

	return (
		<button
			onClick={onClick}
			type={type}
			disabled={disabled}
			className={clsx(baseClasses, styleClasses, className)}>
			{label}
		</button>
	);
};
