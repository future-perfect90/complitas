type ButtonProps = {
	label: string;
	onClick?: () => void;
	className?: string;
};
export const Button = ({ label, onClick, className }: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={`rounded-lg border border-transparent py-2 px-5 text-base font-medium font-inherit cursor-pointer transition-colors duration-250 ${className}`}>
			{label}
		</button>
	);
};
