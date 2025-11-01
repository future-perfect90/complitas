import React from 'react';
import Label from './Label';
import ValidationError from './ValidationError';

interface Props {
	label: string;
	value: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	type?: string;
	required?: boolean;
	disabled?: boolean;
	layout?: 'horizontal' | 'vertical';
	tooltip?: boolean;
	tooltipContent?: string;
	error?: string;
}

const TextField: React.FC<Props> = ({
	label,
	value,
	onChange,
	onBlur,
	type,
	required,
	disabled = false,
	layout = 'vertical',
	tooltip,
	tooltipContent,
	error,
}) => {
	const errorClasses =
		error ? 'border-red-500 dark:border-red-300' : 'dark:border-gray-500';

	if (layout === 'horizontal') {
		return (
			<div className="flex items-center space-x-2">
				<Label label={label} />
				<input
					type={type}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					required={required}
					disabled={disabled}
					className={`px-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-[#212529] dark:text-[#F8F9FA] disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-700 bg-white dark:bg-gray-600 ${errorClasses}`}
				/>
			</div>
		);
	} else {
		return (
			<div className="mb-2">
				<Label
					label={label}
					tooltip={tooltip}
					tooltipContent={tooltipContent}
				/>
				<input
					type={type}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					required={required}
					disabled={disabled}
					className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:border-[#4D83AF] dark:focus:border-[#6DA0CE] text-[#212529] dark:text-[#F8F9FA] dark:bg-gray-600 bg-white disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-700 ${errorClasses}`}
				/>
				<ValidationError message={error} />
			</div>
		);
	}
};

export default TextField;
