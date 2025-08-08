type ButtonProps = {
	label: string;
	onClick: any;
	className?: string;
};
export const Button = ({ label, onClick, className }: ButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={`rounded-lg border border-transparent py-2 px-5 text-base font-medium font-inherit cursor-pointer transition-colors duration-250 hover:bg-green-700 ${className}`}>
			{label}
		</button>
	);
};
