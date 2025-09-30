type ButtonProps = {
	label: string;
	onClick?: () => void;
	className?: string;
};
export const Button = ({ label, onClick, className }: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			type='submit'
			className={`rounded-lg border border-transparent text-base font-medium font-inherit cursor-pointer transition-colors duration-250 ${className}`}>
			{label}
		</button>
	);
};
